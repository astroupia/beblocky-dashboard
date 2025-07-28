"use client";

import type React from "react";

import { motion } from "framer-motion";
import { AuthSidebar } from "./auth-sidebar";
import { AuthHeader } from "./auth-header";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "signin" | "signup";
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      suppressHydrationWarning
    >
      {/* Left sidebar with features and testimonial */}
      <AuthSidebar mode={mode} />

      {/* Main content */}
      <motion.main
        className="flex-1 flex flex-col min-h-screen"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AuthHeader mode={mode} />

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </motion.main>
    </div>
  );
}
