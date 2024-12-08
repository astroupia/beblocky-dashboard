"use client";

import { Button } from "@/components/ui/button";
import { Users, School, BookOpen, CreditCard, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo.png";

interface SidebarProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Sidebar({ theme, toggleTheme }: SidebarProps) {
  return (
    <div className="hidden w-64 bg-white dark:bg-gray-800 shadow-md lg:block">
      <div className="flex h-16 items-center justify-between px-4">
        <Image src={Logo} alt="Beblocky logo" className="p-4 h-28 w-52" />
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="space-y-2 p-4">
        <a
          href="#"
          className="flex items-center space-x-2 rounded-lg bg-[#892FFF] px-4 py-2 text-white"
        >
          <Users className="h-5 w-5" />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#892FFF] hover:bg-opacity-10 hover:text-[#892FFF] dark:hover:text-white"
        >
          <School className="h-5 w-5" />
          <span>Schools</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#892FFF] hover:bg-opacity-10 hover:text-[#892FFF] dark:hover:text-white"
        >
          <BookOpen className="h-5 w-5" />
          <span>Courses</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#892FFF] hover:bg-opacity-10 hover:text-[#892FFF] dark:hover:text-white"
        >
          <CreditCard className="h-5 w-5" />
          <span>Subscriptions</span>
        </a>
      </nav>
    </div>
  );
}
