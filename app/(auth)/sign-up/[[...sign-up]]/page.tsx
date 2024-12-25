import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <AuthLayout mode="signup">
      <div className="w-full">
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <h2 className="text-center text-2xl font-bold mb-6">
            Start Your Journey
          </h2>
          <SignUp />
        </div>
      </div>
    </AuthLayout>
  );
};

export default page;
