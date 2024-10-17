"use client";

import * as React from "react";

import {
  Dialog,
  DialogTrigger,
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
      // Check for classroom.userId only
      toast({ title: "Classroom not found!", variant: "destructive" });
      return;
    }

    // Get the current user's email using Firebase authentication
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user
    if (!user) {
      toast({ title: "User not authenticated!", variant: "destructive" });
      return;
    }

    // Fetch the user details using the email from the Firebase user
    const userResponse = await getUserByEmail(user.email!, data.classCode); // {{ edit_1 }}: Pass the classCode to getUserByEmail
    if ("error" in userResponse) {
      toast({ title: userResponse.error, variant: "destructive" });
      return;
    }

    // Ensure userResponse.data is not null before accessing its properties
    if (!userResponse.data) {
      toast({ title: "User data not found!", variant: "destructive" });
      return;
    }

    const studentId = userResponse.data.uid; // Assuming uid is the studentId
    const parentId = classroom.userId; // The parentId is the userId from the classroom
    await createStudent({
      // Call createStudent to update the student record
      parentId,
      classroom: data.classCode, // Use the entered class code as the classId
      studentId,
      studentName: userResponse.data.displayName || "", // Provide a default value if displayName is null
      studentEmail: userResponse.data.email || "", // Provide a default value if email is null
      studentUsername: "", // Set to an empty string or provide a default value
    });

    toast({ title: "Class code accepted!", variant: "default" });
    onClose(); // Call onClose immediately after the toast
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Enter Class Code</Button>
      </DialogTrigger>

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
