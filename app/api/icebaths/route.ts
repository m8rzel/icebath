import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Icebath from "@/models/Icebath";

function getUserIdFromSession(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;
  
  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );
    return sessionData.userId || null;
  } catch {
    return null;
  }
}

// GET - Alle Eisbäder abrufen
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = getUserIdFromSession(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }
    
    const icebaths = await Icebath.find({ userId })
      .sort({ date: -1 })
      .lean();

    // Konvertiere MongoDB _id zu id und date zu ISO string
    const formattedIcebaths = icebaths.map((ib: any) => ({
      id: ib._id.toString(),
      date: ib.date.toISOString(),
      temperature: ib.temperature,
      duration: ib.duration,
      notes: ib.notes || undefined,
    }));

    return NextResponse.json(formattedIcebaths);
  } catch (error: any) {
    console.error("Error fetching icebaths:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch icebaths",
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Neues Eisbad erstellen
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromSession(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date, temperature, duration, notes } = body;

    if (!date || temperature === undefined || duration === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const icebath = new Icebath({
      date: new Date(date),
      temperature: Number(temperature),
      duration: Number(duration),
      notes: notes || "",
      userId,
    });

    await icebath.save();

    return NextResponse.json({
      id: icebath._id.toString(),
      date: icebath.date.toISOString(),
      temperature: icebath.temperature,
      duration: icebath.duration,
      notes: icebath.notes || undefined,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating icebath:", error);
    return NextResponse.json(
      { error: "Failed to create icebath" },
      { status: 500 }
    );
  }
}

// DELETE - Eisbad löschen
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromSession(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const result = await Icebath.deleteOne({
      _id: id,
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Icebath not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting icebath:", error);
    return NextResponse.json(
      { error: "Failed to delete icebath" },
      { status: 500 }
    );
  }
}

