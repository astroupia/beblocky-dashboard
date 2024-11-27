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
import Link from "next/link";
import { sendVerificationEmail, handleForgotPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }
    });
  }, []);

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
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!userCred.user.emailVerified) {
        setIsLoading(false);
        const result = await sendVerificationEmail(email);
        if (result.success) {
          toast({
            title: "Please verify your email",
            description: "A new verification link has been sent to your inbox",
          });
        } else {
          toast({
            title: "User Not Found",
            description:
              "Check your Email whether or not you have verified your email",
            variant: "destructive",
          });
        }
        return;
      }

      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCred.user.getIdToken()}`,
        },
      });

      if (response.status === 200) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        toast({
          title: "Session expired",
          description: errorData.error || "Please log in again.",
          variant: "destructive",
        });
        // Optionally redirect to sign-in page
        router.push("/sign-in");
      }
    } catch (e: any) {
      toast({
        title:
          e?.message ?? "Error happened while signing in, Please try again!",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  const handleForgotPasswordClick = async () => {
    if (!resetEmail) {
      toast({
        title: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const result = await handleForgotPassword(resetEmail);
      if (result.success) {
        toast({
          title: "Password reset email sent",
          description: "Please check your inbox for further instructions",
        });
        setShowResetForm(false);
      } else {
        toast({
          title: "Error sending reset email",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <div>
      {!showResetForm ? (
        <>
          <Form {...form}>
            <form
              className=" space-y-4"
              onSubmit={form.handleSubmit(login, errorToast)}
            >
              <FormField
                control={form.control}
                name="email"
                render={(field) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field.field}
                        placeholder="username/email"
                        className=" h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={(field) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field.field}
                        placeholder="Password"
                        className="h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className=" w-full text-lg"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Login"}
              </Button>
            </form>
          </Form>
          <button
            onClick={() => setShowResetForm(true)}
            className="text-center text-orange-900 mt-4 text-sm font-semibold cursor-pointer hover:underline transition-all duration-300 w-full"
          >
            Forgot Password?
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reset Password</h2>
          <Input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="h-10"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleForgotPasswordClick}
              className="w-full"
              disabled={isResetting}
            >
              {isResetting ? <Loading /> : "Send Reset Link"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResetForm(false)}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
