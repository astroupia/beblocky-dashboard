"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { IClassStats } from "@/types/class";

interface ModernClassStatsCardProps {
  stats: IClassStats;
  className?: string;
}

export function ClassStatsCard({
  stats,
  className,
}: ModernClassStatsCardProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Students
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Active learners in classes
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Active Courses
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {stats.totalCourses}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Total courses
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Average Progress
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {stats.averageProgress}%
            </div>
            <Progress value={stats.averageProgress} className="mt-2 h-2" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Active Students
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {stats.activeStudents}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Currently enrolled
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
