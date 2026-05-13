"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
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

interface BookingForm {
  name: string;
  email: string;
  businessName: string;
  website: string;
  challenge: string;
}

const initialBookingForm: BookingForm = {
  name: "",
  email: "",
  businessName: "",
  website: "",
  challenge: "",
};

const demoVideoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ";

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [email, setEmail] = useState("");
  const [waitlistError, setWaitlistError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>(initialBookingForm);
  const [bookingState, setBookingState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
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

    if (!email) {
      setWaitlistError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setWaitlistError("Please enter a valid email address");
      return;
    }

    console.log("Valid email submitted:", email);
    console.log("User authenticated:", authData.user);
    setSubmitted(true);

    router.push("/success");
  };

  const handleBookingChange = (field: keyof BookingForm, value: string) => {
    setBookingForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingForm.name || !bookingForm.businessName || !validateEmail(bookingForm.email)) {
      setBookingState("error");
      setBookingMessage("Please add your name, business name, and a valid email before booking.");
      return;
    }

    setBookingState("submitting");
    setBookingMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          source: "miniapp",
          requestedAt: new Date().toISOString(),
          fid: context?.user?.fid ?? null,
          displayName: context?.user?.displayName ?? null,
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to schedule right now.");
      }

      setBookingState("success");
      setBookingMessage("Booked! We sent your request to the MCCNow scheduling sheet.");
      setBookingForm(initialBookingForm);
    } catch (error) {
      setBookingState("error");
      setBookingMessage(error instanceof Error ? error.message : "Unable to schedule right now.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src="/foyera-logo.svg" alt={`${minikitConfig.miniapp.name} logo`} width={180} height={32} priority />
          <span className={styles.tagline}>Innovation that dominates search</span>
        </div>
        <button className={styles.closeButton} type="button" aria-label="Close mini app">
          ✕
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.waitlistForm}>
          <h1 className={styles.title}>AI GROWTH ENGINE FOR LOCAL BUSINESS</h1>
          <p className={styles.subtitle}>
            Hey {context?.user?.displayName || "there"}, Foyera deploys an innovation-first search stack to boost rankings,
            repair Google profiles, and convert visibility into booked revenue.
          </p>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.badge}>Search Lift</span>
              <p>Map pack optimization + AI citation expansion across your local footprint.</p>
            </div>
            <div className={styles.highlight}>
              <span className={styles.badge}>Profile Repair</span>
              <p>Google Business Profile cleanup, suppression recovery, and trust-signal upgrades.</p>
            </div>
            <div className={styles.highlight}>
              <span className={styles.badge}>Booked Revenue</span>
              <p>Live booking pipeline routed into your MCCNow Excel workflow for fast follow-up.</p>
            </div>
          </div>

          <form onSubmit={handleWaitlistSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Your amazing email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              aria-label="Email address"
              disabled={submitted}
            />

            {waitlistError && <p className={styles.error}>{waitlistError}</p>}

            <button type="submit" className={styles.joinButton} disabled={submitted}>
              {submitted ? "Thanks for joining" : "JOIN WAITLIST"}
            </button>
          </form>
        </section>

        <section className={styles.videoSection}>
          <h2 className={styles.sectionTitle}>See how we grow search rankings in real time</h2>
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.video}
              src={demoVideoUrl}
              title="Foyera Local Search Growth Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className={styles.videoCaption}>
            Replace this demo URL with your final case-study video showing profile fixes and search-result gains.
          </p>
        </section>

        <section className={styles.bookingSection}>
          <h2 className={styles.sectionTitle}>Book now</h2>
          <p className={styles.bookingIntro}>
            Request your strategy call. We push each booking to your MCCNow Excel feed through the configured webhook.
          </p>
          <form className={styles.bookingForm} onSubmit={handleBookNow}>
            <input
              className={styles.input}
              type="text"
              placeholder="Your full name"
              value={bookingForm.name}
              onChange={(event) => handleBookingChange("name", event.target.value)}
            />
            <input
              className={styles.input}
              type="email"
              placeholder="Business email"
              value={bookingForm.email}
              onChange={(event) => handleBookingChange("email", event.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Business name"
              value={bookingForm.businessName}
              onChange={(event) => handleBookingChange("businessName", event.target.value)}
            />
            <input
              className={styles.input}
              type="url"
              placeholder="Website (optional)"
              value={bookingForm.website}
              onChange={(event) => handleBookingChange("website", event.target.value)}
            />
            <textarea
              className={styles.textarea}
              placeholder="What should we fix first on your Google profile?"
              value={bookingForm.challenge}
              onChange={(event) => handleBookingChange("challenge", event.target.value)}
            />
            <button type="submit" className={styles.bookButton} disabled={bookingState === "submitting"}>
              {bookingState === "submitting" ? "Sending..." : "BOOK NOW"}
            </button>
            {bookingMessage && (
              <p className={bookingState === "success" ? styles.successMessage : styles.error}>{bookingMessage}</p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
