import { NextResponse } from "next/server";
import { authenticate } from "@/lib/users";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  const body = await request.json();

  const user = authenticate(body?.email ?? "", body?.password ?? "");

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = await signToken({ sub: user.email, email: user.email });

  return NextResponse.json({
    user: { email: user.email },
    token,
  });
}