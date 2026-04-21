import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// GET all students
export async function GET() {
  try {
    const db = await connectDB();

    const students = await db
      .collection("students")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("GET /api/students error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch students",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST new student
export async function POST(request: Request) {
  try {
    const db = await connectDB();

    const body = await request.json();
    const {
      firstName,
      lastName,
      age,
      email,
      course,
      status,
      dateOfRegistration,
    } = body;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !age ||
      !email ||
      !course ||
      !status ||
      !dateOfRegistration
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (Number(age) < 16) {
      return NextResponse.json(
        { error: "Student age must be 16 or older" },
        { status: 400 }
      );
    }

    const newStudent = {
      firstName,
      lastName,
      age: Number(age),
      email,
      course,
      status,
      dateOfRegistration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("students").insertOne(newStudent);

    return NextResponse.json(
      { _id: result.insertedId, ...newStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/students error:", error);

    return NextResponse.json(
      {
        error: "Failed to create student",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}