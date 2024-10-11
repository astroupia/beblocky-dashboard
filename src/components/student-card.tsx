"use client";

import useCourses, { Course } from "@/hooks/user-courses";
import { Classroom, Student } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AddCourseModal } from "./dialogs/add-course-modal";
import { EditChildModal } from "./dialogs/edit-child-modal";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export function StudentCard({
  student,
  classrooms,
  courses,
}: {
  student: Student;
  classrooms: Classroom[];
  courses: Course[];
}) {
  return (
    <Card className="rounded-2xl lg:w-1/4 w-full">
      <CardHeader className=" text-white p-6 bg-gradient-to-tr from-apple-600 to-apple-500 rounded-t-2xl">
        <div className=" border-b pb-2">
          <p className=" font-medium text-sm">Student</p>
        </div>
        <div className="flex items-center justify-between">
          <div className=" pt-4">
            <p className=" font-bold">{student.name}</p>
            <p className=" text-sm">{student.email}</p>
          </div>
          <EditChildModal student={student} classrooms={classrooms} />
        </div>
      </CardHeader>
      <CardContent>
        <div className=" mt-4 flex items-center justify-between border-b pb-4">
          <p className=" text-sm font-bold">Course</p>
          <AddCourseModal student={student} courses={courses} />
        </div>
        <div className=" mt-2 space-y-2">
          {Array.from(new Set(student.courses))?.map((course) => (
            <p className=" font-medium text-sm">
              {courses.find((c) => c._id.toString() === course)?.courseTitle}
            </p>
          ))}
        </div>
        <Link href={`/dashboard/progress/${student.userId}`}>
          <Button className=" gap-4 py-4 mt-4">
            <span className=" font-semibold text-xs">VIEW PROGRESS</span>
            <ChevronRight />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
