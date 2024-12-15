"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog"; // Adjust the import based on your structure
import { SignInButton, useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Logo from "@/public/assets/images/logo.png";
import { CourseCreationFlow } from "@/components/courses/course-creation-flow";

interface HeaderProps {
  page: string;
  header: String;
  theme: string;
  toggleTheme: () => void;
}

export default function Header({
  page,
  header,
  theme,
  toggleTheme,
}: HeaderProps) {
  const { user } = useUser();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreationFlowOpen, setIsCreationFlowOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">{header}</h1>
          <p className="text-muted-foreground">Manage your admin settings</p>
        </div>
        {/* <div className="flex items-center">
          <Link href="/">
            <Image src={Logo} alt="Beblocky logo" className="p-4 h-20 w-50" />
          </Link>
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        {page === "courses" ? (
          <>
            <Button
              onClick={() => setIsCreationFlowOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add New Course
            </Button>
          </>
        ) : (
          <>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/courses">Manage Courses</Link>
            </Button>
          </>
        )}
        <button className="p-2 rounded-md hover:bg-accent relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </button>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <SignedIn>
          {user && (
            <>
              <span className="text-gray-700 dark:text-gray-300">
                {user.firstName}
              </span>
              <UserButton />
            </>
          )}
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>

      <CourseCreationFlow
        open={isCreationFlowOpen}
        onOpenChange={setIsCreationFlowOpen}
        mode="create"
      />
    </div>
  );
}
