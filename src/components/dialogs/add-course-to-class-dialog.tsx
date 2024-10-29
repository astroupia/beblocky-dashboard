"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/use-toast";
import { addCourseToClass } from "@/actions/parents";

interface AddCourseToClassDialogProps {
  course: Course;
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
  const router = useRouter();
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
      const result = await addCourseToClass(selectedClass, course._id);
      if (result.success) {
        toast({
          title: "Course added to class successfully!",
        });
        onClose();
        router.refresh();
      } else {
        throw result.error || "Failed to add course to class";
      }
    } catch (error) {
      toast({
        title: error as string,
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
            <SelectTrigger className="text-apple">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((classroom) => (
                <SelectItem
                  className="text-apple cursor-pointer"
                  key={classroom.id}
                  value={classroom.id}
                >
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
