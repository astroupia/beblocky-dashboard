"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Download,
  Smartphone,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface AppShowcaseProps {
  mode: "signin" | "signup";
}

export function AuthAppShowcase({ mode }: AppShowcaseProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const appStats = [
    { icon: Download, label: "Downloads", value: "50K+" },
    { icon: Star, label: "Rating", value: "4.8" },
    { icon: Users, label: "Active Users", value: "25K+" },
  ];

  const handlePlayStoreClick = () => {
    // Replace with your actual Play Store URL
    window.open(
      "https://play.google.com/store/apps/details?id=com.beblocky.beblocky&hl=en",
      "_blank"
    );
  };

  if (!isMounted) {
    return (
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12">
        <div className="relative h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                  EduPlatform Mobile
                </h2>
                <p className="text-white/90 text-sm drop-shadow">
                  Learn anywhere, anytime
                </p>
              </div>
            </div>
            <p className="text-white/90 text-sm mb-6 drop-shadow max-w-md">
              {mode === "signin"
                ? "Continue your learning journey on mobile. Access all your courses, track progress, and stay connected with your students."
                : "Download our mobile app and take your education platform with you. Perfect for on-the-go learning and teaching."}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handlePlayStoreClick}
                className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-lg backdrop-blur-sm font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get on Play Store
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
              >
                <Star className="h-4 w-4 mr-2" />
                Rate App
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background with animated gradient */}
      <div className="relative h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30"
          animate={{
            background: [
              "linear-gradient(to bottom right, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.3))",
              "linear-gradient(to bottom right, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.3))",
              "linear-gradient(to bottom right, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Main content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="h-12 w-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Smartphone className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                  EduPlatform Mobile
                </h2>
                <p className="text-white/90 text-sm drop-shadow">
                  Learn anywhere, anytime
                </p>
              </div>
            </div>

            <p className="text-white/90 text-sm mb-6 drop-shadow max-w-md">
              {mode === "signin"
                ? "Continue your learning journey on mobile. Access all your courses, track progress, and stay connected with your students."
                : "Download our mobile app and take your education platform with you. Perfect for on-the-go learning and teaching."}
            </p>

            {/* Interactive buttons */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handlePlayStoreClick}
                  className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-lg backdrop-blur-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get on Play Store
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate App
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 border-2 border-white/20 rounded-lg"
              style={{
                left: `${10 + i * 25}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />
    </motion.div>
  );
}
