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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, X, AlertTriangle } from "lucide-react";
import type { IClass } from "@/types/class";
import { classApi } from "@/lib/api/class";
import { userApi } from "@/lib/api/user";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { ErrorPopup } from "@/components/ui/error-popup";

interface ModernClassSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass;
  onSave: (settings: any) => void;
}

export function ModernClassSettingsDialog({
  open,
  onOpenChange,
  classData,
  onSave,
}: ModernClassSettingsDialogProps) {
  const session = useSession();
  const [settings, setSettings] = useState({
    // IClassSettings properties only
    allowStudentEnrollment: classData.settings?.allowStudentEnrollment || false,
    requireApproval: classData.settings?.requireApproval || false,
    autoProgress: classData.settings?.autoProgress || false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    error: string;
    statusCode: number;
  } | null>(null);

  const handleSave = async () => {
    if (!session.data?.user?.email) return;

    setIsLoading(true);
    setError(null);

    try {
      const userData = await userApi.getUserByEmail(session.data.user.email);

      // Update class settings using the updateSettings API
      const result = await classApi.updateSettings(
        classData._id!,
        settings,
        userData
      );

      if (result.success && result.data) {
        // Success - call parent's onSave callback
        onSave(settings);
        onOpenChange(false);
        toast.success("Class settings updated successfully!");
      } else if (result.error) {
        // Show error popup
        setError(result.error);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setError({
        message: "Failed to save settings. Please try again.",
        error: "Internal Error",
        statusCode: 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/50">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Settings className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Class Settings
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {classData.name || classData.className}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              General Settings
            </h3>

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
                  checked={settings.allowStudentEnrollment}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      allowStudentEnrollment: checked,
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
                    Manually approve new student requests
                  </p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireApproval: checked })
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
                  checked={settings.autoProgress}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoProgress: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
                  Save Settings
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </DialogContent>

      {/* Error Popup */}
      <ErrorPopup
        error={error}
        onClose={() => setError(null)}
        onRetry={handleSave}
      />
    </Dialog>
  );
}
