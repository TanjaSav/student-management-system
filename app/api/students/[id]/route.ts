// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import { connectDB } from "@/lib/mongodb";

// type Context = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// // PUT update student by id
// export async function PUT(request: Request, context: Context) {
//   try {
//     const db = await connectDB();
//     const { id } = await context.params;

//     const body = await request.json();
//     const { firstName, lastName, age, email, course } = body;

//     const updatedStudent = {
//       firstName,
//       lastName,
//       age: Number(age),
//       email,
//       course,
//       updatedAt: new Date().toISOString(),
//     };

//     const result = await db.collection("students").findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: updatedStudent },
//       { returnDocument: "after" }
//     );

//     // Return 404 if student does not exist
//     if (!result) {
//       return NextResponse.json(
//         { error: "Student not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error("PUT /api/students/[id] error:", error);

//     return NextResponse.json(
//       {
//         error: "Failed to update student",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE student by id
// export async function DELETE(_request: Request, context: Context) {
//   try {
//     const db = await connectDB();
//     const { id } = await context.params;

//     const result = await db.collection("students").deleteOne({
//       _id: new ObjectId(id),
//     });

//     // Return 404 if nothing was deleted
//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { error: "Student not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Student deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("DELETE /api/students/[id] error:", error);

//     return NextResponse.json(
//       {
//         error: "Failed to delete student",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// PUT update student by id
export async function PUT(request: Request, context: Context) {
  try {
    const db = await connectDB();
    const { id } = await context.params;

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

    if (Number(age) < 16) {
      return NextResponse.json(
        { error: "Student age must be 16 or older" },
        { status: 400 }
      );
    }

    const updatedStudent = {
      firstName,
      lastName,
      age: Number(age),
      email,
      course,
      status,
      dateOfRegistration,
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("students").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedStudent },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("PUT /api/students/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update student",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE student by id
export async function DELETE(_request: Request, context: Context) {
  try {
    const db = await connectDB();
    const { id } = await context.params;

    const result = await db.collection("students").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete student",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}