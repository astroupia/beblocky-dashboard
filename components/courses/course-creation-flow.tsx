"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EditCourseDialog } from "./dialogs/edit-course-dialog";
import { EditLessonDialog } from "./dialogs/edit-lesson-dialog";
import { EditSlideDialog } from "./dialogs/edit-slide-dialog";
import { createCourse, editCourse } from "@/lib/actions/course.actions"; // Import actions

interface Course {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Premium" | "Standard" | "Gold";
}

interface Lesson {
  id?: string;
  lessonTitle: string;
  lessonDescription: string;
  courseId?: string;
  slides?: string[];
}

interface CourseCreationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "create";
  initialCourse?: Course;
}

type Step = "course" | "lesson" | "slide" | "review";

export function CourseCreationFlow({
  open,
  onOpenChange,
  mode,
  initialCourse,
}: CourseCreationFlowProps) {
  const [step, setStep] = useState<Step>("course");
  const [progress, setProgress] = useState(25);
  const [courseData, setCourseData] = useState<Course | null>(
    initialCourse || null
  );
  const [lessonData, setLessonData] = useState<Lesson | null>(null);

  const steps = {
    course: {
      title: "Course Details",
      description: "Set up the basic information for your course",
      progress: 25,
    },
    lesson: {
      title: "Create Lesson",
      description: "Add a new lesson to your course",
      progress: 50,
    },
    slide: {
      title: "Add Slides",
      description: "Create slides for your lesson",
      progress: 75,
    },
    review: {
      title: "Review & Publish",
      description: "Review your course and publish changes",
      progress: 100,
    },
  };

  const handleCourseComplete = (data: Course) => {
    setCourseData(data);
    setStep("lesson");
    setProgress(50);
  };

  const handleLessonComplete = (data: Lesson) => {
    setLessonData(data);
    setStep("slide");
    setProgress(75);
  };

  const handleSlideComplete = () => {
    setStep("review");
    setProgress(100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{steps[step].title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {steps[step].description}
          </p>
        </DialogHeader>

        <div className="my-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Course Details</span>
            <span>Lessons</span>
            <span>Slides</span>
            <span>Publish</span>
          </div>
        </div>

        {step === "course" && (
          <EditCourseDialog
            open={step === "course"}
            onOpenChange={(open) => {
              if (!open) onOpenChange(false); // Close the main dialog
            }}
            mode={mode}
            course={
              courseData ? { ...courseData, status: "Active" } : undefined
            }
            onComplete={handleCourseComplete as (data: Course) => void}
            embedded
          />
        )}

        {step === "lesson" && (
          <EditLessonDialog
            open={step === "lesson"}
            onOpenChange={(open) => {
              if (!open) onOpenChange(false); // Close the main dialog
            }}
            mode="create"
            onComplete={handleLessonComplete}
            embedded
          />
        )}

        {step === "slide" && (
          <EditSlideDialog
            open={step === "slide"}
            onOpenChange={(open) => {
              if (!open) onOpenChange(false); // Close the main dialog
            }}
            mode="create"
            onComplete={handleSlideComplete}
            embedded
          />
        )}

        {step === "review" && (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold">Course Details</h3>
                <p className="text-sm text-muted-foreground">
                  {courseData?.courseTitle}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Lesson</h3>
                <p className="text-sm text-muted-foreground">
                  {lessonData?.lessonTitle}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep("course")}>
                Edit Course
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">
                Publish Course
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
