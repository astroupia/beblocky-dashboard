"use client";

import { Card } from "@/components/ui/card";
import { Book, Users, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CourseStats {
  totalCourses: number;
  activeStudents: number;
  averageCompletion: number;
  certifications: number;
}

export function ModernCourseStats() {
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    activeStudents: 0,
    averageCompletion: 0,
    certifications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Validate API URL
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured");
        }

        // Fetch courses
        const coursesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        // Fetch students
        const studentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/students`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses");
        }

        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students");
        }

        const courses = await coursesResponse.json();
        const students = await studentsResponse.json();

        // Calculate current stats
        const currentCourses = Array.isArray(courses) ? courses.length : 0;
        const currentStudents = Array.isArray(students) ? students.length : 0;

        setStats({
          totalCourses: currentCourses,
          activeStudents: currentStudents,
          averageCompletion: 75, // Simulated completion rate
          certifications: Math.floor(currentStudents * 0.3), // 30% of students get certified
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch statistics. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ModernStatCard
        title="Total Courses"
        value={isLoading ? "..." : stats.totalCourses.toString()}
        icon={Book}
        color="from-blue-500 to-blue-600"
        delay={0}
        isLoading={isLoading}
      />
      <ModernStatCard
        title="Active Students"
        value={isLoading ? "..." : stats.activeStudents.toString()}
        icon={Users}
        color="from-green-500 to-green-600"
        delay={0.1}
        isLoading={isLoading}
      />
      <ModernStatCard
        title="Average Completion"
        value={isLoading ? "..." : `${stats.averageCompletion}%`}
        icon={Clock}
        color="from-orange-500 to-orange-600"
        delay={0.2}
        isLoading={isLoading}
      />
      <ModernStatCard
        title="Certifications"
        value={isLoading ? "..." : stats.certifications.toString()}
        icon={Trophy}
        color="from-purple-500 to-purple-600"
        delay={0.3}
        isLoading={isLoading}
      />
    </div>
  );
}

interface ModernStatCardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
  delay: number;
  isLoading?: boolean;
}

function ModernStatCard({
  title,
  value,
  icon: Icon,
  color,
  delay,
  isLoading = false,
}: ModernStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <p
              className={`text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {value}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
