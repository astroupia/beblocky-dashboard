"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { teacherApi } from "@/lib/api/teacher";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import type { IUser } from "@/types/user";

export default function SignUpPage() {
  const router = useRouter();
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (session.data?.user) {
      console.log("User already authenticated, redirecting to /courses");
      window.location.href = "/courses";
    }
  }, [session.data]);

  // Show loading while checking authentication status
  if (session.isPending) {
    return (
      <AuthLayout mode="signup">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </AuthLayout>
    );
  }

  // Don't render the form if already authenticated
  if (session.data?.user) {
    return (
      <AuthLayout mode="signup">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </AuthLayout>
    );
  }

  const createTeacherProfile = async (userId: string) => {
    setIsCreatingProfile(true);
    try {
      console.log("Creating teacher profile for userId:", userId);

      // Get user data to pass to the API - with retry logic
      let userData: IUser | null = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          userData = await userApi.getUserByEmail(formData.email);
          console.log("Retrieved user data for teacher creation:", userData);
          console.log("User data structure:", {
            _id: userData._id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
          });
          break;
        } catch (error) {
          retryCount++;
          console.log(
            `Failed to get user data, attempt ${retryCount}/${maxRetries}:`,
            error
          );
          if (retryCount < maxRetries) {
            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          } else {
            throw new Error(
              "Failed to retrieve user data after multiple attempts"
            );
          }
        }
      }

      // Ensure userData is defined before proceeding
      if (!userData) {
        throw new Error("User data not available");
      }

      // Create teacher profile using the /teachers/from-user endpoint
      const teacherResult = await teacherApi.createTeacherFromUser(
        userId,
        userData
      );
      console.log("Teacher creation API response:", teacherResult);

      toast.success("Teacher profile created successfully!");
    } catch (error) {
      console.error("Failed to create teacher profile:", error);

      // Provide specific error messages based on the error type
      if (error instanceof Error) {
        if (
          error.message.includes("500") ||
          error.message.includes("Internal server error")
        ) {
          toast.warning(
            "Account created successfully! Teacher profile setup is temporarily unavailable. You can complete this later from your profile settings."
          );
        } else if (error.message.includes("404")) {
          toast.warning(
            "Account created successfully! Teacher profile setup failed - please contact support."
          );
        } else {
          toast.warning(
            "Account created successfully! Teacher profile setup failed. You can complete this later."
          );
        }
      } else {
        toast.warning(
          "Account created successfully! Teacher profile setup failed. You can complete this later."
        );
      }

      // Don't throw error here - user registration was successful
      // Just log it and continue
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting sign-up process for email:", formData.email);

      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      console.log("Sign-up result:", result);

      if ("error" in result && result.error?.message) {
        throw new Error(result.error.message);
      }

      // If signup was successful and we have a user ID, create teacher profile
      // The user data is nested in result.data.user
      if (
        "data" in result &&
        result.data?.user &&
        typeof result.data.user === "object" &&
        "id" in result.data.user
      ) {
        console.log("User created successfully, creating teacher profile...");
        console.log("User object:", result.data.user);

        // Add a small delay to ensure user data is saved in database
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await createTeacherProfile(result.data.user.id as string);
      } else {
        console.log(
          "No user ID found in result, skipping teacher profile creation"
        );
        console.log("Result structure:", Object.keys(result || {}));
        if ("data" in result && result.data) {
          console.log("Data structure:", Object.keys(result.data));
        }
      }

      toast.success("Account created successfully! Welcome to the platform.");

      // Use window.location.href for more reliable redirects in deployed environments
      window.location.href = "/courses";

      // Fallback: if window.location.href doesn't work, try router.push
      setTimeout(() => {
        if (window.location.pathname !== "/courses") {
          router.push("/courses");
        }
      }, 1000);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      // For social auth, we just need to redirect to the auth endpoint
      window.location.href = "/api/auth/github";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign up with GitHub"
      );
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="signup">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Create your account
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Join thousands of educators and learners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {/* GitHub Sign Up */}
            <Button
              onClick={handleGithubSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white border-slate-900 hover:border-slate-800 transition-all duration-300"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pr-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pr-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-600 dark:text-slate-300"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isCreatingProfile}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : isCreatingProfile ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Setting up teacher profile...
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
