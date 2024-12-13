import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { COURSE_URL } from "@/lib/constant";
import { Course } from "@/hooks/user-courses";
import { CoursesClient } from "./courses-client";

// This will be the server component
export default async function CoursesRoute() {
  const courses = await fetch(COURSE_URL).then(
    async (res) => (await res.json()) as { courses: Course[] }
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesClient courses={courses.courses} />
    </Suspense>
  );
}
