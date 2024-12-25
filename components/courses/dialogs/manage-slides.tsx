"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { EditSlideDialog } from "./edit-slide-dialog";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import Image from "next/image";

interface Slide {
  id: string;
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

interface ManageSlidesProps {
  courseId: string;
}

export function ManageSlides({ courseId }: ManageSlidesProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);

  const handleDelete = (slide: Slide) => {
    setSlideToDelete(slide);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Slides</h3>
        <Button
          onClick={() => {
            setEditingSlide(null);
            setIsEditDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="p-4 bg-muted rounded-lg"
            style={{
              backgroundColor: slide.backgroundColor || "inherit",
              color: slide.color || "inherit",
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4
                className="font-medium"
                style={{ fontFamily: slide.titleFont }}
              >
                {slide.title}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(slide)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm" style={{ fontFamily: slide.contentFont }}>
              {slide.content}
            </p>
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title}
                className="mt-2 rounded-md max-h-32 object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <EditSlideDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        slide={editingSlide}
        mode={editingSlide ? "edit" : "create"}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Slide"
        itemToDelete={slideToDelete}
        itemType="slide"
        onConfirm={() => {
          // Handle slide deletion
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
