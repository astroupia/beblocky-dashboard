"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Moon,
  Sun,
  Settings,
  User,
  BookOpen,
  Mail,
  CalendarDays,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IUser } from "@/types/user";
import Image from "next/image";
import { useThemeContext } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import logo from "@/lib/images/logo.png";

// Placeholder SVG component for avatar
const PlaceholderAvatar = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="url(#gradient)" />
    <path
      d="M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="gradient"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--primary))" />
        <stop offset="1" stopColor="hsl(var(--primary-foreground))" />
      </linearGradient>
    </defs>
  </svg>
);

export function ModernNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useThemeContext();
  const { user, isLoading } = useAuth();

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Reset edit mode when profile dialog opens
  useEffect(() => {
    if (isProfileOpen) {
      setIsEditingProfile(false);
    }
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Custom handler to open profile dialog after dropdown closes
  const handleProfileClick = () => {
    setIsProfileOpen(false); // Ensure closed first
    setTimeout(() => setIsProfileOpen(true), 50); // Open after dropdown closes
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form to last loaded session data
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 fixed w-full z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-2">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image src={logo} alt="Beblocky Logo" width={180} height={180} />
            </Link>
          </div>

          {/* Desktop Navigation (empty as per request) */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {/* No navigation items here as per request */}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link href="/courses">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
              >
                <BookOpen className="h-4 w-4" />
                Courses
              </Button>
            </Link>

            <Link href="/classes">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Classes
              </Button>
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                    {isLoading ? (
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 animate-pulse">
                        <div className="h-4 w-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      </AvatarFallback>
                    ) : user?.image ? (
                      <AvatarImage
                        src={user.image || "/placeholder.svg"}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                        {user?.name ? (
                          getInitials(user.name)
                        ) : (
                          <PlaceholderAvatar />
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem> */}
                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 rounded-lg shadow-xl">
                    <DialogHeader className="pb-4 border-b border-gray-200 dark:border-slate-700">
                      <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 ring-4 ring-primary/20 dark:ring-primary/30 transition-all duration-300">
                          {user?.image ? (
                            <AvatarImage
                              src={user.image || "/placeholder.svg"}
                              alt={user.name || "User"}
                            />
                          ) : (
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                              {user?.name ? (
                                getInitials(user.name)
                              ) : (
                                <PlaceholderAvatar />
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                            {profileForm.name || "User"}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <Mail className="h-3 w-3" />
                            {profileForm.email}
                          </p>
                          {user?.role && (
                            <Badge
                              variant="secondary"
                              className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </Badge>
                          )}
                          {user?.createdAt && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              Joined {format(new Date(user.createdAt), "PPP")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {/* Show input fields only in edit mode, otherwise show plain text */}
                        <div className="grid gap-2">
                          <Label
                            htmlFor="name"
                            className="text-slate-700 dark:text-slate-200"
                          >
                            Name
                          </Label>
                          {isEditingProfile ? (
                            <Input
                              id="name"
                              value={profileForm.name}
                              onChange={(e) =>
                                setProfileForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                              className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                            />
                          ) : (
                            <div className="py-2 px-3 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50">
                              {profileForm.name}
                            </div>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label
                            htmlFor="email"
                            className="text-slate-700 dark:text-slate-200"
                          >
                            Email
                          </Label>
                          {isEditingProfile ? (
                            <Input
                              id="email"
                              value={profileForm.email}
                              type="email"
                              disabled
                              className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                          ) : (
                            <div className="py-2 px-3 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {profileForm.email}
                            </div>
                          )}
                        </div>
                        {/* Add more editable fields as needed */}
                      </div>
                      {/* Edit/Save/Cancel Buttons */}
                      <div className="flex justify-end gap-2 pt-2">
                        {isEditingProfile ? (
                          <>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button variant="default" disabled>
                              Save
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="default"
                            onClick={() => setIsEditingProfile(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    {/* <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem> */}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 rounded-lg shadow-xl">
                    <DialogHeader className="pb-4 border-b border-gray-200 dark:border-slate-700">
                      <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                        Settings
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-6 text-slate-700 dark:text-slate-200">
                      <p>Manage your application settings here.</p>
                      {/* Add settings options here, e.g., theme, notifications, etc. */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-theme">App Theme</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleTheme}
                          className="flex items-center gap-2"
                        >
                          {theme === "light" ? (
                            <Moon className="h-4 w-4" />
                          ) : (
                            <Sun className="h-4 w-4" />
                          )}
                          {theme === "light" ? "Dark Mode" : "Light Mode"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/courses">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                Courses
              </Button>
            </Link>
            <Link href="/classes">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Classes
              </Button>
            </Link>
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 rounded-lg shadow-xl">
                  <DialogHeader className="pb-4 border-b border-gray-200 dark:border-slate-700">
                    <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24 ring-4 ring-primary/20 dark:ring-primary/30 transition-all duration-300">
                        {user?.image ? (
                          <AvatarImage
                            src={user.image || "/placeholder.svg"}
                            alt={user.name || "User"}
                          />
                        ) : (
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                            {user?.name ? (
                              getInitials(user.name)
                            ) : (
                              <PlaceholderAvatar />
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {profileForm.name || "User"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                          <Mail className="h-3 w-3" />
                          {profileForm.email}
                        </p>
                        {user?.role && (
                          <Badge
                            variant="secondary"
                            className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        )}
                        {user?.createdAt && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            Joined {format(new Date(user.createdAt), "PPP")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="name"
                          className="text-slate-700 dark:text-slate-200"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="email"
                          className="text-slate-700 dark:text-slate-200"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileForm.email}
                          type="email"
                          disabled
                          className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-600 dark:text-slate-300"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 rounded-lg shadow-xl">
                  <DialogHeader className="pb-4 border-b border-gray-200 dark:border-slate-700">
                    <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                      Settings
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-6 text-slate-700 dark:text-slate-200">
                    <p>Manage your application settings here.</p>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-theme">App Theme</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="flex items-center gap-2"
                      >
                        {theme === "light" ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
