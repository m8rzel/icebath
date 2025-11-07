import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Icebath from "@/models/Icebath";
import mongoose from "mongoose";

function getUserIdFromSession(request: NextRequest): mongoose.Types.ObjectId | null {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;
  
  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );
    if (!sessionData.userId) return null;
    return new mongoose.Types.ObjectId(sessionData.userId);
  } catch {
    return null;
  }
}

// PUT - Eisbad aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    const userId = getUserIdFromSession(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const body = await request.json();
    const { date, temperature, duration, notes } = body;

    if (!date || temperature === undefined || duration === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const icebath = await Icebath.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId,
      },
      {
        date: new Date(date),
        temperature: Number(temperature),
        duration: Number(duration),
        notes: notes || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!icebath) {
      return NextResponse.json(
        { error: "Icebath not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: icebath._id.toString(),
      date: icebath.date.toISOString(),
      temperature: icebath.temperature,
      duration: icebath.duration,
      notes: icebath.notes || undefined,
    });
  } catch (error: any) {
    console.error("Error updating icebath:", error);
    return NextResponse.json(
      { error: "Failed to update icebath" },
      { status: 500 }
    );
  }
}

