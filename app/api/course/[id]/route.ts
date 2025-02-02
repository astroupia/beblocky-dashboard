import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Course from "@/lib/models/course.model";
import { UpdateCourseParam } from "@/types/course";

// GET: Fetch a single course by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch course." },
      { status: 500 }
    );
  }
}

// PATCH: Edit a course
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body: UpdateCourseParam = await req.json();

    const updatedCourse = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to edit course." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a course
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const deletedCourse = await Course.findByIdAndDelete(params.id);

    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Course deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
