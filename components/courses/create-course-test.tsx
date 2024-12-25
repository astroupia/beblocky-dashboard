"use client";

import * as React from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createCourse } from "@/lib/actions/course.actions";
import { connectToDatabase } from "@/lib/database";

const CreateCourseTest = () => {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [courseDescription, setCourseDescription] = React.useState("");
  const [courseLanguage, setCourseLanguage] = React.useState("");
  const [subType, setSubType] = React.useState<
    "Free" | "Gold" | "Premium" | "Standard"
  >("Free");
  const [status, setStatus] = React.useState<"Active" | "Draft">("Draft");
  const [slides, setSlides] = React.useState<string[]>([]);
  const [lessons, setLessons] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCreateCourse = async () => {
    const courseData = {
      courseTitle,
      courseDescription,
      courseLanguage,
      subType,
      status,
      slides,
      lessons,
    };

    // Debugging logs
    console.log("Creating course with the following data:");
    console.log(courseData);

    try {
      await connectToDatabase();
      const response = await createCourse(courseData);
      if (response) {
        console.log("Course created successfully:", response);
      }
    } catch (error) {
      console.log("Error creating course:", error);
    }

    setIsOpen(false); // Close the dialog after creating the course
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Create Course</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="courseTitle">Course Title</Label>
            <Input
              id="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
            />

            <Label htmlFor="courseDescription">Course Description</Label>
            <Textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
            />

            <Label htmlFor="courseLanguage">Course Language</Label>
            <Input
              id="courseLanguage"
              value={courseLanguage}
              onChange={(e) => setCourseLanguage(e.target.value)}
              required
            />

            <Label htmlFor="subType">Subscription Type</Label>
            <Select
              // id="subType"
              value={subType}
              onValueChange={(value) =>
                setSubType(value as "Free" | "Gold" | "Premium" | "Standard")
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subscription Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="status">Course Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "Active" | "Draft")}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="slides">Slides (Optional, IDs)</Label>
            <Textarea
              id="slides"
              value={slides.join(", ")}
              onChange={(e) =>
                setSlides(e.target.value.split(", ").map((item) => item.trim()))
              }
              placeholder="Enter slide IDs separated by commas"
            />

            <Label htmlFor="lessons">Lessons (Optional, IDs)</Label>
            <Textarea
              id="lessons"
              value={lessons.join(", ")}
              onChange={(e) =>
                setLessons(
                  e.target.value.split(", ").map((item) => item.trim())
                )
              }
              placeholder="Enter lesson IDs separated by commas"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCourseTest;
