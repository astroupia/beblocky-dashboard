"use client";

import { Button } from "@/components/ui/button";
import { Users, School, BookOpen, CreditCard, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo.png";
import { UserButton, useUser } from "@clerk/nextjs";

interface SidebarProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Sidebar({ theme, toggleTheme }: SidebarProps) {
  const { user } = useUser();

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
        {/* <a
          href="#"
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#892FFF] hover:bg-opacity-10 hover:text-[#892FFF] dark:hover:text-white"
        >
          <BookOpen className="h-5 w-5" />
          <span>Courses</span>
        </a> */}
      </nav>
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 mt-[525px]">
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <span className="text-gray-700 dark:text-gray-300">
                {user.firstName} {user.lastName}
              </span>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
