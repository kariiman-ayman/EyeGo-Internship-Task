import { NextResponse } from "next/server";
import { createUser, UserError } from "@/lib/users";
import { signToken } from "@/lib/jwt";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  try {
    const user = createUser(email, password);
    const token = await signToken({ sub: user.email, email: user.email });

    return NextResponse.json(
      { user: { email: user.email }, token },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 },
    );
  }
}