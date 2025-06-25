"use client";

import { useState, useEffect } from "react";
import { ModernCourseGrid } from "./modern-course-grid";
import { ModernCourseStats } from "./modern-course-stats";
import { ModernCourseCreationFlow } from "./modern-course-creation-flow";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

export default function ModernCourseDashboard() {
  const [theme, setTheme] = useState("light");
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    Welcome back!
                  </span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Transform Learning Experiences
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Create, manage, and deliver exceptional courses that inspire
                  and educate. Your journey to educational excellence starts
                  here.
                </p>
              </div>
              <Button
                onClick={() => setIsCreateFlowOpen(true)}
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
                Create Course
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <ModernCourseStats />
        </div>

        {/* Courses Grid */}
        <ModernCourseGrid />

        {/* Course Creation Flow */}
        <ModernCourseCreationFlow
          open={isCreateFlowOpen}
          onOpenChange={setIsCreateFlowOpen}
          mode="create"
        />
      </div>
    </div>
  );
}
