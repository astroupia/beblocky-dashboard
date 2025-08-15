"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CourseNotFoundProps {
  courseId?: string;
  showBackButton?: boolean;
}

export function CourseNotFound({
  courseId,
  showBackButton = true,
}: CourseNotFoundProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mx-auto">
                  <BookOpen className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-600 mb-2">
                Course Not Found
              </CardTitle>
              <p className="text-muted-foreground">
                The course you're looking for doesn't exist or you don't have
                access to it.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {courseId && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Course ID:
                  </p>
                  <p className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded border">
                    {courseId}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Possible reasons:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• The course has been deleted or moved</li>
                    <li>• You don't have permission to access this course</li>
                    <li>• The course ID is incorrect</li>
                    <li>• The course is still being created</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {showBackButton && (
                    <Button
                      onClick={() => router.push("/courses")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Courses
                    </Button>
                  )}
                  <Button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Search className="h-4 w-4" />
                    Browse All Courses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
