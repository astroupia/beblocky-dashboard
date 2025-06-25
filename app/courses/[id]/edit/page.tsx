"use client";

import { use } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernCourseEditor } from "@/components/courses/modern-course-editor";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CourseEditPage({ params }: PageProps) {
  const { id: courseId } = use(params);

  if (!courseId) {
    notFound();
  }

  return (
    <>
      <ModernNavbar />
      <div className="pt-16">
        <ModernCourseEditor courseId={courseId} />
      </div>
    </>
  );
}
