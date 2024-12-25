import React from "react";
import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

const page = () => {
  return (
    <AuthLayout mode="signin">
      <div className="w-full">
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <h2 className="text-center text-2xl font-bold mb-6">
            Continue Your Journey
          </h2>
          <SignIn></SignIn>
        </div>
      </div>
    </AuthLayout>
  );
};

export default page;
