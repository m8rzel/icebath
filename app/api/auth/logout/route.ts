import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout erfolgreich" });
  
  // Clear session cookie
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}

