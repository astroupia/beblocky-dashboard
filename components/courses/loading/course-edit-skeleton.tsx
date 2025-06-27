"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CourseEditorPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Course Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-8"
        >
          <Skeleton className="h-8 w-32 mb-6" /> {/* Back button */}
          <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex items-start gap-6 w-full lg:w-2/3">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-full max-w-xl" />
                  <div className="flex items-center gap-4 text-sm">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Course Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>

          {/* Overview Tab Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
