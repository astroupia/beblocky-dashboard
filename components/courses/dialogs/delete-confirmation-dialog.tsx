"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  itemToDelete: any;
  itemType: "course" | "lesson" | "slide";
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  itemToDelete,
  itemType,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmationValid = itemToDelete?.title === confirmationText;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
      setConfirmationText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Please type{" "}
            <strong>{itemToDelete?.title}</strong> to confirm.
          </p>

          <div>
            <Label htmlFor="confirmationText">Confirmation</Label>
            <Input
              id="confirmationText"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type ${itemType} title to confirm`}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid}
          >
            Delete {itemType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
