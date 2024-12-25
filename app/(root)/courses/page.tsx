import { CourseCreationFlow } from "@/components/courses/course-creation-flow";
import CourseDashboardPage from "@/components/courses/course-dashboard";
import CreateCourseTest from "@/components/courses/create-course-test";
import { createCourse } from "@/lib/actions/course.actions";
import { CreateCourseParam } from "@/types/course";
import React from "react";

export async function page() {
  return <CourseDashboardPage />;
}

export default page;
