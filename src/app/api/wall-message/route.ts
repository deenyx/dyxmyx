import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and message required" },
        { status: 400 }
      );
    }

    const emailContent = `
Wall Message from ${name}

Message:
${message}

---
Sent from dyxmyx.com wall
    `.trim();

    // For now, log to console and return success
    // TODO: Configure email service (nodemailer, SendGrid, etc.)
    console.log("Wall message received:", { name, message, emailContent });

    return NextResponse.json(
      { success: true, message: "Message sent!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing wall message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
