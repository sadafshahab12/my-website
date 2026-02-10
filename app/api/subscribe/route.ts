import { serverClient } from "@/app/lib/serverClient";
import { NextResponse } from "next/server";

interface SubscribeRequestBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const { email }: SubscribeRequestBody = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await serverClient.fetch<number>(
      `count(*[_type == "newsletter" && email == $email])`,
      { email },
    );

    if (existing > 0) {
      return NextResponse.json(
        { message: "Already subscribed!" },
        { status: 409 },
      );
    }

    // Create the document
    await serverClient.create({
      _type: "newsletter",
      email,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (error: Error | unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
