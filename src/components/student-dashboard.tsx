"use client";

import { Course } from "@/hooks/user-courses";
import { CourseCard } from "./course-card";
import { PageHeader } from "./page-header";
import { ClassCodeDialog } from "@/components/dialogs/class-code-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Import your custom Button

export function StudentDashboard({ courses }: { courses: Course[] }) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <PageHeader
        showAddClassCodeBtn={true} // Show the button for students
        onAddClassCodeClick={handleOpenDialog} // Pass the click handler
      />
      <div className="flex flex-col py-4 gap-2">
        <h3 className="text-3xl font-bold">Your Courses</h3>
        {courses.length === 0 ? (
          <p className="text-sm">
            No Course Association, Please Add a Class Code
          </p>
        ) : (
          <p className="text-sm">Course you're enrolled in</p>
        )}
        <div className="md:flex-row flex flex-col items-start gap-4">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} progress />
          ))}
        </div>
      </div>
      <ClassCodeDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}
