"use client";

import { motion } from "framer-motion";
import { BookOpen, Shield, Zap } from "lucide-react";
import { AuthFeature } from "./auth-feature";
import Image from "next/image";
import authContent from "@/lib/images/auth-content.jpg";

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

        <div className="space-y-8 mb-12">
          <AuthFeature
            icon={BookOpen}
            title="Course Management"
            description="Create and manage interactive courses with our intuitive tools"
            delay={0.3}
          />
          <AuthFeature
            icon={Zap}
            title="Real-time Analytics"
            description="Track student progress and course performance in real-time"
            delay={0.5}
          />
        </div>

        {/* New Image Section */}
        <motion.div
          className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Image
            src={authContent}
            alt="Learning platform illustration"
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent flex items-end p-6">
            <h2 className="text-white text-2xl font-bold drop-shadow-lg">
              Make Coding Fun for Every Kid
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              "This platform has completely transformed how we deliver
              education. The course creation tools are incredible."
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
        </motion.div>
      </div>
    </motion.div>
  );
}
