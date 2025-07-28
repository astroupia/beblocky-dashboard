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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<"all" | LessonDifficulty>("all");

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      (lesson.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lesson.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || lesson.difficulty === activeTab;

    return matchesSearch && matchesTab;
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
            {[
              "all",
              LessonDifficulty.BEGINNER,
              LessonDifficulty.INTERMEDIATE,
              LessonDifficulty.ADVANCED,
            ].map((tabOption) => (
              <Button
                key={tabOption}
                variant={activeTab === tabOption ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tabOption as typeof activeTab)}
                className="capitalize transition-all duration-300"
              >
                {tabOption === "all" ? "All" : tabOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Beginner</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {
                    lessons.filter(
                      (l) => l.difficulty === LessonDifficulty.BEGINNER
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intermediate</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {
                    lessons.filter(
                      (l) => l.difficulty === LessonDifficulty.INTERMEDIATE
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Advanced</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {
                    lessons.filter(
                      (l) => l.difficulty === LessonDifficulty.ADVANCED
                    ).length
                  }
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
