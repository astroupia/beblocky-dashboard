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
import { BookOpen, Clock, GraduationCap, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ILesson, LessonDifficulty } from "@/types/lesson";
import { Types } from "mongoose";

interface ModernEditLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: ILesson | null;
  mode: "edit" | "create";
  onComplete?: (data: ILesson) => void;
}

export function ModernEditLessonDialog({
  open,
  onOpenChange,
  lesson,
  mode,
  onComplete,
}: ModernEditLessonDialogProps) {
  const [formData, setFormData] = useState<ILesson>({
    title: "",
    description: "",
    courseId: new Types.ObjectId(),
    slides: [],
    difficulty: LessonDifficulty.BEGINNER,
    duration: 30,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    } else {
      setFormData({
        title: "",
        description: "",
        courseId: new Types.ObjectId(),
        slides: [],
        difficulty: LessonDifficulty.BEGINNER,
        duration: 30,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [lesson, open]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Lesson title is required");
    }

    if (!formData.description?.trim()) {
      errors.push("Lesson description is required");
    }

    if (formData.duration < 1) {
      errors.push("Lesson duration must be at least 1 minute");
    }

    if (formData.duration > 300) {
      errors.push("Lesson duration cannot exceed 300 minutes");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (onComplete) {
        await onComplete(formData);
        toast({
          title:
            mode === "edit"
              ? "Lesson updated successfully!"
              : "Lesson created successfully!",
          description: formData.title,
          variant: "default",
        });
        onOpenChange(false); // Close the dialog after success
      }
    } catch (error) {
      toast({
        title:
          mode === "edit"
            ? "Failed to update lesson"
            : "Failed to create lesson",
        description: (error as Error)?.message || "Unknown error",
        variant: "destructive",
      });
      console.error("Error creating/updating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case LessonDifficulty.BEGINNER:
        return "from-green-500 to-green-600";
      case LessonDifficulty.INTERMEDIATE:
        return "from-yellow-500 to-yellow-600";
      case LessonDifficulty.ADVANCED:
        return "from-red-500 to-red-600";
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
            {mode === "edit" ? "Edit Lesson" : "Create New Lesson"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {mode === "edit"
              ? "Update your lesson details"
              : "Design an engaging learning experience"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="lessonTitle"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Lesson Title
                  </Label>
                  <Input
                    id="lessonTitle"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter an engaging lesson title"
                    className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="lessonDescription"
                    className="text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="lessonDescription"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what students will learn in this lesson"
                    rows={4}
                    className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="duration"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="300"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: Number.parseInt(e.target.value) || 30,
                        })
                      }
                      className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="difficulty"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Difficulty
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          difficulty: value as typeof formData.difficulty,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LessonDifficulty.BEGINNER}>
                          Beginner
                        </SelectItem>
                        <SelectItem value={LessonDifficulty.INTERMEDIATE}>
                          Intermediate
                        </SelectItem>
                        <SelectItem value={LessonDifficulty.ADVANCED}>
                          Advanced
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Thumbnail */}
            <div className="space-y-6">
              {/* Lesson Preview */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lesson Preview
                </h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-lg">
                      {formData.title || "Lesson Title"}
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.description ||
                        "Lesson description will appear here"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formData.duration}m</span>
                    </div>
                    <Badge
                      className={`bg-gradient-to-r ${getDifficultyColor(formData.difficulty)} text-white border-0`}
                    >
                      {formData.difficulty}
                    </Badge>
                  </div>

                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
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
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {mode === "edit" ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>{mode === "edit" ? "Save Changes" : "Create Lesson"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
