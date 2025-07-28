"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Users,
  Sparkles,
  TrendingUp,
  BookOpen,
  Clock,
} from "lucide-react";
import { ClassCard } from "@/components/class/class-card";
import { ModernCreateClassDialog } from "@/components/class/create-class-dialog";
import { ClassStatsCard } from "@/components/class/class-stats-card";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { IClass, ICreateClassDto, IClassStats } from "@/types/class";
import type { IUser } from "@/types/user";
import type { ITeacher } from "@/types/teacher";
import { classApi } from "@/lib/api/class";
import { teacherApi } from "@/lib/api/teacher";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import { Types } from "mongoose";
import { useSession } from "@/lib/auth-client";

export default function ModernClassesPage() {
  const session = useSession();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<IClass[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [overallStats, setOverallStats] = useState<IClassStats | null>(null);
  const [teacherData, setTeacherData] = useState<ITeacher | null>(null);

  // Load classes and teacher data on component mount
  useEffect(() => {
    if (session.data?.user) {
      loadTeacherData();
      loadClasses();
    }
  }, [session.data?.user]);

  const loadTeacherData = async () => {
    if (!session.data?.user?.email) return;

    try {
      // Get user data by email
      const userData = await userApi.getUserByEmail(session.data.user.email);

      // If user is a teacher, get teacher data using the new route pattern
      if (userData.role === "teacher" && userData._id) {
        const teacher = await teacherApi.getTeacherByUserId(
          userData._id,
          userData
        );
        setTeacherData(teacher);
      }
    } catch (error) {
      console.error("Failed to load teacher data:", error);
      // Don't show error toast - this might be expected for new users
    }
  };

  // Filter classes when search or filter changes
  useEffect(() => {
    let filtered = classes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cls) =>
          cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((cls) => {
        if (statusFilter === "active") return cls.isActive;
        if (statusFilter === "inactive") return !cls.isActive;
        return true;
      });
    }

    setFilteredClasses(filtered);
  }, [classes, searchQuery, statusFilter]);

  const loadClasses = async () => {
    if (!session.data?.user?.email) return;

    setIsLoading(true);
    try {
      // Get user data by email
      const userData = await userApi.getUserByEmail(session.data.user.email);
      const classesData = await classApi.getClasses(userData);
      setClasses(classesData);

      // Calculate overall stats from the actual data
      const totalStudents = classesData.reduce(
        (sum: number, cls: IClass) => sum + (cls.students?.length || 0),
        0
      );
      const totalCourses = classesData.reduce(
        (sum: number, cls: IClass) => sum + (cls.courses?.length || 0),
        0
      );
      const activeClasses = classesData.filter(
        (cls: IClass) => cls.isActive
      ).length;
      const averageProgress =
        classesData.length > 0 ? Math.round(100 / classesData.length) : 0;

      setOverallStats({
        totalStudents,
        totalCourses,
        activeStudents: totalStudents, // This would need to be calculated from actual student data
        averageProgress,
      });
    } catch (error) {
      console.error("Failed to load classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async (data: ICreateClassDto) => {
    console.log("Parent: Handling class creation completion");

    try {
      // The class has already been created in the dialog component
      // We just need to refresh the classes list to show the new class
      await loadClasses();

      console.log("Parent: Classes list refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh classes list:", error);
      // Don't show error toast here as the class was already created successfully
    }
  };

  const handleViewClass = (classId: string) => {
    // Navigate to the class detail page
    window.location.href = `/classes/${classId}`;
  };

  const handleEditClass = (classId: string) => {
    // Navigate to edit page or open edit dialog
    toast.info(
      "Edit functionality coming soon! You'll be able to edit class details."
    );
  };

  const handleDeleteClass = async (classId: string) => {
    if (!session.data?.user?.email) {
      toast.error("User data not available");
      return;
    }

    // Show confirmation dialog
    if (
      !confirm(
        "Are you sure you want to delete this class? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Get user data by email
      const userData = await userApi.getUserByEmail(session.data.user.email);
      await classApi.deleteClass(classId, userData);
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
      toast.success("Class deleted successfully!");
    } catch (error) {
      console.error("Failed to delete class:", error);
      toast.error("Failed to delete class");
    }
  };

  const handleManageStudents = (classId: string) => {
    // Navigate to student management page
    toast.info(
      "Student management functionality coming soon! You'll be able to add/remove students."
    );
  };

  const handleSettings = (classId: string) => {
    // Navigate to settings page
    toast.info(
      "Class settings functionality coming soon! You'll be able to configure class settings."
    );
  };

  const getTabCounts = () => {
    return {
      all: classes.length,
      active: classes.filter((c) => c.isActive).length,
      draft: classes.filter((c) => !c.isActive).length,
    };
  };

  const tabCounts = getTabCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-6">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    Class Management
                  </span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Manage Your Classes
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Create, organize, and track student progress across all your
                  educational programs.
                </p>
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
                Create Class
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {overallStats?.totalStudents || 0}
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
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Classes
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {tabCounts.active}
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
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Progress
                    </p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {overallStats?.averageProgress || 0}%
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
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Learning Hours
                    </p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      0h
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Detailed Stats */}
        {overallStats && (
          <div className="mb-12">
            <ClassStatsCard stats={overallStats} />
          </div>
        )}

        {/* Filters and Search */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Your Classes
              </h2>
              <p className="text-muted-foreground mt-1">
                Manage and track your educational programs
              </p>
            </div>

            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search classes..."
                className="pl-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Modern Tabs with Counts */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                All Classes
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
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{filteredClasses.length} classes found</span>
                  {searchQuery && (
                    <Badge variant="secondary">Search: "{searchQuery}"</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="transition-all duration-300"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="transition-all duration-300"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Classes Grid/List */}
              <motion.div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-4"
                }
                layout
              >
                <AnimatePresence>
                  {filteredClasses.map((classData, index) => (
                    <motion.div
                      key={classData._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      layout
                    >
                      <ClassCard
                        classData={classData}
                        onView={handleViewClass}
                        onEdit={handleEditClass}
                        onDelete={handleDeleteClass}
                        onManageStudents={handleManageStudents}
                        onSettings={handleSettings}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredClasses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No classes found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Create your first class to get started"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Class
                    </Button>
                  )}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Class Dialog */}
        <ModernCreateClassDialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            console.log("Parent: Dialog open state changing to:", open);
            setIsCreateDialogOpen(open);
          }}
          onSubmit={handleCreateClass}
        />
      </div>
    </div>
  );
}
