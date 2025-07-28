"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Globe,
  Crown,
  Star,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ICreateCourseDto,
  CourseStatus,
  CourseSubscriptionType,
} from "@/types/course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ICourse } from "@/types/course";
import { Types } from "mongoose";

interface ModernCourseCreationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "create";
  initialCourse?: ICourse;
}

type Step = "course" | "review";

interface SubscriptionType {
  value: CourseSubscriptionType;
  label: string;
}

export function ModernCourseCreationFlow({
  open,
  onOpenChange,
  mode,
  initialCourse,
}: ModernCourseCreationFlowProps) {
  const [step, setStep] = useState<Step>("course");
  const [progress, setProgress] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [courseData, setCourseData] = useState<ICourse>(
    initialCourse || {
      courseTitle: "",
      courseDescription: "",
      courseLanguage: "HTML",
      subType: CourseSubscriptionType.FREE,
      status: CourseStatus.DRAFT,
      slides: [],
      lessons: [],
      students: [],
      rating: 0,
      school: new Types.ObjectId(),
      language: "English",
    }
  );

  const steps = [
    {
      id: "course",
      title: "Course Details",
      description: "Set up the basic information for your course",
      progress: 50,
    },
    {
      id: "review",
      title: "Review & Publish",
      description: "Review your course and publish changes",
      progress: 100,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setStep(nextStep.id as Step);
      setProgress(nextStep.progress);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setStep(prevStep.id as Step);
      setProgress(prevStep.progress);
    }
  };

  const getSubTypeIcon = (subType: CourseSubscriptionType) => {
    switch (subType) {
      case CourseSubscriptionType.PRO:
        return <Crown className="h-4 w-4" />;
      case CourseSubscriptionType.ORGANIZATION:
        return <Star className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getSubTypeColor = (subType: CourseSubscriptionType) => {
    switch (subType) {
      case CourseSubscriptionType.PRO:
        return "from-purple-500 to-purple-600";
      case CourseSubscriptionType.BUILDER:
        return "from-blue-500 to-blue-600";
      case CourseSubscriptionType.ORGANIZATION:
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);

      // Validate API URL
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const createCourseDto: ICreateCourseDto = {
        courseTitle: courseData.courseTitle,
        courseDescription: courseData.courseDescription,
        courseLanguage: courseData.courseLanguage,
        subType: courseData.subType,
        status: courseData.status,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(createCourseDto),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create course");
      }

      const newCourse = await response.json();
      toast.success("Course created successfully!");
      router.push(`/courses/${newCourse._id}/edit`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create course. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionTypes: SubscriptionType[] = [
    { value: CourseSubscriptionType.FREE, label: "Free" },
    { value: CourseSubscriptionType.STARTER, label: "Starter" },
    { value: CourseSubscriptionType.BUILDER, label: "Builder" },
    { value: CourseSubscriptionType.PRO, label: "Pro" },
    { value: CourseSubscriptionType.ORGANIZATION, label: "Organization" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto scrollbar-hide border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

        <DialogHeader className="relative z-10 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {currentStep.title}
          </DialogTitle>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </DialogHeader>

        {/* Modern Progress Indicator */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStepIndex
                        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
                        : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.div>
                  <span className="text-xs mt-2 text-center max-w-20">
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-slate-200 dark:bg-slate-700 relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/80"
                      initial={{ width: "0%" }}
                      animate={{
                        width: index < currentStepIndex ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Progress
            value={progress}
            className="h-2 bg-slate-200 dark:bg-slate-700"
          />
        </div>

        {/* Step Content */}
        <div className="relative z-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === "course" && (
                <ModernCourseForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onComplete={handleNext}
                  getSubTypeIcon={getSubTypeIcon}
                  getSubTypeColor={getSubTypeColor}
                />
              )}

              {step === "review" && (
                <ModernReviewStep
                  courseData={courseData}
                  getSubTypeColor={getSubTypeColor}
                  onPublish={handlePublish}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStepIndex < steps.length - 1 && (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ModernCourseFormProps {
  courseData: ICourse;
  setCourseData: (data: ICourse) => void;
  onComplete: () => void;
  getSubTypeIcon: (subType: CourseSubscriptionType) => React.ReactNode;
  getSubTypeColor: (subType: CourseSubscriptionType) => string;
}

function ModernCourseForm({
  courseData,
  setCourseData,
  onComplete,
  getSubTypeIcon,
  getSubTypeColor,
}: ModernCourseFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const subscriptionTypes: SubscriptionType[] = [
    { value: CourseSubscriptionType.FREE, label: "Free" },
    { value: CourseSubscriptionType.STARTER, label: "Starter" },
    { value: CourseSubscriptionType.BUILDER, label: "Builder" },
    { value: CourseSubscriptionType.PRO, label: "Pro" },
    { value: CourseSubscriptionType.ORGANIZATION, label: "Organization" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseTitle" className="text-sm font-medium">
                  Course Title
                </Label>
                <Input
                  id="courseTitle"
                  value={courseData.courseTitle}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      courseTitle: e.target.value,
                    })
                  }
                  placeholder="Enter an engaging course title"
                  className="mt-2 bg-white/80 dark:bg-slate-800/80"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="courseDescription"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="courseDescription"
                  value={courseData.courseDescription}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      courseDescription: e.target.value,
                    })
                  }
                  placeholder="Describe what students will learn"
                  rows={4}
                  className="mt-2 bg-white/80 dark:bg-slate-800/80"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border-0">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Course Settings
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseLanguage" className="text-sm font-medium">
                  Language
                </Label>
                <Select
                  value={courseData.courseLanguage}
                  onValueChange={(value) =>
                    setCourseData({ ...courseData, courseLanguage: value })
                  }
                >
                  <SelectTrigger className="mt-2 bg-white/80 dark:bg-slate-800/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Typescript">Typescript</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Subscription Type</Label>
                <Select
                  value={courseData.subType}
                  onValueChange={(value) =>
                    setCourseData({
                      ...courseData,
                      subType: value as CourseSubscriptionType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionTypes.map((type: SubscriptionType) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center justify-center gap-2">
                          {getSubTypeIcon(type.value)}
                          <span className="text-sm font-medium">
                            {type.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Preview
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">
                  {courseData.courseTitle || "Course Title"}
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  {courseData.courseDescription ||
                    "Course description will appear here"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`bg-gradient-to-r ${getSubTypeColor(courseData.subType)} text-white border-0`}
                >
                  {courseData.subType}
                </Badge>
                <Badge variant="outline">{courseData.courseLanguage}</Badge>
                {courseData.courseTitle && (
                  <Badge variant="outline">{courseData.courseTitle}</Badge>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-muted-foreground mb-2">
                  Next Steps:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Add lessons to organize your content</li>
                  <li>• Create slides for interactive learning</li>
                  <li>• Publish when ready for students</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can create your course now and add lessons and slides later
              through the course editor. This gives you flexibility to build
              your content over time.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continue to Review
        </Button>
      </div>
    </form>
  );
}

interface ModernReviewStepProps {
  courseData: ICourse;
  getSubTypeColor: (subType: CourseSubscriptionType) => string;
  onPublish: () => void;
  isLoading: boolean;
}

function ModernReviewStep({
  courseData,
  getSubTypeColor,
  onPublish,
  isLoading,
}: ModernReviewStepProps) {
  return (
    <div className="space-y-8">
      <Card className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border-0">
        <h3 className="text-xl font-bold mb-6 text-center">Course Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Course Title
              </h4>
              <p className="text-lg font-medium">{courseData.courseTitle}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Description
              </h4>
              <p className="text-sm text-muted-foreground">
                {courseData.courseDescription}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Settings
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  className={`bg-gradient-to-r ${getSubTypeColor(courseData.subType)} text-white border-0`}
                >
                  {courseData.subType}
                </Badge>
                <Badge variant="outline">{courseData.courseLanguage}</Badge>
                {courseData.courseTitle && (
                  <Badge variant="outline">{courseData.courseTitle}</Badge>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Status
              </h4>
              <Badge variant="secondary" className="mt-2">
                {courseData.status}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-0">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
            Ready to Create!
          </h3>
          <p className="text-green-700 dark:text-green-300 max-w-md mx-auto">
            Your course is ready to be created. You can add lessons and slides
            later through the course editor.
          </p>
          <Button
            onClick={onPublish}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </div>
      </Card>
    </div>
  );
}
