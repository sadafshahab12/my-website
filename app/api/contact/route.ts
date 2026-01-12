import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "../../lib/serverClient";
import { Contact } from "@/app/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Contact;
  const { name, email, subject, phone, country, message } = body;

  if (!name || !email || !phone || !country || !subject || !message) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const newContact: Contact = {
      _type: "contact",
      name,
      email,
      phone,
      country,
      subject,
      message,
    };

    await serverClient.create(newContact);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to save message" },
      { status: 500 }
    );
  }
}
