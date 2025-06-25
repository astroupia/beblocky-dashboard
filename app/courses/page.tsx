"use client";

import { useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import ModernCourseDashboard from "@/components/courses/modern-course-dashboard";

export default function CoursesPage() {
  useEffect(() => {
    // Remove theme logic, handled by ThemeProvider
  }, []);

  return (
    <>
      <ModernNavbar />
      <ModernCourseDashboard />
    </>
  );
}
