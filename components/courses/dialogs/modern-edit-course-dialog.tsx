"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import { BookOpen, Globe, Crown, Star, Users, Save } from "lucide-react";
import { motion } from "framer-motion";
import { CourseSubscriptionType } from "@/types/course";

interface Course {
  id: string;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: CourseSubscriptionType;
  category: string;
  status: "Active" | "Draft";
  students: number;
  lessons: number;
  slides: number;
  rating: number;
  lastUpdated: string;
}

interface ModernEditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onComplete: (course: Course) => void;
}

export function ModernEditCourseDialog({
  open,
  onOpenChange,
  course,
  onComplete,
}: ModernEditCourseDialogProps) {
  const [formData, setFormData] = useState<Course>(course);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(course);
  }, [course, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onComplete(formData);
    setIsLoading(false);
  };

  const getSubTypeIcon = (subType: string) => {
    switch (subType) {
      case "Premium":
        return <Crown className="h-4 w-4" />;
      case "Gold":
        return <Star className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getSubTypeColor = (subType: string) => {
    switch (subType) {
      case "Premium":
        return "from-purple-500 to-purple-600";
      case "Standard":
        return "from-blue-500 to-blue-600";
      case "Gold":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto scrollbar-hide border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

        <DialogHeader className="relative z-10 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Edit Course Details
          </DialogTitle>
          <p className="text-muted-foreground">
            Update your course information and settings
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="courseTitle"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Course Title
                  </Label>
                  <Input
                    id="courseTitle"
                    value={formData.courseTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, courseTitle: e.target.value })
                    }
                    placeholder="Enter course title"
                    className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="courseDescription"
                    className="text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="courseDescription"
                    value={formData.courseDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseDescription: e.target.value,
                      })
                    }
                    placeholder="Describe your course"
                    rows={4}
                    className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Web Development, Data Science"
                    className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="courseLanguage"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Language
                    </Label>
                    <Select
                      value={formData.courseLanguage}
                      onValueChange={(value) =>
                        setFormData({ ...formData, courseLanguage: value })
                      }
                    >
                      <SelectTrigger className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as "Active" | "Draft",
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Subscription Type
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.values(CourseSubscriptionType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subType: type,
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.subType === type
                            ? "border-primary bg-primary/10"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {getSubTypeIcon(type)}
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Preview
                </h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-lg">
                      {formData.courseTitle || "Course Title"}
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.courseDescription ||
                        "Course description will appear here"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={`bg-gradient-to-r ${getSubTypeColor(formData.subType)} text-white border-0`}
                    >
                      {formData.subType}
                    </Badge>
                    <Badge variant="outline">{formData.courseLanguage}</Badge>
                    {formData.category && (
                      <Badge variant="outline">{formData.category}</Badge>
                    )}
                    <Badge
                      variant={
                        formData.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        formData.status === "Active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }
                    >
                      {formData.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-lg font-semibold">{course.students}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">{course.lessons}</p>
                      <p className="text-xs text-muted-foreground">Lessons</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">{course.slides}</p>
                      <p className="text-xs text-muted-foreground">Slides</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  💡 Course Management
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  After saving changes, you can manage lessons and slides
                  through the course editor tabs.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
