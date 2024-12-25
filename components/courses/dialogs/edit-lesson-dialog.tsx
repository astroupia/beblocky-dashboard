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

interface Lesson {
  id?: string;
  lessonTitle: string;
  lessonDescription: string;
  courseId?: string;
  slides?: string[];
}

interface EditLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson | null;
  mode: "edit" | "create";
  embedded?: boolean;
  onComplete?: (data: Lesson) => void;
}

export function EditLessonDialog({
  open,
  onOpenChange,
  lesson,
  mode,
}: EditLessonDialogProps) {
  const [formData, setFormData] = useState<Lesson>(
    lesson || {
      lessonTitle: "",
      lessonDescription: "",
      slides: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle lesson creation/update logic
    console.log("Saving lesson:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Lesson" : "Create New Lesson"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input
              id="lessonTitle"
              value={formData.lessonTitle}
              onChange={(e) =>
                setFormData({ ...formData, lessonTitle: e.target.value })
              }
              placeholder="Enter lesson title"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="lessonDescription">Description</Label>
            <Textarea
              id="lessonDescription"
              value={formData.lessonDescription}
              onChange={(e) =>
                setFormData({ ...formData, lessonDescription: e.target.value })
              }
              placeholder="Enter lesson description"
              rows={4}
              className="mt-1.5"
            />
          </div>

          {/* Read-only display of associated slides */}
          {formData.slides && formData.slides.length > 0 && (
            <div>
              <Label>Associated Slides</Label>
              <div className="mt-1.5 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  This lesson contains {formData.slides.length} slides. You can
                  manage slides in the Slides tab.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "edit" ? "Save Changes" : "Create Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
