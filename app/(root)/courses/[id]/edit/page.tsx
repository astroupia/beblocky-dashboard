"use client";

import { use, useState, useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernCourseEditor } from "@/components/courses/modern-course-editor";
import { CourseEditorPageSkeleton } from "@/components/courses/loading/course-edit-skeleton";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CourseEditPage({ params }: PageProps) {
  const { id: courseId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    // Show loading skeleton for a brief moment to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle auto-refresh after course creation
  useEffect(() => {
    if (shouldRefresh) {
      window.location.reload();
    }
  }, [shouldRefresh]);

  if (!courseId) {
    notFound();
  }

  if (isLoading) {
    return <CourseEditorPageSkeleton />;
  }

  return (
    <>
      <div className="pt-2">
        <ModernCourseEditor
          courseId={courseId}
          onCourseCreated={() => setShouldRefresh(true)}
        />
      </div>
    </>
  );
}
