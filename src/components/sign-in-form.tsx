"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { handleForgotPassword } from "@/actions/auth";
import { toast } from "./ui/use-toast";
import { Icons } from "./icons";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPasswordClick = async () => {
    if (!email) {
      toast({
        title: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    try {
      const result = await handleForgotPassword(email);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Reset email sent!",
        description: "Please check your email to reset your password",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          className="h-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* <Button className="w-full text-lg" size="lg" disabled={loading}>
          {loading ? <Icons.Progress className="animate-spin" /> : "Login"}
        </Button> */}
      </div>
      <Button
        variant="link"
        className="w-full mt-4"
        onClick={handleForgotPasswordClick}
        disabled={resetLoading}
      >
        {resetLoading ? (
          <Icons.Progress className="animate-spin" />
        ) : (
          "Forgot Password?"
        )}
      </Button>
    </div>
  );
};
