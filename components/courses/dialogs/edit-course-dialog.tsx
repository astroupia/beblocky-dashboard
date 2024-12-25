"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageLessons } from "./manage-lessons";
import { ManageSlides } from "@/components/courses/dialogs/manage-slides";
import { editCourse, createCourse } from "@/lib/actions/course.actions";
import { CreateCourseParam, UpdateCourseParam } from "@/types/course";

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "create";
  course?: Course; // Make course optional
  embedded?: boolean;
  onComplete?: (data: Course) => void;
}

interface Course {
  _id?: string; // Optional for creation
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Premium" | "Standard" | "Gold";
  slides?: string[];
  lessons?: string[];
  status: "Draft" | "Active";
}

const useCourseForm = (course?: Course) => {
  const [formData, setFormData] = useState<Course>({
    _id: course?._id || "",
    courseTitle: course?.courseTitle || "",
    courseDescription: course?.courseDescription || "",
    courseLanguage: course?.courseLanguage || "",
    subType: course?.subType || "Free",
    status: course?.status || "Draft",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        _id: course._id,
        courseTitle: course.courseTitle,
        courseDescription: course.courseDescription,
        courseLanguage: course.courseLanguage,
        subType: course.subType,
        status: course.status,
      });
    }
  }, [course]);

  return [formData, setFormData] as const;
};

export function EditCourseDialog({
  open,
  onOpenChange,
  course,
  mode,
  onComplete,
}: EditCourseDialogProps) {
  const [formData, setFormData] = useCourseForm(course);
  const [activeTab, setActiveTab] = useState<string>("basics");
  const [status, setStatus] = useState(formData.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createCourseParam: CreateCourseParam = {
      _id: formData._id,
      courseTitle: formData.courseTitle,
      courseDescription: formData.courseDescription,
      courseLanguage: formData.courseLanguage,
      // slides: formData.slides || undefined,
      // lessons: null,
      subType: formData.subType,
      status: status,
    };

    if (onComplete) onComplete(createCourseParam);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Course" : "Create New Course"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  value={formData.courseTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseTitle: e.target.value,
                    })
                  }
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="courseDescription">Description</Label>
                <Textarea
                  id="courseDescription"
                  value={formData.courseDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseDescription: e.target.value,
                    })
                  }
                  placeholder="Enter course description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="courseLanguage">Language</Label>
                <Input
                  id="courseLanguage"
                  value={formData.courseLanguage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseLanguage: e.target.value,
                    })
                  }
                  placeholder="Enter course language"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subType">Subscription Type</Label>
                <Select
                  value={
                    formData.subType as "Free" | "Premium" | "Standard" | "Gold"
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      subType: value as
                        | "Free"
                        | "Premium"
                        | "Standard"
                        | "Gold",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value as "Active" | "Draft");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "Active" && (
                <div>
                  <p>Active-specific content goes here.</p>
                </div>
              )}

              {status === "Draft" && (
                <div>
                  <p>Draft-specific content goes here.</p>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {mode === "edit" ? "Save Changes" : "Create Course"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="lessons">
            <ManageLessons courseId={formData._id || ""} />
          </TabsContent>

          <TabsContent value="slides">
            <ManageSlides courseId={formData._id || ""} />
          </TabsContent>

          <TabsContent value="publish">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Ready to Publish?</h3>
                <p className="text-sm text-muted-foreground">
                  Publishing will make your changes visible to all students.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => onOpenChange(false)}>
                  Publish Changes
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
