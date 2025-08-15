"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  Settings,
  Edit,
  Trash2,
  UserPlus,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { IClass } from "@/types/class";
import type { IUser } from "@/types/user";
import type { IStudent } from "@/types/student";
import type { ClientCourse } from "@/lib/api/course";
import { classApi } from "@/lib/api/class";
import { userApi } from "@/lib/api/user";
import { studentApi } from "@/lib/api/student";
import { fetchCourse } from "@/lib/api/course";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { ModernManageStudentsDialog } from "@/components/class/dialog/manage-students-dialog";
import { ModernEditClassDialog } from "@/components/class/dialog/edit-class-dialog";
import { ModernClassSettingsDialog } from "@/components/class/dialog/class-setting-dialog";
import { DeleteClassConfirmationDialog } from "@/components/class/dialog/delete-class-confirmation-dialog";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const classId = params.id as string;

  const [classData, setClassData] = useState<IClass | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [courses, setCourses] = useState<ClientCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [isClassSettingsOpen, setIsClassSettingsOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (classId && session.data?.user) {
      loadClassData();
    }
  }, [classId, session.data?.user]);

  const loadClassData = async () => {
    if (!session.data?.user?.email) return;

    try {
      console.log("Loading class data for ID:", classId);
      const userData = await userApi.getUserByEmail(session.data.user.email);
      const classDetails = await classApi.getClassById(classId, userData);
      console.log("Loaded class data:", classDetails);
      setClassData(classDetails);

      // Load students and courses data
      await loadStudentsAndCourses(classDetails);
    } catch (error) {
      console.error("Failed to load class data:", error);
      toast.error("Failed to load class details");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentsAndCourses = async (classDetails: IClass) => {
    try {
      // Load students data with user information
      const studentsData = await Promise.all(
        classDetails.students.map(async (studentId) => {
          try {
            const student = await studentApi.getStudentByUserId(
              studentId.toString(),
              {
                _id: studentId.toString(),
                email: session.data?.user?.email || "",
                role: "student",
              } as IUser
            );

            // Fetch user information to get the full name
            let userName = student.userId || studentId.toString();
            try {
              const userInfo = await userApi.getUserByEmail(
                student.userId || studentId.toString()
              );
              userName =
                userInfo.name ||
                userInfo.email ||
                student.userId ||
                studentId.toString();
            } catch (userError) {
              console.error(
                `Failed to load user info for student ${studentId}:`,
                userError
              );
              // Keep the original userId if user info fetch fails
            }

            return {
              ...student,
              displayName: userName,
            };
          } catch (error) {
            console.error(`Failed to load student ${studentId}:`, error);
            // Return a fallback student object
            return {
              _id: studentId.toString(),
              userId: studentId.toString(),
              displayName: `Student ${studentId.toString().slice(-4)}`,
              dateOfBirth: new Date(),
              grade: 1,
              gender: "other" as any,
              enrolledCourses: [],
              coins: 0,
              codingStreak: 0,
              lastCodingActivity: new Date(),
              totalCoinsEarned: 0,
              totalTimeSpent: 0,
              goals: [],
              subscription: "free",
              section: "A",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
        })
      );
      setStudents(studentsData);

      // Load courses data
      const coursesData = await Promise.all(
        classDetails.courses.map(async (courseId) => {
          try {
            return await fetchCourse(courseId.toString());
          } catch (error) {
            console.error(`Failed to load course ${courseId}:`, error);
            // Return a fallback course object
            return {
              _id: courseId.toString(),
              courseTitle: `Course ${courseId.toString().slice(-4)}`,
              courseDescription: "Course description not available",
              courseLanguage: "English",
              slides: [],
              lessons: [],
              students: [],
              organization: [],
              subType: "Free" as any,
              status: "Draft" as any,
              rating: 0,
              language: "English",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
        })
      );
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load students and courses:", error);
    }
  };

  const handleDeleteClass = async () => {
    if (!session.data?.user?.email || !classData) return;

    setIsDeleting(true);
    try {
      const userData = await userApi.getUserByEmail(session.data.user.email);
      await classApi.deleteClass(classId, userData);
      toast.success("Class deleted successfully!");
      router.push("/classes");
    } catch (error) {
      console.error("Failed to delete class:", error);
      toast.error("Failed to delete class");
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmationOpen(false);
    }
  };

  const handleShowDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const handleEditClass = () => {
    setIsEditClassOpen(true);
  };

  const handleSaveEdit = async (updatedClass: any) => {
    if (!session.data?.user?.email || !classData) return;

    try {
      const userData = await userApi.getUserByEmail(session.data.user.email);

      // Convert the updated class data to match IUpdateClassDto
      const updateData: any = {
        className: updatedClass.name || updatedClass.className, // Use className for API
        description: updatedClass.description,
        startDate: updatedClass.startDate
          ? updatedClass.startDate.toISOString()
          : undefined,
        endDate: updatedClass.endDate
          ? updatedClass.endDate.toISOString()
          : undefined,
        settings: updatedClass.settings,
      };

      // Only include arrays if they exist and are different from current data
      if (updatedClass.courses && Array.isArray(updatedClass.courses)) {
        updateData.courses = updatedClass.courses.map((id: any) =>
          id.toString()
        );
      }
      if (updatedClass.students && Array.isArray(updatedClass.students)) {
        updateData.students = updatedClass.students.map((id: any) =>
          id.toString()
        );
      }

      console.log("Sending update data to API:", updateData);

      // Call the API and get the actual updated class data
      const updatedClassData = await classApi.updateClass(
        classId,
        updateData,
        userData
      );

      console.log("API returned updated class:", updatedClassData);

      // Update local state with the actual API response
      setClassData(updatedClassData);

      // Reload the class data to ensure we have the latest from database
      await loadClassData();

      toast.success("Class updated successfully!");
      setIsEditClassOpen(false);
    } catch (error) {
      console.error("Failed to update class:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update class"
      );
    }
  };

  const handleManageStudents = () => {
    setIsManageStudentsOpen(true);
  };

  const handleSettings = () => {
    setIsClassSettingsOpen(true);
  };

  const handleSaveSettings = async (settings: any) => {
    if (!session.data?.user?.email || !classData) return;

    try {
      const userData = await userApi.getUserByEmail(session.data.user.email);

      // Update class settings using the updateSettings API
      await classApi.updateSettings(
        classId,
        {
          allowStudentEnrollment: settings.allowStudentEnrollment,
          requireApproval: settings.requireApproval,
          autoProgress: settings.autoProgress,
        },
        userData
      );

      // Update local state
      setClassData((prev) =>
        prev
          ? {
              ...prev,
              settings: {
                ...prev.settings,
                allowStudentEnrollment: settings.allowStudentEnrollment,
                requireApproval: settings.requireApproval,
                autoProgress: settings.autoProgress,
              },
            }
          : null
      );

      toast.success("Class settings updated successfully!");
      setIsClassSettingsOpen(false);
    } catch (error) {
      console.error("Failed to update class settings:", error);
      toast.error("Failed to update class settings");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The class you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button onClick={() => router.push("/classes")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle undefined dates with fallbacks
  const startDate = classData.startDate
    ? new Date(classData.startDate)
    : new Date();
  const endDate = classData.endDate
    ? new Date(classData.endDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const createdAt = classData.createdAt
    ? new Date(classData.createdAt)
    : new Date();

  const daysUntilEnd = Math.ceil(
    (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage = Math.max(
    0,
    Math.min(
      100,
      ((new Date().getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100
    )
  );

  const status =
    classData.status || (classData.isActive ? "Active" : "Inactive");
  const isActive = status === "Active" || classData.isActive;
  const displayName = classData.name || classData.className;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/classes")}
            className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Button>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={isActive ? "bg-green-500" : ""}
                >
                  {status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Class ID: {classData._id}
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {displayName}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {classData.description || "No description available"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleEditClass}
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={handleManageStudents}
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
              <Button
                onClick={handleSettings}
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                onClick={handleShowDeleteConfirmation}
                variant="destructive"
                className="hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    {classData.students.length}
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
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {classData.courses.length}
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {Math.round(progressPercentage)}%
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
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Left</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {daysUntilEnd > 0 ? daysUntilEnd : 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg">
              Students
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-lg">
              Courses
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Class Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">
                      {startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">
                      {endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Students:</span>
                    <span className="font-medium">
                      {classData.maxStudents || "Unlimited"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Class Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1">
                      {classData.description || "No description available"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      className="ml-2"
                      variant={isActive ? "default" : "secondary"}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Organization ID:
                    </span>
                    <p className="mt-1 font-mono text-sm">
                      {classData.organizationId?.toString() || "Not assigned"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student, index) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.displayName?.slice(0, 2).toUpperCase() ||
                                `S${index + 1}`}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {student.displayName || `Student ${index + 1}`}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Grade {student.grade}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {student.subscription}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {student.coins} coins
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No students enrolled yet
                    </p>
                    <Button onClick={handleManageStudents} className="mt-4">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Students
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assigned Courses ({courses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <div className="space-y-2">
                    {courses.map((course, index) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">
                              {course.courseTitle}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {course.courseLanguage} • {course.subType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              course.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              course.status === "Active" ? "bg-green-500" : ""
                            }
                          >
                            {course.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.lessonsCount || course.lessons?.length || 0}{" "}
                            lessons
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No courses assigned yet
                    </p>
                    <Button className="mt-4">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Assign Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Class Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Allow Student Enrollment:
                  </span>
                  <Badge
                    variant={
                      classData.settings?.allowStudentEnrollment
                        ? "default"
                        : "secondary"
                    }
                  >
                    {classData.settings?.allowStudentEnrollment
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Require Approval:
                  </span>
                  <Badge
                    variant={
                      classData.settings?.requireApproval
                        ? "default"
                        : "secondary"
                    }
                  >
                    {classData.settings?.requireApproval
                      ? "Required"
                      : "Not Required"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Auto Progress:</span>
                  <Badge
                    variant={
                      classData.settings?.autoProgress ? "default" : "secondary"
                    }
                  >
                    {classData.settings?.autoProgress ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Manage Students Dialog */}
      <ModernManageStudentsDialog
        open={isManageStudentsOpen}
        onOpenChange={setIsManageStudentsOpen}
        classId={classId}
        className={displayName}
      />

      {/* Edit Class Dialog */}
      {classData && (
        <ModernEditClassDialog
          open={isEditClassOpen}
          onOpenChange={setIsEditClassOpen}
          classData={classData}
          onSave={handleSaveEdit}
        />
      )}

      {/* Class Settings Dialog */}
      {classData && (
        <ModernClassSettingsDialog
          open={isClassSettingsOpen}
          onOpenChange={setIsClassSettingsOpen}
          classData={classData}
          onSave={handleSaveSettings}
        />
      )}

      {/* Delete Class Confirmation Dialog */}
      <DeleteClassConfirmationDialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
        className={displayName}
        onConfirm={handleDeleteClass}
        isLoading={isDeleting}
      />
    </div>
  );
}
