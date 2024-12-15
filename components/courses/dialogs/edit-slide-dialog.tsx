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

interface Slide {
  id?: string;
  title: string;
  content: string;
  backgroundColor: string;
  color: string;
  titleFont: string;
  contentFont: string;
  startingCode: string;
  code: string;
  image: string;
}

interface EditSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide?: Slide | null;
  mode: "edit" | "create";
  embedded?: boolean;
  onComplete?: (data: Slide) => void;
}

export function EditSlideDialog({
  open,
  onOpenChange,
  slide,
  mode,
}: EditSlideDialogProps) {
  const [formData, setFormData] = useState<Slide>(
    slide || {
      title: "",
      content: "",
      backgroundColor: "",
      color: "",
      titleFont: "",
      contentFont: "",
      startingCode: "",
      code: "",
      image: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle slide creation/update logic
    console.log("Saving slide:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Slide" : "Create New Slide"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter slide title"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter slide content"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) =>
                  setFormData({ ...formData, backgroundColor: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titleFont">Title Font</Label>
              <Input
                id="titleFont"
                value={formData.titleFont}
                onChange={(e) =>
                  setFormData({ ...formData, titleFont: e.target.value })
                }
                placeholder="Enter title font"
              />
            </div>

            <div>
              <Label htmlFor="contentFont">Content Font</Label>
              <Input
                id="contentFont"
                value={formData.contentFont}
                onChange={(e) =>
                  setFormData({ ...formData, contentFont: e.target.value })
                }
                placeholder="Enter content font"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="startingCode">Starting Code</Label>
            <Textarea
              id="startingCode"
              value={formData.startingCode}
              onChange={(e) =>
                setFormData({ ...formData, startingCode: e.target.value })
              }
              placeholder="Enter starting code"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="code">Code</Label>
            <Textarea
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Enter code"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Enter image URL"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "edit" ? "Save Changes" : "Create Slide"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
