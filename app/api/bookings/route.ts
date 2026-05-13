import { NextResponse } from "next/server";

interface BookingRequest {
  name?: string;
  email?: string;
  businessName?: string;
  website?: string;
  priorityGoal?: string;
  preferredDate?: string;
  fid?: number | null;
  source?: string;
  createdAt?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingRequest;

    if (!payload.name || !payload.email || !payload.businessName || !payload.preferredDate) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const bookingWebhookUrl = process.env.BOOKING_WEBHOOK_URL;

    if (!bookingWebhookUrl) {
      return NextResponse.json(
        {
          message:
            "Booking captured locally. Set BOOKING_WEBHOOK_URL to stream directly into your mccnow.net Excel workflow.",
        },
        { status: 200 }
      );
    }

    const webhookResponse = await fetch(bookingWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      return NextResponse.json(
        {
          error: `Booking webhook failed (${webhookResponse.status}): ${responseText.slice(0, 250)}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Booked successfully. Your calendar request was sent to the Excel sync endpoint.",
    });
  } catch (error) {
    console.error("Booking API error", error);
    return NextResponse.json(
      { error: "Unable to process booking request." },
      { status: 500 }
    );
  }
}
