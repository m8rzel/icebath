import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // Find user (password is included by default in our schema)
    const user = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });

    if (!user) {
      return NextResponse.json(
        { error: "Ungültiger Username oder Passwort" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Ungültiger Username oder Passwort" },
        { status: 401 }
      );
    }

    // Create session token (simple approach, could use JWT)
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user._id.toString(),
        username: user.username,
      })
    ).toString("base64");

    const response = NextResponse.json({
      message: "Login erfolgreich",
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Fehler beim Login" },
      { status: 500 }
    );
  }
}

