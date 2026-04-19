import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

// Type for dynamic route parameters
type Context = {
  params: Promise<{
    id: string;
  }>;
};

// PUT /api/students/[id]
// Update a student by id
export async function PUT(request: Request, context: Context) {
  try {
    // Connect to the database
    const db = await connectDB();

    // Get the student id from the route params
    const { id } = await context.params;

    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, age, email, course } = body;

    // Prepare the updated student data
    const updatedStudent = {
      firstName,
      lastName,
      age: Number(age),
      email,
      course,
      updatedAt: new Date().toISOString(),
    };

    // Update the student and return the updated document
    const result = await db.collection("students").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedStudent },
      { returnDocument: "after" }
    );

    // Return 404 if the student does not exist
    if (!result) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Return the updated student
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("PUT /api/students/[id] error:", error);

    // Return an error response if something fails
    return NextResponse.json(
      {
        error: "Failed to update student",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id]
// Delete a student by id
export async function DELETE(_request: Request, context: Context) {
  try {
    // Connect to the database
    const db = await connectDB();

    // Get the student id from the route params
    const { id } = await context.params;

    // Delete the student by _id
    const result = await db.collection("students").deleteOne({
      _id: new ObjectId(id),
    });

    // Return 404 if no record was deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Return a success message
    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);

    // Return an error response if something fails
    return NextResponse.json(
      {
        error: "Failed to delete student",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}