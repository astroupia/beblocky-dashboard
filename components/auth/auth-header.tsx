"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import logo from "@/lib/images/logo.png";

interface AuthHeaderProps {
  mode: "signin" | "signup";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image src={logo} alt="Beblocky Logo" width={180} height={180} />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={mode === "signin" ? "/sign-up" : "/sign-in"}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden group hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {theme === "light" ? (
              <Moon className="h-5 w-5 transition-transform group-hover:rotate-12 duration-300" />
            ) : (
              <Sun className="h-5 w-5 transition-transform group-hover:rotate-12 duration-300" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
