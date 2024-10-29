"use server";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase/firebase-auth";
import { sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";

export async function sendVerificationEmail(email: string) {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "User Not Found",
        description:
          "Check your Email whether or not you have verified your email",
      });
      return { success: false, error: "User not found" };
    }

    await sendEmailVerification(user);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send verification email",
    };
  }
}

export async function handleForgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send reset email",
    };
  }
}
