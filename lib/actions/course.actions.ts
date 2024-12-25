import { connectToDatabase } from "../database";
import Course from "../models/course.model";
import { CreateCourseParam, UpdateCourseParam } from "@/types/course";

export async function getAllCourse() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.log("Error connecting to database");
      return;
    }
    const courses = await Course.find({});
    if (!courses) {
      console.log("No Courses");
    }
    return courses;
  } catch (error) {
    console.log("Error getting Courses", error);
  }
}

export async function getAllActiveCourse() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.log("Error connecting to database");
      return;
    }
    const courses = await Course.find({ status: "Active" });
    if (!courses) {
      console.log("No Courses");
    }
    return courses;
  } catch (error) {
    console.log("Error getting Courses", error);
  }
}

export async function createCourse(createCourseParam: CreateCourseParam) {
  const conn = await connectToDatabase();
  if (!conn) {
    console.log("Error connecting to database");
    return;
  }

  try {
    const newCourse = new Course(createCourseParam);
    console.log("Created Instance");
    await newCourse.save();
    return newCourse;
  } catch (error) {
    console.log("Error Creating Course: ", error);
  }
}

export async function editCourse(
  courseId: string,
  editCourseParam: UpdateCourseParam
) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.log("Error Connecting to Database");
      return;
    }

    const editedCourse = await Course.findOneAndUpdate(
      { courseId },
      editCourseParam,
      { new: true }
    );
    return editedCourse;
  } catch (error) {
    console.log("Error editing Course: ", error);
  }
}
export async function deleteCourse(courseId: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.log("Error connecting to database");
      return;
    }
    const deletedCourse = await Course.findOneAndDelete({ courseId });
    return deletedCourse;
  } catch (error) {
    console.log("Error deleting Course: ", error);
  }
}
