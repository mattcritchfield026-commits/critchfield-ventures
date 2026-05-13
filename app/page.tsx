"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number;
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string;
}

interface BookingPayload {
  name: string;
  email: string;
  businessName: string;
  website: string;
  priorityGoal: string;
  preferredDate: string;
}

const demoVideoUrl =
  process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ||
  "https://www.youtube.com/embed/j4M6M6W8D6I";

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistError, setWaitlistError] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const [bookingForm, setBookingForm] = useState<BookingPayload>({
    name: "",
    email: "",
    businessName: "",
    website: "",
    priorityGoal: "Google profile optimization",
    preferredDate: "",
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError("");

    if (isAuthLoading) {
      setWaitlistError("Please wait while we verify your identity...");
      return;
    }

    if (authError || !authData?.success) {
      setWaitlistError("Please authenticate to join the waitlist");
      return;
    }

    if (!waitlistEmail) {
      setWaitlistError("Please enter your email address");
      return;
    }

    if (!validateEmail(waitlistEmail)) {
      setWaitlistError("Please enter a valid email address");
      return;
    }

    console.log("Valid waitlist email submitted:", waitlistEmail);
    console.log("User authenticated:", authData.user);
    setWaitlistSubmitted(true);
  };

  const handleBookingInput = (field: keyof BookingPayload, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingMessage("");

    if (!bookingForm.name || !bookingForm.email || !bookingForm.businessName || !bookingForm.preferredDate) {
      setBookingError("Please complete all required booking fields.");
      return;
    }

    if (!validateEmail(bookingForm.email)) {
      setBookingError("Please enter a valid booking email address.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          fid: authData?.user?.fid ?? null,
          source: "foyera-miniapp",
          createdAt: new Date().toISOString(),
        }),
      });

      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setBookingError(result.error || "Unable to submit booking request right now.");
        return;
      }

      setBookingMessage(result.message || "Booked! We will follow up with your strategy session.");
      setBookingForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        businessName: "",
        website: "",
        preferredDate: "",
      }));
    } catch (error) {
      console.error("Booking submission failed", error);
      setBookingError("Network error while submitting booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src="/foyera-logo.svg" alt={`${minikitConfig.miniapp.name} logo`} width={180} height={32} priority />
          <span className={styles.tagline}>Innovation Engine for Local Search Growth</span>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <p className={styles.kicker}>AI + Search Visibility + Revenue Intelligence</p>
          <h1 className={styles.title}>Launch the Next-Gen Growth Stack for Small Business Search Dominance</h1>
          <p className={styles.subtitle}>
            Hey {context?.user?.displayName || "there"}, Foyera helps small businesses rank higher, optimize Google
            Business Profiles, and convert clicks into booked revenue.
          </p>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.badge}>AI SEO Ops</span>
              <p>Automated keyword clustering, local intent targeting, and GBP post recommendations.</p>
            </div>
            <div className={styles.highlight}>
              <span className={styles.badge}>Profile Repair</span>
              <p>Fix citations, categories, and NAP consistency to improve map-pack performance.</p>
            </div>
            <div className={styles.highlight}>
              <span className={styles.badge}>Conversion Loop</span>
              <p>Capture bookings and route them into your mccnow.net Excel workflow in real time.</p>
            </div>
          </div>
        </section>

        <section className={styles.videoSection}>
          <h2>How We Grow Your Search Results</h2>
          <p>Watch this quick walkthrough of how we increase local visibility and optimize Google profiles.</p>
          <div className={styles.videoFrame}>
            <iframe
              src={demoVideoUrl}
              title="Foyera Growth Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section className={styles.ctaGrid}>
          <form onSubmit={handleWaitlistSubmit} className={styles.formCard}>
            <h3>Join the Innovation Waitlist</h3>
            <input
              type="email"
              placeholder="Your business email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              className={styles.input}
              aria-label="Waitlist email address"
              disabled={waitlistSubmitted}
            />
            {waitlistError && <p className={styles.error}>{waitlistError}</p>}
            <button type="submit" className={styles.primaryButton} disabled={waitlistSubmitted}>
              {waitlistSubmitted ? "You are on the list" : "Join Waitlist"}
            </button>
          </form>

          <form onSubmit={handleBookNow} className={styles.formCard}>
            <h3>Book Now</h3>
            <p className={styles.cardDescription}>Professional strategy call + live implementation roadmap.</p>
            <input
              className={styles.input}
              type="text"
              value={bookingForm.name}
              onChange={(e) => handleBookingInput("name", e.target.value)}
              placeholder="Full name *"
              required
            />
            <input
              className={styles.input}
              type="email"
              value={bookingForm.email}
              onChange={(e) => handleBookingInput("email", e.target.value)}
              placeholder="Business email *"
              required
            />
            <input
              className={styles.input}
              type="text"
              value={bookingForm.businessName}
              onChange={(e) => handleBookingInput("businessName", e.target.value)}
              placeholder="Business name *"
              required
            />
            <input
              className={styles.input}
              type="url"
              value={bookingForm.website}
              onChange={(e) => handleBookingInput("website", e.target.value)}
              placeholder="Website URL"
            />
            <select
              className={styles.input}
              value={bookingForm.priorityGoal}
              onChange={(e) => handleBookingInput("priorityGoal", e.target.value)}
            >
              <option>Google profile optimization</option>
              <option>Higher local map rankings</option>
              <option>More inbound calls and leads</option>
              <option>Reputation and review growth</option>
            </select>
            <input
              className={styles.input}
              type="datetime-local"
              value={bookingForm.preferredDate}
              onChange={(e) => handleBookingInput("preferredDate", e.target.value)}
              required
            />

            {bookingError && <p className={styles.error}>{bookingError}</p>}
            {bookingMessage && <p className={styles.success}>{bookingMessage}</p>}

            <button className={styles.primaryButton} type="submit" disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
            <p className={styles.footnote}>
              Booking submissions can be streamed to Excel by setting <code>BOOKING_WEBHOOK_URL</code> to your Power
              Automate or mccnow.net ingestion endpoint.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
