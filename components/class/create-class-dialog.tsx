"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  Loader2,
  BookOpen,
  Settings,
  Clock,
  CheckCircle,
  Info,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ICreateClassDto } from "@/types/class";
import { fetchAllCoursesWithDetails } from "@/lib/api/course";
import type { ClientCourse } from "@/lib/api/course";
import { useSession } from "@/lib/auth-client";
import { userApi } from "@/lib/api/user";
import { classApi } from "@/lib/api/class";
import { teacherApi } from "@/lib/api/teacher";
import { toast } from "sonner";

const createClassSchema = z
  .object({
    name: z.string().min(1, "Class name is required").max(100, "Name too long"),
    description: z.string().optional(),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    maxStudents: z.number().min(1).max(1000).optional(),
    allowSelfEnrollment: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    selectedCourses: z
      .array(z.string())
      .min(1, "At least one course is required"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type CreateClassFormData = z.infer<typeof createClassSchema>;

interface ModernCreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ICreateClassDto) => Promise<void>;
}

export function ModernCreateClassDialog({
  open,
  onOpenChange,
  onSubmit,
}: ModernCreateClassDialogProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [courses, setCourses] = useState<ClientCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [creationProgress, setCreationProgress] = useState<string>("");

  const form = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      description: "",
      maxStudents: undefined,
      allowSelfEnrollment: true,
      requireApproval: false,
      selectedCourses: [],
    },
    mode: "onChange", // Enable real-time validation
  });

  // Debug form state changes - only watch specific fields to reduce re-renders
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Only log changes to selectedCourses to reduce noise
      if (name === "selectedCourses") {
        console.log("Form field changed:", { name, type, value });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Add debugging for dialog state changes
  useEffect(() => {
    console.log("Dialog state changed:", {
      open,
      currentStep,
      isLoading,
      isLoadingCourses,
      validationError,
    });
  }, [open, currentStep, isLoading, isLoadingCourses, validationError]);

  // Add debugging for when the dialog is about to close
  useEffect(() => {
    if (!open) {
      console.log("Dialog closed - checking state:", {
        currentStep,
        isLoading,
        isLoadingCourses,
        validationError,
        formErrors: form.formState.errors,
        formValues: form.getValues(),
      });
    }
  }, [
    open,
    currentStep,
    isLoading,
    isLoadingCourses,
    validationError,
    form.formState.errors,
  ]);

  const steps = [
    {
      title: "Basic Information",
      description: "Set up your class details",
      icon: BookOpen,
      fields: ["name", "description"],
    },
    {
      title: "Schedule",
      description: "Define class timeline",
      icon: Clock,
      fields: ["startDate", "endDate"],
    },
    {
      title: "Courses",
      description: "Select courses for your class",
      icon: GraduationCap,
      fields: ["selectedCourses"],
    },
    {
      title: "Settings",
      description: "Configure class options",
      icon: Settings,
      fields: ["maxStudents", "allowSelfEnrollment", "requireApproval"],
    },
  ];

  // Load courses when dialog opens and session is available
  useEffect(() => {
    if (open && session.data?.user?.email) {
      loadCourses();
    }
  }, [open, !!session.data?.user?.email]);

  // Reset validation error when step changes
  useEffect(() => {
    setValidationError(null);
  }, [currentStep]);

  // Reset form and state when dialog opens
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, resetting state");
      setCurrentStep(0);
      setValidationError(null);
      form.reset();
    }
  }, [open, form]);

  const loadCourses = async () => {
    if (!session.data?.user?.email) {
      console.log("No user session available for loading courses");
      return;
    }

    setIsLoadingCourses(true);
    setValidationError(null);

    try {
      // Get user data first for authentication
      const userData = await userApi.getUserByEmail(session.data.user.email);
      console.log("User data for course loading:", userData);

      const coursesData = await fetchAllCoursesWithDetails();
      console.log("Loaded courses:", coursesData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setValidationError("Failed to load courses. Please try again.");
      // Don't throw the error, just log it so the dialog doesn't close
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleSubmit = async (data: CreateClassFormData) => {
    setIsLoading(true);
    setValidationError(null);
    setCreationProgress("");

    try {
      console.log("Starting class creation process...");
      setCreationProgress("Preparing class data...");
      toast.info("Creating your class...", {
        description: "Please wait while we set up your class.",
      });

      // Prepare the class data
      const createData: ICreateClassDto = {
        className: data.name,
        description: data.description || undefined,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        maxStudents: data.maxStudents || undefined,
        courses: data.selectedCourses,
        settings: {
          allowStudentEnrollment: data.allowSelfEnrollment,
          requireApproval: data.requireApproval,
          autoProgress: false,
        },
      };

      console.log("Class data prepared:", createData);

      // Get user data for authentication
      if (!session.data?.user?.email) {
        throw new Error("User session not available");
      }

      setCreationProgress("Authenticating user...");
      const userData = await userApi.getUserByEmail(session.data.user.email);
      console.log("User data retrieved for class creation");

      // Get teacher data to include organization ID
      setCreationProgress("Getting organization details...");
      const teacherData = await teacherApi.getCurrentTeacher(userData);
      console.log("Teacher data retrieved:", teacherData);

      // Add organization ID to the class data
      const createDataWithOrg: ICreateClassDto = {
        ...createData,
        organizationId: teacherData.organizationId?.toString(),
      };

      // Create the class using the API
      setCreationProgress("Creating class in database...");
      const newClass = await classApi.createClass(createDataWithOrg, userData);
      console.log("Class created successfully:", newClass);

      setCreationProgress("Finalizing setup...");

      // Show success toast
      toast.success("Class created successfully!", {
        description: `"${data.name}" is now ready for your students.`,
      });

      // Call the parent's onSubmit callback to update the UI
      await onSubmit(createData);

      // Reset form and close dialog
      form.reset();
      setCurrentStep(0);
      setValidationError(null);
      setCreationProgress("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create class:", error);

      // Show error toast with specific message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create class";
      toast.error("Failed to create class", {
        description: errorMessage,
      });

      setValidationError(`Failed to create class: ${errorMessage}`);
      setCreationProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    console.log("nextStep called - current step:", currentStep);

    if (currentStep < steps.length - 1) {
      try {
        setValidationError(null);

        // Validate current step before moving to next
        const stepFields = steps[currentStep].fields;
        console.log("Validating step", currentStep, "with fields:", stepFields);

        // Special handling for courses step
        if (currentStep === 2) {
          // Courses step
          const selectedCourses = form.getValues("selectedCourses");
          console.log("Selected courses:", selectedCourses);

          if (!selectedCourses || selectedCourses.length === 0) {
            setValidationError(
              "Please select at least one course to continue."
            );
            return;
          }
        }

        console.log("About to trigger form validation for fields:", stepFields);
        const isValid = await form.trigger(
          stepFields as (keyof CreateClassFormData)[]
        );

        console.log("Validation result:", isValid);
        console.log("Form errors:", form.formState.errors);
        console.log("Current form values:", form.getValues());
        console.log("Form is dirty:", form.formState.isDirty);
        console.log("Form is valid:", form.formState.isValid);

        if (isValid) {
          console.log(
            "Validation passed, moving to next step:",
            currentStep + 1
          );
          setCurrentStep(currentStep + 1);
        } else {
          console.log("Validation failed, staying on current step");
          // Get the first error message to display
          const firstError = Object.values(form.formState.errors)[0];
          if (firstError?.message) {
            setValidationError(firstError.message);
          }
        }
      } catch (error) {
        console.error("Error during step validation:", error);
        setValidationError("An unexpected error occurred. Please try again.");
      }
    } else {
      console.log("Already at last step, cannot go next");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (stepIndex: number) => {
    const stepFields = steps[stepIndex].fields;
    return stepFields.every((field) => {
      const fieldState = form.getFieldState(field as keyof CreateClassFormData);
      const fieldValue = form.getValues(field as keyof CreateClassFormData);

      // For selectedCourses, check if it has values
      if (field === "selectedCourses") {
        return (
          !fieldState.error &&
          Array.isArray(fieldValue) &&
          fieldValue.length > 0
        );
      }

      // For required fields, check if they have values
      if (field === "name" || field === "startDate" || field === "endDate") {
        return (
          !fieldState.error && fieldValue !== undefined && fieldValue !== ""
        );
      }

      // For optional fields, just check for errors
      return !fieldState.error;
    });
  };

  // Prevent dialog from closing when there are validation errors or loading states
  const handleOpenChange = (newOpen: boolean) => {
    console.log("Dialog open change requested:", {
      newOpen,
      isLoading,
      isLoadingCourses,
      validationError,
      currentStep,
      formErrors: Object.keys(form.formState.errors),
    });

    // If trying to close the dialog
    if (!newOpen) {
      // Don't close if we're loading
      if (isLoading || isLoadingCourses) {
        console.log("Preventing dialog close due to loading state");
        return;
      }

      // Don't close if there are validation errors
      if (validationError) {
        console.log(
          "Preventing dialog close due to validation error:",
          validationError
        );
        return;
      }

      // Don't close if we're in the middle of a step transition (not on first or last step)
      if (currentStep > 0 && currentStep < steps.length - 1) {
        console.log("Preventing dialog close during step transition");
        return;
      }

      // Don't close if there are form errors
      if (Object.keys(form.formState.errors).length > 0) {
        console.log(
          "Preventing dialog close due to form errors:",
          form.formState.errors
        );
        return;
      }
    }

    console.log("Allowing dialog to change state to:", newOpen);
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto scrollbar-hide p-0 bg-gradient-to-br from-background to-muted/20 border-border/50 backdrop-blur-sm"
        onPointerDownOutside={(e) => {
          console.log("Dialog pointer down outside");
          // Prevent closing on outside click during step transitions
          if (currentStep > 0 && currentStep < steps.length - 1) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          console.log("Dialog escape key pressed");
          // Prevent closing on escape during step transitions
          if (currentStep > 0 && currentStep < steps.length - 1) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-2xl" />

          <div className="relative z-10 p-6">
            <DialogHeader className="space-y-4 mb-6">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create New Class
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Set up a new class for your students. You can add courses and
                manage enrollment later.
              </DialogDescription>

              {/* Error Display */}
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50"
                >
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {validationError}
                  </p>
                </motion.div>
              )}

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <motion.div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                        index <= currentStep
                          ? "bg-gradient-to-r from-primary to-secondary border-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                      animate={{
                        scale: index === currentStep ? 1.1 : 1,
                      }}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "w-16 h-0.5 mx-2 transition-all duration-300",
                          index < currentStep
                            ? "bg-gradient-to-r from-primary to-secondary"
                            : "bg-muted-foreground/30"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step Info */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                      {React.createElement(steps[currentStep].icon, {
                        className: "h-5 w-5 text-primary",
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  console.log("Form submit event triggered");
                  console.log("Current step:", currentStep);
                  console.log(
                    "Is last step:",
                    currentStep === steps.length - 1
                  );

                  // Only allow submission on the last step
                  if (currentStep !== steps.length - 1) {
                    console.log(
                      "Preventing form submission - not on last step"
                    );
                    e.preventDefault();
                    return;
                  }

                  form.handleSubmit(handleSubmit)(e);
                }}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Step 0: Basic Information */}
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Class Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Advanced Web Development"
                                  className="h-12 bg-background/50 backdrop-blur-sm border-border/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe what students will learn in this class..."
                                  className="resize-none h-24 bg-background/50 backdrop-blur-sm border-border/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Help students understand what they'll gain from
                                this class
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 1: Schedule */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-3">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-primary" />
                                  Start Date *
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "h-12 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 hover:border-primary/50 transition-all duration-200",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                                        {field.value ? (
                                          <span className="text-foreground font-medium">
                                            {format(field.value, "PPP")}
                                          </span>
                                        ) : (
                                          <span>Select start date</span>
                                        )}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="rounded-md"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-3">
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-secondary" />
                                  End Date *
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "h-12 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 hover:border-secondary/50 transition-all duration-200",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-3 h-4 w-4 text-secondary" />
                                        {field.value ? (
                                          <span className="text-foreground font-medium">
                                            {format(field.value, "PPP")}
                                          </span>
                                        ) : (
                                          <span>Select end date</span>
                                        )}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="rounded-md"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Date Range Preview */}
                        {form.watch("startDate") && form.watch("endDate") && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <Card className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                      Class Duration
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                      {Math.ceil(
                                        (form.watch("endDate").getTime() -
                                          form.watch("startDate").getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      )}{" "}
                                      days •{" "}
                                      {format(form.watch("startDate"), "MMM d")}{" "}
                                      -{" "}
                                      {format(
                                        form.watch("endDate"),
                                        "MMM d, yyyy"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                  Class Duration
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Students will have access to class materials
                                  and assignments during this period. You can
                                  extend the duration later if needed.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Step 2: Courses */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="selectedCourses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Select Courses *
                              </FormLabel>
                              <FormDescription>
                                Choose the courses that will be included in this
                                class. At least one course is required.
                              </FormDescription>
                              <FormControl>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                  {isLoadingCourses ? (
                                    <div className="flex items-center justify-center py-8">
                                      <Loader2 className="h-6 w-6 animate-spin" />
                                      <span className="ml-2">
                                        Loading courses...
                                      </span>
                                    </div>
                                  ) : courses.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                      <GraduationCap className="h-8 w-8 mx-auto mb-2" />
                                      <p>No courses available</p>
                                    </div>
                                  ) : (
                                    <>
                                      {courses.map((course) => (
                                        <div
                                          key={course._id}
                                          className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
                                        >
                                          <Checkbox
                                            checked={
                                              field.value?.includes(
                                                course._id
                                              ) || false
                                            }
                                            onCheckedChange={(checked) => {
                                              try {
                                                const currentValue =
                                                  field.value || [];
                                                console.log(
                                                  "Checkbox changed:",
                                                  {
                                                    courseId: course._id,
                                                    checked,
                                                    currentValue,
                                                  }
                                                );

                                                if (checked) {
                                                  const newValue = [
                                                    ...currentValue,
                                                    course._id,
                                                  ];
                                                  console.log(
                                                    "Setting new value:",
                                                    newValue
                                                  );
                                                  field.onChange(newValue);
                                                } else {
                                                  const newValue =
                                                    currentValue.filter(
                                                      (id) => id !== course._id
                                                    );
                                                  console.log(
                                                    "Setting new value:",
                                                    newValue
                                                  );
                                                  field.onChange(newValue);
                                                }

                                                // Clear any validation errors when user makes a selection
                                                setValidationError(null);
                                              } catch (error) {
                                                console.error(
                                                  "Error updating course selection:",
                                                  error
                                                );
                                                setValidationError(
                                                  "Failed to update course selection. Please try again."
                                                );
                                              }
                                            }}
                                          />
                                          <div className="flex-1">
                                            <h4 className="font-medium text-sm">
                                              {course.courseTitle}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                              {course.courseDescription?.substring(
                                                0,
                                                100
                                              )}
                                              {course.courseDescription &&
                                                course.courseDescription
                                                  .length > 100 &&
                                                "..."}
                                            </p>
                                          </div>
                                        </div>
                                      ))}

                                      {/* Warning when no courses are selected */}
                                      {courses.length > 0 &&
                                        (!field.value ||
                                          field.value.length === 0) && (
                                          <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50/50 dark:border-yellow-800/50 dark:bg-yellow-950/20">
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                              ⚠️ Please select at least one
                                              course to continue.
                                            </p>
                                          </div>
                                        )}
                                    </>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("selectedCourses")?.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <Card className="bg-gradient-to-r from-green-50/80 to-green-100/80 dark:from-green-950/30 dark:to-green-900/30 border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-green-500/20">
                                    <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                      {form.watch("selectedCourses")?.length}{" "}
                                      Course
                                      {form.watch("selectedCourses")?.length !==
                                      1
                                        ? "s"
                                        : ""}{" "}
                                      Selected
                                    </p>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                      Students will have access to all selected
                                      courses
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Settings */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="maxStudents"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Maximum Students
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 30"
                                  className="h-12 bg-background/50 backdrop-blur-sm border-border/50"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number.parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty for unlimited enrollment
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="allowSelfEnrollment"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base font-medium">
                                    Allow Self-Enrollment
                                  </FormLabel>
                                  <FormDescription>
                                    Students can join this class without
                                    approval
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="requireApproval"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base font-medium">
                                    Require Approval
                                  </FormLabel>
                                  <FormDescription>
                                    Manually approve student enrollment requests
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {isLoading ? (
                          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Loader2 className="h-5 w-5 text-blue-500 mt-0.5 animate-spin" />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Creating Your Class
                                  </p>
                                  <p className="text-sm text-blue-700 dark:text-blue-300">
                                    {creationProgress || "Please wait..."}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                    Ready to Create
                                  </p>
                                  <p className="text-sm text-green-700 dark:text-green-300">
                                    Your class is configured and ready to be
                                    created. You can modify these settings
                                    later.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border/50">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isLoading}
                      className="bg-background/50 backdrop-blur-sm border-border/50"
                    >
                      Cancel
                    </Button>
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isLoading}
                        className="bg-background/50 backdrop-blur-sm border-border/50"
                      >
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Next Step button clicked");
                          nextStep();
                        }}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Class...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Class
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
