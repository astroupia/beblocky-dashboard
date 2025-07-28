"use client";

import { motion } from "framer-motion";
import { BookOpen, Shield, Zap } from "lucide-react";
import { AuthFeature } from "./auth-feature";
import { AuthAppShowcase } from "./auth-app-showcase";
import { AuthTestimonial } from "./auth-testimonial";
import { useState, useEffect } from "react";

interface AuthSidebarProps {
  mode: "signin" | "signup";
}

export function AuthSidebar({ mode }: AuthSidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 backdrop-blur-lg p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
              {mode === "signin" ? "Welcome back!" : "Join our community"}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {mode === "signin"
                ? "Sign in to access your dashboard and continue your learning journey with our award-winning platform."
                : "Create an account to get started with our educational platform and join thousands of successful learners."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 backdrop-blur-lg p-12 flex-col justify-between relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {mode === "signin" ? "Welcome back!" : "Join our community"}
          </motion.h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {mode === "signin"
              ? "Sign in to access your dashboard and continue your learning journey with our award-winning platform."
              : "Create an account to get started with our educational platform and join thousands of successful learners."}
          </p>
        </motion.div>

        {/* App Showcase Section */}
        <AuthAppShowcase mode={mode} />

        {/* Testimonial Section */}
        <AuthTestimonial mode={mode} />
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
    </motion.div>
  );
}
