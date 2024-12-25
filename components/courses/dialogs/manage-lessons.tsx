"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { EditLessonDialog } from "./edit-lesson-dialog";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface Lesson {
  id: string;
  lessonTitle: string;
  lessonDescription: string;
}

interface ManageLessonsProps {
  courseId: string;
}

export function ManageLessons({ courseId }: ManageLessonsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const handleDelete = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lessons</h3>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setIsEditDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-4 bg-muted rounded-lg"
          >
            <div>
              <h4 className="font-medium">{lesson.lessonTitle}</h4>
              <p className="text-sm text-muted-foreground">
                {lesson.lessonDescription}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingLesson(lesson);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(lesson)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditLessonDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        lesson={editingLesson}
        mode={editingLesson ? "edit" : "create"}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Lesson"
        itemToDelete={lessonToDelete}
        itemType="lesson"
        onConfirm={() => {
          // Handle lesson deletion
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
