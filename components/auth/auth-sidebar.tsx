"use client";

import { motion } from "framer-motion";
import { BookOpen, Shield, Zap } from "lucide-react";
import { AuthFeature } from "./auth-feature";

interface AuthSidebarProps {
  mode: "signin" | "signup";
}

export function AuthSidebar({ mode }: AuthSidebarProps) {
  return (
    <motion.div
      className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 backdrop-blur-lg p-12 flex-col justify-between relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
            {mode === "signin" ? "Welcome back!" : "Join our community"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {mode === "signin"
              ? "Sign in to access your dashboard and continue your learning journey."
              : "Create an account to get started with our educational platform."}
          </p>
        </motion.div>

        <div className="space-y-8">
          <AuthFeature
            icon={BookOpen}
            title="Course Management"
            description="Create and manage interactive courses with our intuitive tools"
            delay={0.3}
          />
          <AuthFeature
            icon={Shield}
            title="Enterprise Security"
            description="Your data is protected with enterprise-grade security measures"
            delay={0.4}
          />
          <AuthFeature
            icon={Zap}
            title="Real-time Analytics"
            description="Track student progress and course performance in real-time"
            delay={0.5}
          />
        </div>
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg mb-6">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            "This platform has completely transformed how we deliver education.
            The course creation tools are incredible."
          </p>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">SJ</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Sarah Johnson
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Education Director
              </p>
            </div>
          </div>
        </div>
        <img
          src="/auth-content.png"
          alt="Auth Content Illustration"
          className="w-full max-w-xs mx-auto rounded-xl shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
}
