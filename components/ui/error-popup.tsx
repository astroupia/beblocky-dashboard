"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorPopupProps {
  error: {
    message: string;
    error: string;
    statusCode: number;
  } | null;
  onClose: () => void;
  onRetry?: () => void;
}

export function ErrorPopup({ error, onClose, onRetry }: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Close after animation
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.statusCode) {
      case 400:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 404:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 403:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getErrorColor = () => {
    switch (error.statusCode) {
      case 400:
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20";
      case 404:
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case 403:
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
    }
  };

  const getErrorTitle = () => {
    switch (error.statusCode) {
      case 400:
        return "Validation Error";
      case 404:
        return "Not Found";
      case 403:
        return "Access Denied";
      default:
        return "Error";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className={cn(
              "p-4 rounded-lg border shadow-lg backdrop-blur-sm",
              getErrorColor()
            )}
          >
            <div className="flex items-start gap-3">
              {getErrorIcon()}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  {getErrorTitle()}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {error.message}
                </p>
                <div className="flex gap-2">
                  {onRetry && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => {
                          onRetry();
                          onClose();
                        }, 300);
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(onClose, 300);
                    }}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
