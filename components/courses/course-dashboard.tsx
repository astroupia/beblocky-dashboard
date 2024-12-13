"use client";

import { CourseGrid } from "@/components/courses/course-grid";
import { CourseStats } from "@/components/courses/course-stats";
import Header from "../dashboard/header";
import { useState } from "react";
import { useEffect } from "react";

export default function CourseDashboardPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <Header
          page={"courses"}
          header={"Course Management"}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="mb-8">
          <CourseStats />
        </div>

        <CourseGrid />
      </div>
    </main>
  );
}
