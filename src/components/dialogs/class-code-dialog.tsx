"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { getClassroom } from "@/actions/classroom"; // Import the getClassroom function
import { useState } from "react";
import { getUserByEmail } from "@/actions/student"; // Import the function to get user by email
import { getAuth } from "firebase/auth"; // Import Firebase authentication
import { createStudent } from "@/actions/student"; // Ensure this import is correct

interface ClassCodeDialogProps {
  isOpen: boolean;

  onClose: () => void;
}

export function ClassCodeDialog({ isOpen, onClose }: ClassCodeDialogProps) {
  const form = useForm<{ classCode: string }>();

  const onSubmit = async (data: { classCode: string }) => {
    const classroom = await getClassroom(data.classCode);
    if (!classroom || !classroom.userId) {
      toast({ title: "Classroom not found!", variant: "destructive" });
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast({ title: "User not authenticated!", variant: "destructive" });
      return;
    }

    const userResponse = await getUserByEmail(user.email!, data.classCode); // {{ edit_1 }}
    if ("error" in userResponse) {
      toast({ title: userResponse.error, variant: "destructive" });
      return;
    }

    if (!userResponse.data) {
      toast({ title: "User data not found!", variant: "destructive" });
      return;
    }

    const studentId = userResponse.data.uid;
    const parentId = classroom.userId;
    await createStudent({
      parentId,
      classroom: data.classCode,
      studentId,
      studentName: userResponse.data.displayName || "",
      studentEmail: userResponse.data.email || "",
      studentUsername: "",
    });

    toast({ title: "Class code accepted!", variant: "default" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Enter Class Code</DialogTitle>
          <DialogDescription className="mb-4">
            Please enter your class code to associate with your parent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input {...form.register("classCode")} placeholder="Class Code" />
          <DialogFooter className="mt-4">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => onClose()}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
