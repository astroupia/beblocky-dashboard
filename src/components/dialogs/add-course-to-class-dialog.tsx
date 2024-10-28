"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from "@/hooks/user-courses";
import { Classroom } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AddCourseToClassDialogProps {
  course: Course;
  // Update the type to match what Firestore returns plus the document ID
  classrooms: Array<{
    id: string;
    name: string;
    courses: string[];
    userId: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export function AddCourseToClassDialog({
  course,
  classrooms,
  isOpen,
  onClose,
}: AddCourseToClassDialogProps) {
  const [selectedClass, setSelectedClass] = useState("");

  const handleSubmit = async () => {
    if (!selectedClass) {
      toast({
        title: "Please select a class",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add your logic here to update the classroom with the new course
      // You'll need to create a new server action for this
      toast({
        title: "Course added to class successfully!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to add course to class",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course to Class</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={setSelectedClass} value={selectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
