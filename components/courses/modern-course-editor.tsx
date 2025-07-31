"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Settings,
  Users,
  BarChart3,
  Save,
  Eye,
  Plus,
  ArrowLeft,
  Layers,
  PlayCircle,
} from "lucide-react";
import { ModernEditCourseDialog } from "./dialogs/modern-edit-course-dialog";
import { ModernManageLessons } from "./dialogs/modern-manage-lessons";
import { ModernManageSlides } from "./dialogs/modern-manage-slides";
import { motion } from "framer-motion";
import { ModernEditLessonDialog } from "./dialogs/modern-edit-lesson-dialog";
import { ModernEditSlideDialog } from "./dialogs/modern-edit-slide-dialog";
import {
  CourseSubscriptionType,
  CourseStatus,
  IUpdateCourseDto,
} from "@/types/course";
import { ILesson, ICreateLessonDto } from "@/types/lesson";
import { ISlide, ICreateSlideDto } from "@/types/slide";
import { toast } from "sonner";
import { Types } from "mongoose";
import { CourseEditorPageSkeleton } from "./loading/course-edit-skeleton";
import {
  fetchCompleteCourseData,
  updateCourse,
  createLesson,
  updateLesson,
  deleteLesson,
  createSlide,
  updateSlide,
  deleteSlide,
  ClientCourse,
} from "@/lib/api/course";
import { useAuth } from "@/hooks/use-auth";
import { encryptEmail } from "@/lib/utils";

interface ModernCourseEditorProps {
  courseId: string;
  onCourseCreated?: () => void;
}

