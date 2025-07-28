"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  Star,
  Clock,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CourseStatus, CourseSubscriptionType } from "@/types/course";

import { useRouter } from "next/navigation";
import {
  fetchAllCoursesWithDetails,
  deleteCourse,
  ClientCourse,
} from "@/lib/api/course";

export function ModernCourseGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState<ClientCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const coursesWithDetails = await fetchAllCoursesWithDetails();
        setCourses(coursesWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch courses. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course.language.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" || course.status.toLowerCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: courses.length,
      active: courses.filter((c) => c.status === CourseStatus.ACTIVE).length,
      draft: courses.filter((c) => c.status === CourseStatus.DRAFT).length,
    };
  };

  const tabCounts = getTabCounts();

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      // Remove the course from the local state
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete course. Please try again."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Integrated Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Your Courses
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage and track your educational content
            </p>
          </div>

          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              className="pl-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Modern Tabs with Counts */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              All Courses
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4" />
              Active
              <Badge
                variant="secondary"
                className="ml-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                {tabCounts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg transition-all duration-300"
            >
              <Clock className="h-4 w-4" />
              Draft
              <Badge
                variant="secondary"
                className="ml-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              >
                {tabCounts.draft}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {/* Course Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              <AnimatePresence>
                {isLoading
                  ? // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="h-80 bg-white/80 dark:bg-slate-900/80 animate-pulse">
                          <div className="p-6 space-y-4">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  : filteredCourses.map((course, index) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        <ModernCourseCard
                          course={course}
                          onDelete={handleDeleteCourse}
                        />
                      </motion.div>
                    ))}
              </AnimatePresence>
            </motion.div>

            {!isLoading && filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : `No ${activeTab} courses available`}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ModernCourseCardProps {
  course: ClientCourse;
  onDelete: (courseId: string) => void;
}

function ModernCourseCard({ course, onDelete }: ModernCourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const getSubTypeColor = (subType: CourseSubscriptionType) => {
    switch (subType) {
      case CourseSubscriptionType.PRO:
        return "from-purple-500 to-purple-600";
      case CourseSubscriptionType.BUILDER:
        return "from-blue-500 to-blue-600";
      case CourseSubscriptionType.ORGANIZATION:
        return "from-yellow-500 to-yellow-600";
      case CourseSubscriptionType.STARTER:
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status: CourseStatus) => {
    return status === CourseStatus.ACTIVE
      ? "bg-green-500 hover:bg-green-600"
      : "bg-yellow-500 hover:bg-yellow-600";
  };

  const handleEdit = () => {
    router.push(`/courses/${course._id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      onDelete(course._id);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header Section */}
      <div className="relative p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <Badge
                variant={
                  course.status === CourseStatus.ACTIVE
                    ? "default"
                    : "secondary"
                }
                className={getStatusColor(course.status)}
              >
                {course.status}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={handleEdit}
                className="flex items-center"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Course
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {course.courseTitle}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {course.courseDescription}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-6 space-y-4">
        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </div>
            <p className="text-lg font-semibold">{course.studentsCount || 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Lessons</span>
            </div>
            <p className="text-lg font-semibold">{course.lessonsCount || 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Slides</span>
            </div>
            <p className="text-lg font-semibold">{course.slidesCount || 0}</p>
          </div>
        </div>

        {/* Progress Bar (only for active courses) */}
        {course.status === CourseStatus.ACTIVE && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Rating (only for active courses) */}
        {course.status === CourseStatus.ACTIVE && course.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({course.studentsCount || 0} reviews)
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {course.language}
            </Badge>
            <span>{course.courseLanguage}</span>
          </div>

          <Badge
            className={`bg-gradient-to-r ${getSubTypeColor(course.subType)} text-white border-0`}
          >
            {course.subType}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          Updated {course.lastUpdated || "Recently"}
        </div>
      </div>
    </Card>
  );
}
