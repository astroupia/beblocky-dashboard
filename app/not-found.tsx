"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  BookOpen,
  Users,
  ArrowLeft,
  Compass,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const popularPages = [
  {
    title: "Dashboard",
    description: "View your learning progress and stats",
    href: "/",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Courses",
    description: "Browse and manage your courses",
    href: "/courses",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Classes",
    description: "Manage your classes and students",
    href: "/classes",
    icon: Users,
    color: "from-green-500 to-emerald-500",
  },
];

const quickActions = [
  { label: "Create Course", href: "/courses?create=true", icon: BookOpen },
  { label: "Join Class", href: "/classes?join=true", icon: Users },
  { label: "Browse Library", href: "/library", icon: Compass },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to search results or courses page with query
    router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          {/* 404 Hero Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative"
            >
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                404
              </div>
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-6 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The page you're looking for seems to have wandered off into the
                digital void. Don't worry, we'll help you find your way back to
                learning!
              </p>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Search className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      Search for Content
                    </h2>
                  </div>
                  <form
                    onSubmit={handleSearch}
                    className="flex gap-3 max-w-md mx-auto"
                  >
                    <Input
                      placeholder="Search courses, classes, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 px-6 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300"
                  >
                    <Link
                      href={action.href}
                      className="flex items-center gap-2"
                    >
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Popular Pages */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Popular Destinations</h2>
              <p className="text-muted-foreground">
                Here are some places you might want to explore
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {popularPages.map((page, index) => (
                <motion.div
                  key={page.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link href={page.href}>
                    <Card className="h-full backdrop-blur-sm bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 overflow-hidden">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${page.color} text-white`}
                          >
                            <page.icon className="h-6 w-6" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {page.description}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Explore now</span>
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div variants={itemVariants} className="pt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Back to Dashboard
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            variants={itemVariants}
            className="pt-8 border-t border-border/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">
                  Students Learning
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Courses Available
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-500">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-500">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
