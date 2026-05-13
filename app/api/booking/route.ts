import { NextResponse } from "next/server";

interface BookingPayload {
  name?: string;
  email?: string;
  businessName?: string;
  website?: string;
  challenge?: string;
  requestedAt?: string;
  source?: string;
  fid?: number | null;
  displayName?: string | null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingPayload;

    if (!payload.name || !payload.businessName || !payload.email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, or businessName." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking webhook is not configured. Set BOOKING_WEBHOOK_URL to your Power Automate or Zapier endpoint for the MCCNow Excel sheet.",
        },
        { status: 500 }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        receivedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      console.error("Booking webhook error", webhookResponse.status, responseText);
      return NextResponse.json(
        { success: false, message: "Failed to sync booking to calendar feed." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking sent successfully.",
    });
  } catch (error) {
    console.error("Booking route error", error);
    return NextResponse.json(
      { success: false, message: "Invalid booking payload." },
      { status: 400 }
    );
  }
}