export function ModernCourseEditor({
  courseId,
  onCourseCreated,
}: ModernCourseEditorProps) {
  const [course, setCourse] = useState<ClientCourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState("light");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isCreateSlideOpen, setIsCreateSlideOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ISlide | null>(null);
  const [isEditSlideOpen, setIsEditSlideOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const {
          course: courseData,
          lessons: lessonsData,
          slides: slidesData,
        } = await fetchCompleteCourseData(courseId);

        setCourse(courseData);
        setLessons(lessonsData);
        setSlides(slidesData);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleUpdateCourse = async (updatedCourse: IUpdateCourseDto) => {
    try {
      const updatedData = await updateCourse(courseId, updatedCourse);
      setCourse((prev) => (prev ? { ...prev, ...updatedData } : null));
      toast.success("Course updated successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleCreateLesson = async (lessonData: ICreateLessonDto) => {
    try {
      const newLesson = await createLesson(lessonData);

      setLessons((prev) => [...prev, newLesson]);

      // Update course lessons count
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              lessons: [...prev.lessons, new Types.ObjectId(newLesson._id)],
              lessonsCount: (prev.lessonsCount || 0) + 1,
            }
          : null
      );

      toast.success("Lesson created successfully!");

      // Trigger course created callback if provided
      if (onCourseCreated) {
        onCourseCreated();
      }

      return newLesson;
    } catch (error) {
      console.error("Error creating lesson:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create lesson. Please try again.");
      }
      throw error;
    }
  };

  const handleCreateSlide = async (
    slideData: ICreateSlideDto,
    imageFiles?: File[]
  ) => {
    try {
      const newSlide = await createSlide(slideData, imageFiles);

      setSlides((prev) => [...prev, newSlide]);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              slides: [...prev.slides, new Types.ObjectId(newSlide._id)],
              slidesCount: (prev.slidesCount || 0) + 1,
            }
          : null
      );

      toast.success("Slide created successfully!");

      // Trigger course created callback if provided
      if (onCourseCreated) {
        onCourseCreated();
      }

      return newSlide;
    } catch (error) {
      console.error("Error creating slide:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create slide. Please try again.");
      }
      throw error;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getSubTypeColor = (subType: CourseSubscriptionType) => {
    switch (subType) {
      case CourseSubscriptionType.PRO:
        return "from-purple-500 to-purple-600";
      case CourseSubscriptionType.BUILDER:
        return "from-blue-500 to-blue-600";
      case CourseSubscriptionType.STARTER:
        return "from-yellow-500 to-yellow-600";
      case CourseSubscriptionType.ORGANIZATION:
        return "from-indigo-500 to-indigo-600";
      case CourseSubscriptionType.FREE:
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const handleUpdateLesson = async (
    lessonId: string,
    updatedData: Partial<ILesson>
  ) => {
    try {
      const updatedLesson = await updateLesson(lessonId, updatedData);

      // Update lessons state with the updated lesson
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === updatedLesson._id ? updatedLesson : lesson
        )
      );

      toast.success("Lesson updated successfully!");
      return updatedLesson;
    } catch (error) {
      console.error("Error updating lesson:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update lesson. Please try again.");
      }
      throw error;
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);

      // Update lessons state by removing the deleted lesson
      setLessons((prev) =>
        prev.filter((lesson) => lesson._id?.toString() !== lessonId)
      );

      // Update course lessons count
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              lessonsCount: (prev.lessonsCount || 0) - 1,
            }
          : null
      );

      toast.success("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete lesson. Please try again.");
      }
      throw error;
    }
  };

  const handleUpdateSlide = async (
    slideId: string,
    updatedData: Partial<ISlide>,
    imageFiles?: File[],
    prevLessonId?: string,
    newLessonId?: string
  ) => {
    try {
      const updatedSlide = await updateSlide(
        slideId,
        updatedData,
        imageFiles,
        prevLessonId,
        newLessonId
      );

      // Update slides state with the updated slide
      setSlides((prev) =>
        prev.map((slide) =>
          slide._id === updatedSlide._id ? updatedSlide : slide
        )
      );

      toast.success("Slide updated successfully!");
      return updatedSlide;
    } catch (error) {
      console.error("Error updating slide:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update slide. Please try again.");
      }
      throw error;
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    try {
      await deleteSlide(slideId);

      // Update slides state by removing the deleted slide
      setSlides((prev) =>
        prev.filter((slide) => slide._id?.toString() !== slideId)
      );

      // Update course slides count
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              slidesCount: (prev.slidesCount || 0) - 1,
            }
          : null
      );

      toast.success("Slide deleted successfully!");
    } catch (error) {
      console.error("Error deleting slide:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete slide. Please try again.");
      }
      throw error;
    }
  };

  if (isLoading) {
    return <CourseEditorPageSkeleton />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  // Helper function to get array length safely
  const getArrayLength = (arr: Types.ObjectId[] | undefined) =>
    arr?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <a href="/courses" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </a>
            </Button>
          </div>

          <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{course.courseTitle}</h1>
                    <Badge
                      variant={
                        course.status === CourseStatus.ACTIVE
                          ? "default"
                          : "secondary"
                      }
                      className={
                        course.status === CourseStatus.ACTIVE
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {course.courseDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{course.courseLanguage}</span>
                    <span>•</span>
                    <Badge
                      className={`bg-gradient-to-r ${getSubTypeColor(course.subType)} text-white border-0`}
                    >
                      {course.subType}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://ide.beblocky.com/courses/${courseId}/learn/user/${encryptEmail(user?.email || "")}`,
                      "_blank"
                    )
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {course.studentsCount || getArrayLength(course.students)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {course.lessonsCount && course.lessonsCount > 0
                      ? course.lessonsCount
                      : lessons && lessons.length > 0
                        ? lessons.length
                        : getArrayLength(course.lessons)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Slides</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {course.slidesCount && course.slidesCount > 0
                      ? course.slidesCount
                      : slides && slides.length > 0
                        ? slides.length
                        : getArrayLength(course.slides)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {course.rating}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
            >
              <BookOpen className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
            >
              <PlayCircle className="h-4 w-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger
              value="slides"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
            >
              <Layers className="h-4 w-4" />
              Slides
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CourseOverview
              course={course}
              onCreateLesson={() => setIsCreateLessonOpen(true)}
              onCreateSlide={() => setIsCreateSlideOpen(true)}
              onViewAnalytics={() => setActiveTab("analytics")}
              onPreviewCourse={() =>
                window.open(
                  `https://ide.beblocky.com/courses/${courseId}/learn/user/${encryptEmail(user?.email || "")}`,
                  "_blank"
                )
              }
            />
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <ModernManageLessons
              courseId={courseId}
              lessons={lessons}
              onCreateLesson={() => setIsCreateLessonOpen(true)}
              onEditLesson={(lesson) => {
                setEditingLesson(lesson);
                setIsEditLessonOpen(true);
              }}
              onDeleteLesson={async (lesson) => {
                try {
                  await handleDeleteLesson(lesson._id?.toString() || "");
                } catch (error) {
                  console.error("Error in delete lesson handler:", error);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="slides" className="space-y-6">
            <ModernManageSlides
              courseId={courseId}
              slides={slides}
              onCreateSlide={() => setIsCreateSlideOpen(true)}
              onEditSlide={(slide) => {
                setEditingSlide(slide);
                setIsEditSlideOpen(true);
              }}
              onDeleteSlide={async (slide) => {
                try {
                  await handleDeleteSlide(slide._id?.toString() || "");
                } catch (error) {
                  console.error("Error in delete slide handler:", error);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <CourseAnalytics course={course} />
          </TabsContent>
        </Tabs>

        {/* Edit Course Dialog */}
        <ModernEditCourseDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          course={{
            id: course._id,
            courseTitle: course.courseTitle,
            courseDescription: course.courseDescription,
            courseLanguage: course.courseLanguage,
            subType: course.subType,
            status: course.status as "Active" | "Draft",
            students: course.studentsCount || 0,
            lessons: course.lessonsCount || 0,
            slides: course.slidesCount || 0,
            rating: course.rating,
            lastUpdated: course.lastUpdated || "Recently",
            category: course.language || "General",
          }}
          onComplete={(updatedCourse) => {
            handleUpdateCourse({
              courseTitle: updatedCourse.courseTitle,
              courseDescription: updatedCourse.courseDescription,
              courseLanguage: updatedCourse.courseLanguage,
              subType: updatedCourse.subType,
              status: updatedCourse.status as CourseStatus,
            });
            setIsEditDialogOpen(false);
          }}
        />

        {/* Create Lesson Dialog */}
        <ModernEditLessonDialog
          open={isCreateLessonOpen}
          onOpenChange={setIsCreateLessonOpen}
          lesson={null}
          mode="create"
          onComplete={async (data) => {
            try {
              await handleCreateLesson({
                title: data.title,
                description: data.description || "",
                courseId: new Types.ObjectId(courseId),
                difficulty: data.difficulty,
                duration: data.duration,
                tags: data.tags || [],
              });
              setIsCreateLessonOpen(false);
              setActiveTab("lessons");
            } catch (error) {
              // Error already handled in handleCreateLesson
            }
          }}
        />

        {/* Create Slide Dialog */}
        <ModernEditSlideDialog
          open={isCreateSlideOpen}
          onOpenChange={setIsCreateSlideOpen}
          slide={null}
          courseId={courseId}
          lessons={lessons}
          mode="create"
          onComplete={async (data, imageFiles) => {
            try {
              await handleCreateSlide(
                {
                  title: data.title,
                  content: data.content || "",
                  order: data.order,
                  courseId: new Types.ObjectId(courseId),
                  lessonId: data.lesson
                    ? new Types.ObjectId(data.lesson.toString())
                    : new Types.ObjectId(),
                  titleFont: data.titleFont || "Inter",
                  contentFont: data.titleFont || "Inter", // Use titleFont as contentFont
                  startingCode: data.startingCode || "",
                  solutionCode: data.solutionCode || "",
                  imageUrls: data.imageUrls || [],
                  backgroundColor: data.backgroundColor || "#ffffff",
                  textColor: data.textColor || "#333333",
                  themeColors: {
                    main: data.themeColors?.main || "#3b82f6",
                    secondary: data.themeColors?.secondary || "#64748b",
                  },
                },
                imageFiles
              );
              setIsCreateSlideOpen(false);
              setActiveTab("slides");
            } catch (error) {
              // Error already handled in handleCreateSlide
            }
          }}
        />

        {/* Edit Lesson Dialog */}
        <ModernEditLessonDialog
          open={isEditLessonOpen}
          onOpenChange={setIsEditLessonOpen}
          lesson={editingLesson}
          mode="edit"
          onComplete={async (data) => {
            try {
              if (!editingLesson?._id) {
                throw new Error("No lesson ID provided for update");
              }
              await handleUpdateLesson(editingLesson._id.toString(), {
                title: data.title,
                description: data.description,
                difficulty: data.difficulty,
                duration: data.duration,
                tags: data.tags,
              });
              setIsEditLessonOpen(false);
              setEditingLesson(null);
            } catch (error) {
              console.error("Error updating lesson:", error);
            }
          }}
        />

        {/* Edit Slide Dialog */}
        <ModernEditSlideDialog
          open={isEditSlideOpen}
          onOpenChange={setIsEditSlideOpen}
          slide={editingSlide}
          courseId={courseId}
          lessons={lessons}
          mode="edit"
          onComplete={async (data, imageFiles) => {
            try {
              if (!editingSlide?._id) {
                throw new Error("No slide ID provided for update");
              }
              // Track previous lesson ID (ensure string)
              let prevLessonId: string | undefined = undefined;
              if (editingSlide.lesson) {
                if (typeof editingSlide.lesson === "string")
                  prevLessonId = editingSlide.lesson;
                else if (
                  editingSlide.lesson &&
                  typeof editingSlide.lesson === "object" &&
                  "toString" in editingSlide.lesson
                )
                  prevLessonId = editingSlide.lesson.toString();
              }
              let newLessonId: string | undefined = undefined;
              if (data.lesson) {
                if (typeof data.lesson === "string") newLessonId = data.lesson;
                else if (
                  data.lesson &&
                  typeof data.lesson === "object" &&
                  "toString" in data.lesson
                )
                  newLessonId = data.lesson.toString();
              }
              await handleUpdateSlide(
                editingSlide._id.toString(),
                {
                  title: data.title,
                  content: data.content,
                  order: data.order,
                  lesson: newLessonId
                    ? new Types.ObjectId(newLessonId)
                    : undefined,
                  titleFont: data.titleFont,
                  contentFont: data.contentFont,
                  startingCode: data.startingCode,
                  solutionCode: data.solutionCode,
                  backgroundColor: data.backgroundColor,
                  textColor: data.textColor,
                  themeColors: {
                    main: data.themeColors?.main || "#3b82f6",
                    secondary: data.themeColors?.secondary || "#64748b",
                  },
                  imageUrls: data.imageUrls,
                },
                imageFiles,
                prevLessonId !== newLessonId ? prevLessonId : undefined,
                prevLessonId !== newLessonId ? newLessonId : undefined
              );
              setIsEditSlideOpen(false);
              setEditingSlide(null);
            } catch (error) {
              console.error("Error updating slide:", error);
            }
          }}
        />
      </div>
    </div>
  );
}

function CourseOverview({
  course,
  onCreateLesson,
  onCreateSlide,
  onViewAnalytics,
  onPreviewCourse,
}: {
  course: ClientCourse;
  onCreateLesson: () => void;
  onCreateSlide: () => void;
  onViewAnalytics: () => void;
  onPreviewCourse: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Course Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Title
            </label>
            <p className="text-sm">{course.courseTitle}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="text-sm">{course.courseDescription}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Language
            </label>
            <p className="text-sm">{course.courseLanguage}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={onCreateLesson}
            className="w-full justify-start"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Lesson
          </Button>
          <Button
            onClick={onCreateSlide}
            className="w-full justify-start"
            variant="outline"
          >
            <Layers className="h-4 w-4 mr-2" />
            Create Slide
          </Button>
          <Button
            onClick={onViewAnalytics}
            className="w-full justify-start"
            variant="outline"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button
            onClick={onPreviewCourse}
            className="w-full justify-start"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Course
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CourseAnalytics({ course }: { course: ClientCourse }) {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Course Performance</h3>
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-muted-foreground mb-2">
            Analytics Coming Soon
          </h4>
          <p className="text-muted-foreground">
            Detailed analytics and performance metrics will be available here
          </p>
        </div>
      </Card>
    </div>
  );
}
