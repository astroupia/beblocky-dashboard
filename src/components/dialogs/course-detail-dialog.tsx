"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Course } from "@/hooks/user-courses";

interface CourseDetailDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseDetailDialog({
  course,
  isOpen,
  onClose,
}: CourseDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{course.courseTitle}</DialogTitle>
          <DialogDescription className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Description:</h4>
                <p>{course.courseDescription}</p>
              </div>
              <div>
                <h4 className="font-semibold">Language:</h4>
                <p>{course.courseLanguage}</p>
              </div>
              <div>
                <h4 className="font-semibold">Language:</h4>
                <p>{course.courseLanguage}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
