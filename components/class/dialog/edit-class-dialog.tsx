"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Save,
  X,
  Settings,
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { IClass } from "@/types/class";
import { toast } from "sonner";

interface ModernEditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass;
  onSave: (updatedClass: Partial<IClass>) => void;
}

export function ModernEditClassDialog({
  open,
  onOpenChange,
  classData,
  onSave,
}: ModernEditClassDialogProps) {
  // Helper function to safely parse dates
  const safeParseDate = (dateValue: any): Date | undefined => {
    if (!dateValue) return undefined;
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  // Helper function to safely format dates
  const safeFormatDate = (dateValue: any, formatString: string): string => {
    try {
      const date = safeParseDate(dateValue);
      return date ? format(date, formatString) : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const [formData, setFormData] = useState({
    name: classData.name || classData.className || "",
    description: classData.description || "",
    startDate: safeParseDate(classData.startDate) || new Date(),
    endDate:
      safeParseDate(classData.endDate) ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: classData.status || "Active",
    settings: {
      allowStudentEnrollment:
        classData.settings?.allowStudentEnrollment || false,
      requireApproval: classData.settings?.requireApproval || false,
      autoProgress: classData.settings?.autoProgress || false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare the update data with proper structure
      const updateData = {
        name: formData.name, // Keep name for frontend compatibility
        className: formData.name, // Use className for API
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        settings: formData.settings,
      };

      console.log("Edit dialog sending update data:", updateData);

      // Call the parent's onSave callback
      await onSave(updateData);

      // Don't close the dialog here - let the parent handle it after successful API call
    } catch (error) {
      console.error("Failed to update class in dialog:", error);
      toast.error("Failed to update class. Please try again.");
      // Don't close dialog on error
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const days = Math.ceil(
        (formData.endDate.getTime() - formData.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return days > 0 ? `${days} days` : "Invalid date range";
    }
    return "Select dates";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/50 scrollbar-hide">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Edit Class
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update class details and settings
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter class name"
                  className={cn(
                    "h-12 bg-background/50 backdrop-blur-sm border-border/50",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter class description"
                  rows={3}
                  className="bg-background/50 backdrop-blur-sm border-border/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor("Active")}>
                          Active
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="Draft">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor("Draft")}>Draft</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="Completed">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor("Completed")}>
                          Completed
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="Archived">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor("Archived")}>
                          Archived
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <h3 className="text-lg font-medium">Schedule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/50",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        date && setFormData({ ...formData, startDate: date })
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/50",
                        !formData.endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-4 w-4 text-secondary" />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        date && setFormData({ ...formData, endDate: date })
                      }
                      disabled={(date) => date <= formData.startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.endDate}
                  </motion.p>
                )}
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border/50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{calculateDuration()}</span>
                </div>
              </motion.div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <h3 className="text-lg font-medium">Class Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">
                      Allow Student Enrollment
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Students can enroll themselves in the class
                    </p>
                  </div>
                  <Switch
                    checked={formData.settings.allowStudentEnrollment}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          allowStudentEnrollment: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">
                      Require Approval
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Require approval for student enrollment
                    </p>
                  </div>
                  <Switch
                    checked={formData.settings.requireApproval}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          requireApproval: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Auto Progress</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically progress students through lessons
                    </p>
                  </div>
                  <Switch
                    checked={formData.settings.autoProgress}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          autoProgress: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Last updated: {safeFormatDate(classData.updatedAt, "PPP")}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
