import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password, confirmPassword } = body;

    // Validation
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username muss zwischen 3 und 30 Zeichen lang sein" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Passwort muss mindestens 6 Zeichen lang sein" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwörter stimmen nicht überein" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username ist bereits vergeben" },
        { status: 409 }
      );
    }

    // Create user
    const user = new User({
      username: username.toLowerCase().trim(),
      password,
    });

    await user.save();

    return NextResponse.json(
      { 
        message: "Registrierung erfolgreich",
        user: {
          id: user._id.toString(),
          username: user.username,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username ist bereits vergeben" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Fehler bei der Registrierung" },
      { status: 500 }
    );
  }
}

