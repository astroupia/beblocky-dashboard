"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "next-auth/react";
import { Bell } from "lucide-react";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userName}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-accent relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        <ThemeToggle />
        <button
          onClick={() => signOut()}
          className="bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}