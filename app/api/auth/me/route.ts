import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Decode session token
    let sessionData;
    try {
      sessionData = JSON.parse(
        Buffer.from(sessionCookie.value, "base64").toString()
      );
    } catch {
      return NextResponse.json(
        { error: "Ungültige Session" },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await User.findById(sessionData.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Benutzers" },
      { status: 500 }
    );
  }
}

