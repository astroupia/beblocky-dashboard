"use client";

import { useState, useEffect } from "react";
import { ModernHeader } from "./modern-header";
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
  ICourse,
  CourseStatus,
  IUpdateCourseDto,
} from "@/types/course";
import { ILesson, ICreateLessonDto, LessonDifficulty } from "@/types/lesson";
import { ISlide, ICreateSlideDto } from "@/types/slide";
import { toast } from "sonner";
import { Types } from "mongoose";
import { useRouter } from "next/navigation";

interface ClientCourse extends ICourse {
  _id: string;
  lessonsCount?: number;
  studentsCount?: number;
  slidesCount?: number;
  lastUpdated?: string;
}

interface ModernCourseEditorProps {
  courseId: string;
}

export function ModernCourseEditor({ courseId }: ModernCourseEditorProps) {
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
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured");
        }

        // Fetch course details
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
          {
            credentials: "include",
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }

        const courseData = await courseResponse.json();

        // Debug logging to understand the API response
        console.log("Course API Response:", courseData);
        console.log("Course slides:", courseData.slides);
        console.log("Course lessons:", courseData.lessons);
        console.log("Course students:", courseData.students);

        // Fetch lessons for this course
        const lessonsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/lessons?courseId=${courseId}`,
          {
            credentials: "include",
          }
        );

        // Fetch slides for this course
        const slidesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/slides?courseId=${courseId}`,
          {
            credentials: "include",
          }
        );

        let lessonsData: ILesson[] = [];
        let slidesData: ISlide[] = [];

        if (lessonsResponse.ok) {
          lessonsData = await lessonsResponse.json();
          // No need to filter since the API now returns only course-specific lessons
        }

        if (slidesResponse.ok) {
          slidesData = await slidesResponse.json();
          // No need to filter since the API now returns only course-specific slides
        }

        // Transform the API response to match our interface
        let transformedCourse: ClientCourse;

        try {
          transformedCourse = {
            ...courseData,
            _id: courseData._id,
            school:
              courseData.school && courseData.school.toString().length === 24
                ? new Types.ObjectId(courseData.school.toString())
                : new Types.ObjectId(), // Fallback to a new ObjectId if invalid
            slides:
              courseData.slides
                ?.filter((id: any) => id && id.toString().length === 24)
                ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
            lessons:
              courseData.lessons
                ?.filter((id: any) => id && id.toString().length === 24)
                ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
            students:
              courseData.students
                ?.filter((id: any) => id && id.toString().length === 24)
                ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
            lessonsCount: lessonsData.length,
            slidesCount: slidesData.length,
            studentsCount: courseData.students?.length || 0,
            lastUpdated:
              new Date(
                courseData.updatedAt || courseData.createdAt
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) + " ago",
          };
        } catch (error) {
          console.error("Error transforming course data:", error);
          console.log("Raw course data:", courseData);

          // Fallback transformation with empty arrays
          transformedCourse = {
            ...courseData,
            _id: courseData._id || "unknown",
            school: new Types.ObjectId(),
            slides: [],
            lessons: [],
            students: [],
            lessonsCount: 0,
            slidesCount: 0,
            studentsCount: 0,
            lastUpdated: "Recently",
          };
        }

        setCourse(transformedCourse);
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
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedCourse),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const updatedData = await response.json();

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              ...updatedData,
              _id: updatedData._id,
              school: new Types.ObjectId(updatedData.school),
              slides:
                updatedData.slides
                  ?.filter((id: any) => id && id.toString().length === 24)
                  ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
              lessons:
                updatedData.lessons
                  ?.filter((id: any) => id && id.toString().length === 24)
                  ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
              students:
                updatedData.students
                  ?.filter((id: any) => id && id.toString().length === 24)
                  ?.map((id: any) => new Types.ObjectId(id.toString())) || [],
            }
          : null
      );

      toast.success("Course updated successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleCreateLesson = async (lessonData: ICreateLessonDto) => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }
      if (
        !lessonData.courseId ||
        !lessonData.courseId.toString ||
        lessonData.courseId.toString().length !== 24
      ) {
        console.error(
          "Invalid or missing courseId in lesson creation:",
          lessonData.courseId
        );
        throw new Error(
          "Cannot create lesson: courseId is missing or invalid."
        );
      }

      // Build payload according to backend contract
      const apiPayload: any = {
        title: lessonData.title,
        courseId: lessonData.courseId.toString(),
        duration: lessonData.duration,
        difficulty: lessonData.difficulty
          ? lessonData.difficulty.toUpperCase()
          : "BEGINNER",
      };
      if (lessonData.description)
        apiPayload.description = lessonData.description;
      if (lessonData.slides)
        apiPayload.slides = lessonData.slides.map((id) => id.toString());
      if (lessonData.tags) apiPayload.tags = lessonData.tags;

      console.log("Creating lesson with data:", apiPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(apiPayload),
        }
      );

      console.log("Lesson creation response status:", response.status);

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {}
        console.error("Lesson creation error response:", errorData);
        toast.error(
          errorData?.message ||
            `Failed to create lesson: ${response.status} ${response.statusText}`
        );
        throw new Error(
          errorData?.message ||
            `Failed to create lesson: ${response.status} ${response.statusText}`
        );
      }

      const newLesson = await response.json();
      console.log("Lesson created successfully:", newLesson);

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

      // --- NEW: Update course lessons array in backend ---
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${lessonData.courseId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ $push: { lessons: newLesson._id } }),
          }
        );
      } catch (err) {
        console.error(
          "Failed to update course lessons array after lesson creation",
          err
        );
      }
      // ---------------------------------------------------

      toast.success("Lesson created successfully!");
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
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }
      if (
        !slideData.courseId ||
        !slideData.courseId.toString ||
        slideData.courseId.toString().length !== 24
      ) {
        console.error(
          "Invalid or missing courseId in slide creation:",
          slideData.courseId
        );
        throw new Error("Cannot create slide: courseId is missing or invalid.");
      }

      // Prepare FormData
      const formData = new FormData();

      // Add image files (if any)
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          formData.append("uploadImage", file);
        }
      }

      // Only include defined values in the payload
      const apiPayload: ICreateSlideDto = {
        title: slideData.title,
        order: slideData.order,
        courseId: slideData.courseId,
      };
      if (slideData.content) apiPayload.content = slideData.content;
      if (slideData.lessonId) apiPayload.lessonId = slideData.lessonId;
      if (slideData.titleFont) apiPayload.titleFont = slideData.titleFont;
      if (slideData.contentFont) apiPayload.contentFont = slideData.contentFont;
      if (slideData.startingCode)
        apiPayload.startingCode = slideData.startingCode;
      if (slideData.solutionCode)
        apiPayload.solutionCode = slideData.solutionCode;
      if (slideData.backgroundColor)
        apiPayload.backgroundColor = slideData.backgroundColor;
      if (slideData.textColor) apiPayload.textColor = slideData.textColor;
      if (slideData.themeColors) {
        apiPayload.themeColors = {
          main: slideData.themeColors.main,
          secondary: slideData.themeColors.secondary,
        };
      }
      if (slideData.imageUrls) apiPayload.imageUrls = slideData.imageUrls;

      // Add slide data as JSON string
      formData.append("data", JSON.stringify(apiPayload));

      // Send as multipart/form-data (do NOT set Content-Type header manually)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/slides`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          const errorText = await response.text();
          errorData = errorText ? JSON.parse(errorText) : null;
        } catch (parseError) {
          // fallback
        }
        throw new Error(
          errorData?.message ||
            `Failed to create slide: ${response.status} ${response.statusText}`
        );
      }

      const newSlide = await response.json();
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
      // Update course and lesson slides array in backend
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${slideData.courseId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ $push: { slides: newSlide._id } }),
          }
        );
        if (slideData.lessonId) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/lessons/${slideData.lessonId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ $push: { slides: newSlide._id } }),
            }
          );
        }
      } catch (err) {
        console.error(
          "Failed to update course/lesson slides array after slide creation",
          err
        );
      }
      toast.success("Slide created successfully!");
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
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(
          errorData?.message ||
            `Failed to update lesson: ${response.status} ${response.statusText}`
        );
      }

      const updatedLesson = await response.json();

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
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(
          errorData?.message ||
            `Failed to delete lesson: ${response.status} ${response.statusText}`
        );
      }

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
    imageFiles?: File[]
  ) => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      // Prepare FormData
      const formData = new FormData();

      // Add image files (if any)
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          formData.append("uploadImage", file);
        }
      }

      // Add slide data as JSON string
      formData.append("data", JSON.stringify(updatedData));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/slides/${slideId}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(
          errorData?.message ||
            `Failed to update slide: ${response.status} ${response.statusText}`
        );
      }

      const updatedSlide = await response.json();

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
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/slides/${slideId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(
          errorData?.message ||
            `Failed to delete slide: ${response.status} ${response.statusText}`
        );
      }

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
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
                <Button variant="outline" size="sm">
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
              onPreviewCourse={() => {}}
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
              await handleUpdateSlide(
                editingSlide._id.toString(),
                {
                  title: data.title,
                  content: data.content,
                  order: data.order,
                  lesson: data.lesson
                    ? new Types.ObjectId(data.lesson.toString())
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
                },
                imageFiles
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
