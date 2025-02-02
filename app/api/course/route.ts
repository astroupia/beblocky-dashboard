import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Course from "@/lib/models/course.model";
import { CreateCourseParam } from "@/types/course";

// GET: Fetch all courses
export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({});
    return NextResponse.json({ success: true, courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}

// POST: Create a new course
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Received Data:", body);

    const newCourse = new Course(body);
    await newCourse.save();

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
