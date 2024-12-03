"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/lib/error-toast";
import { auth } from "@/lib/firebase/firebase-auth";
import { SignInSchema, signInSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRedirectResult, signInWithEmailAndPassword } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  async function login(data: SignInSchema) {
    setIsLoading(true);
    let { email, password } = data;
    if (!email.includes("@")) {
      email = `${email}@beblocky.com`;
    }

    try {
      // Authenticate user via Firebase
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const idToken = await userCred.user.getIdToken();

      // Call the backend API for session management
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        toast({ title: "Login successful", description: "Redirecting..." });
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);

        toast({
          title: "Login failed",
          description: errorData.error || "An unexpected error occurred.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Login Error:", error);

      toast({
        title: "Login Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(login, errorToast)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Email" className="h-10" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Password"
                    className="h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-lg"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
