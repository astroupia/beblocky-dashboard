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

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "create";
  course?: Course;
  embedded?: boolean;
  onComplete?: (data: Course) => void;
}

interface Course {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Premium" | "Standard" | "Gold";
}

export function EditCourseDialog({
  open,
  onOpenChange,
  course,
  mode,
}: EditCourseDialogProps) {
  const [activeTab, setActiveTab] = useState("basics");
  const [formData, setFormData] = useState<Course>(
    course || {
      id: 0,
      courseId: 0,
      courseTitle: "",
      courseDescription: "",
      courseLanguage: "",
      subType: "Free",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle course update/creation logic here
    console.log("Saving course:", formData);
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
                <Label htmlFor="courseId">Course ID</Label>
                <Input
                  id="courseId"
                  type="number"
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseId: parseInt(e.target.value),
                    })
                  }
                  placeholder="Enter course ID"
                />
              </div>

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
                />
              </div>

              <div>
                <Label htmlFor="subType">Subscription Type</Label>
                <Select
                  value={formData.subType}
                  onValueChange={(
                    value: "Free" | "Premium" | "Standard" | "Gold"
                  ) => setFormData({ ...formData, subType: value })}
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="lessons">
            <ManageLessons courseId={formData.courseId} />
          </TabsContent>

          <TabsContent value="slides">
            <ManageSlides courseId={formData.courseId} />
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
