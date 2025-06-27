"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* Hero Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8 backdrop-blur-sm"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4 w-2/3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-10 w-full max-w-lg rounded-lg" />
              <Skeleton className="h-6 w-full max-w-md rounded-md" />
            </div>
            <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
        </motion.div>

        {/* Stats Section Skeleton */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Courses Grid Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-full sm:w-80 rounded-md" />
          </div>

          {/* Tabs Skeleton */}
          <div className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </motion.div>

        {/* Course Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full mb-4" />
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32 mt-2" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
