"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  MoreVertical,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ILesson, LessonDifficulty } from "@/types/lesson";

interface ModernManageLessonsProps {
  courseId: string;
  lessons: ILesson[];
  onCreateLesson?: () => void;
  onEditLesson?: (lesson: ILesson) => void;
  onDeleteLesson?: (lesson: ILesson) => void;
}

export function ModernManageLessons({
  courseId,
  lessons,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
}: ModernManageLessonsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      (lesson.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lesson.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    // No status field in ILesson, so always return true for filter
    return matchesSearch;
  });

  const handleEdit = (lesson: ILesson) => {
    if (onEditLesson) {
      onEditLesson(lesson);
    }
  };

  const handleDelete = (lesson: ILesson) => {
    if (onDeleteLesson) {
      onDeleteLesson(lesson);
    }
  };

  const handleCreateNew = () => {
    if (onCreateLesson) {
      onCreateLesson();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "from-green-500 to-green-600";
      case "Intermediate":
        return "from-yellow-500 to-yellow-600";
      case "Advanced":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Course Lessons
            </h3>
            <p className="text-muted-foreground">
              Manage and organize your course content into engaging lessons
            </p>
          </div>

          <Button
            onClick={handleCreateNew}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
            Create Lesson
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search lessons..."
              className="pl-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "published", "draft"].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption as typeof filter)}
                className="capitalize transition-all duration-300"
              >
                {filterOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {lessons.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {lessons.reduce((sum, lesson) => sum + lesson.duration, 0)}m
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Difficulty</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {lessons.length > 0
                    ? lessons.filter((l) => l.difficulty === "intermediate")
                        .length >
                      lessons.length / 2
                      ? "Intermediate"
                      : lessons.filter((l) => l.difficulty === "advanced")
                            .length >
                          lessons.length / 2
                        ? "Advanced"
                        : "Beginner"
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Lessons Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={
                (lesson as any)._id?.toString?.() || `${lesson.title}-${index}`
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <ModernLessonCard
                lesson={lesson}
                onEdit={() => handleEdit(lesson)}
                onDelete={() => handleDelete(lesson)}
                getDifficultyColor={getDifficultyColor}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No lessons found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first lesson to get started"}
          </p>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Lesson
          </Button>
        </motion.div>
      )}
    </div>
  );
}

interface ModernLessonCardProps {
  lesson: ILesson;
  onEdit: () => void;
  onDelete: () => void;
  getDifficultyColor: (difficulty: string) => string;
}

function ModernLessonCard({
  lesson,
  onEdit,
  onDelete,
  getDifficultyColor,
}: ModernLessonCardProps) {
  return (
    <Card className="group p-6 bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <h4 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {lesson.title}
          </h4>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {lesson.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge
              className={`bg-gradient-to-r ${getDifficultyColor(lesson.difficulty)} text-white border-0`}
            >
              {lesson.difficulty}
            </Badge>
            <Badge variant="secondary">{lesson.duration} min</Badge>
            <Badge variant="secondary">{lesson.slides.length} slides</Badge>
            {lesson.tags &&
              lesson.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 mt-4">
        <span className="text-xs text-muted-foreground">
          Updated{" "}
          {lesson.updatedAt
            ? new Date(lesson.updatedAt).toLocaleDateString()
            : "-"}
        </span>
      </div>
    </Card>
  );
}
