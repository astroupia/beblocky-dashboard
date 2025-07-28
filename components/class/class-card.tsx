"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BookOpen,
  Calendar,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IClass } from "@/types/class";

interface ModernClassCardProps {
  classData: IClass;
  onView: (classId: string) => void;
  onEdit: (classId: string) => void;
  onDelete: (classId: string) => void;
  onManageStudents: (classId: string) => void;
  onSettings: (classId: string) => void;
  viewMode?: "grid" | "list";
}

export function ClassCard({
  classData,
  onView,
  onEdit,
  onDelete,
  onManageStudents,
  onSettings,
  viewMode = "grid",
}: ModernClassCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle undefined dates with fallbacks
  const startDate = classData.startDate
    ? new Date(classData.startDate)
    : new Date();
  const endDate = classData.endDate
    ? new Date(classData.endDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
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

  // Determine status - use status property if available, otherwise derive from isActive
  const status =
    classData.status || (classData.isActive ? "Active" : "Inactive");
  const isActive = status === "Active" || classData.isActive;

  // Use name if available, otherwise fall back to className
  const displayName = classData.name || classData.className;
  const classId = classData._id || "";

  // Handler functions with debugging and loading states
  const handleView = async () => {
    console.log("View button clicked for class:", classId);
    setIsLoading(true);
    try {
      await onView(classId);
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === "list") {
    return (
      <Card
        className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleView}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            isActive ? "bg-green-500" : "bg-gray-400"
          )}
        ></div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {displayName}
                  </h3>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? "bg-green-500" : ""}
                  >
                    {status}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-1">
                  {classData.description}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{classData.students.length} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span>{classData.courses.length} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{daysUntilEnd > 0 ? daysUntilEnd : 0} days left</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {Math.round(progressPercentage)}% Complete
                </p>
                <Progress
                  value={progressPercentage}
                  className="w-24 h-2 mt-1"
                />
              </div>

              <Button
                onClick={handleView}
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "View"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          isActive ? "bg-green-500" : "bg-gray-400"
        )}
      ></div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={isActive ? "bg-green-500" : ""}
              >
                {status}
              </Badge>
            </div>
            <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300 mt-3">
              {displayName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {classData.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold">{classData.students.length}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
              <BookOpen className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold">{classData.courses.length}</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold">
              {daysUntilEnd > 0 ? daysUntilEnd : 0}
            </p>
            <p className="text-xs text-muted-foreground">Days left</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Class Progress
            </span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Students Avatars */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Students</p>
          <div className="flex items-center gap-2">
            {classData.students.length > 0 ? (
              <>
                {classData.students.slice(0, 4).map((studentId, index) => (
                  <Avatar
                    key={studentId.toString()}
                    className="h-8 w-8 ring-2 ring-primary/20"
                  >
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10">
                      S{index + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {classData.students.length > 4 && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ring-2 ring-primary/20">
                    <span className="text-xs font-medium">
                      +{classData.students.length - 4}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No students enrolled
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={handleView}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="sm"
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "View Class"}
          </Button>
        </div>

        {/* Date Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
          </div>
          <span>Created {createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
