"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Trash2, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface ModernDeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  itemToDelete: any
  itemType: "course" | "lesson" | "slide"
  onConfirm: () => void
}

export function ModernDeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  itemToDelete,
  itemType,
  onConfirm,
}: ModernDeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const isConfirmationValid =
    itemToDelete?.lessonTitle === confirmationText ||
    itemToDelete?.courseTitle === confirmationText ||
    itemToDelete?.title === confirmationText

  const getItemName = () => {
    return itemToDelete?.lessonTitle || itemToDelete?.courseTitle || itemToDelete?.title || ""
  }

  const handleConfirm = async () => {
    if (isConfirmationValid) {
      setIsDeleting(true)
      // Simulate deletion delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onConfirm()
      setConfirmationText("")
      setIsDeleting(false)
    }
  }

  const getWarningContent = () => {
    switch (itemType) {
      case "course":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          warning: "This will permanently delete the course and all associated lessons and slides.",
          consequences: [
            "All student progress will be lost",
            "Course materials will be permanently removed",
            "This action cannot be undone",
          ],
        }
      case "lesson":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          warning: "This will permanently delete the lesson and all associated slides.",
          consequences: [
            "Student progress in this lesson will be lost",
            "All slides will be permanently removed",
            "This action cannot be undone",
          ],
        }
      case "slide":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          warning: "This will permanently delete the slide.",
          consequences: ["Slide content will be permanently removed", "This action cannot be undone"],
        }
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          warning: "This action cannot be undone.",
          consequences: [],
        }
    }
  }

  const warningContent = getWarningContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-red-100/50 dark:from-red-950/20 dark:to-red-900/20"></div>

        <DialogHeader className="relative z-10 text-center pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="mx-auto mb-4"
          >
            {warningContent.icon}
          </motion.div>

          <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">{title}</DialogTitle>

          <p className="text-muted-foreground mt-2">{warningContent.warning}</p>
        </DialogHeader>

        <div className="relative z-10 space-y-6">
          {/* Warning Box */}
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-red-800 dark:text-red-200">Consequences of this action:</h4>
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  {warningContent.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label htmlFor="confirmationText" className="text-sm font-medium">
              To confirm deletion, type{" "}
              <span className="font-bold text-red-600 dark:text-red-400">{getItemName()}</span>
            </Label>
            <Input
              id="confirmationText"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type ${itemType} name to confirm`}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmationValid || isDeleting}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isDeleting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {itemType}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
