"use client";

import Header from "@/components/dashboard/header";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Users,
  School,
  BookOpen,
  CreditCard,
  MoreVertical,
  Search,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

export default function AdminDashboard() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Mock data - in a real app, this would come from API calls
  const metrics = {
    totalRevenue: 15000,
    totalStudents: 32,
    totalTeachers: 13,
    totalSchools: 10,
  };

  const subscriptionData = [
    { name: "Free", students: 22 },
    { name: "Standard", students: 9 },
    { name: "Premium", students: 2 },
  ];

  const recentRegistrations = [
    {
      id: 1,
      name: "Nahom Teguade",
      email: "app@beblocky.com",
      type: "Student",
      date: "2023-06-01",
    },
    {
      id: 2,
      name: "Nahom",
      email: "nahomtegaude@gmail.com",
      type: "Parent",
      date: "2023-06-02",
    },
    {
      id: 3,
      name: "Nate",
      email: "nate@beblokcy.com",
      type: "Teacher",
      date: "2023-06-03",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 rounded-md">
      {/* <Sidebar theme={theme} toggleTheme={toggleTheme} /> */}
      <div className="container mx-auto overflow-y-auto">
        <Header
          page={"admin"}
          header={"Admin Dashboard"}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[#892FFF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  ${metrics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-[#FF932C]">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-[#892FFF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.totalStudents.toLocaleString()}
                </div>
                <p className="text-xs text-[#FF932C]">+180 this week</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Teachers
                </CardTitle>
                <BookOpen className="h-4 w-4 text-[#892FFF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.totalTeachers}
                </div>
                <p className="text-xs text-[#FF932C]">+3 this week</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Schools
                </CardTitle>
                <School className="h-4 w-4 text-[#892FFF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.totalSchools}
                </div>
                <p className="text-xs text-[#FF932C]">+2 this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-[#892FFF]">
                  Recent Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#892FFF]">Name</TableHead>
                      <TableHead className="text-[#892FFF]">Email</TableHead>
                      <TableHead className="text-[#892FFF]">Type</TableHead>
                      <TableHead className="text-[#892FFF]">Date</TableHead>
                      <TableHead className="text-[#892FFF]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {registration.name}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {registration.email}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {registration.type}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {registration.date}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-[#892FFF]"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-gray-800"
                            >
                              <DropdownMenuItem className="text-gray-700 dark:text-gray-300">
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-700 dark:text-gray-300">
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-[#892FFF]">
                  Subscription Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" stroke="#892FFF" />
                    <YAxis stroke="#892FFF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "light" ? "#fff" : "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      itemStyle={{
                        color: theme === "light" ? "#4b5563" : "#e5e7eb",
                      }}
                    />
                    <Bar dataKey="students" fill="#892FFF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-[#892FFF]">
                  Account Management
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Manage user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-[180px] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem
                        value="student"
                        className="text-gray-900 dark:text-white"
                      >
                        Student
                      </SelectItem>
                      <SelectItem
                        value="parent"
                        className="text-gray-900 dark:text-white"
                      >
                        Parent
                      </SelectItem>
                      <SelectItem
                        value="teacher"
                        className="text-gray-900 dark:text-white"
                      >
                        Teacher
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search users..."
                    className="max-w-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <Button className="bg-[#892FFF] text-white hover:bg-[#7929E6]">
                    Search
                  </Button>
                </div>
                <div className="mt-4 flex space-x-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-[#892FFF] border-[#892FFF] hover:bg-[#892FFF] hover:text-white"
                      >
                        Change User Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-[#892FFF]">
                          Change User Role
                        </DialogTitle>
                        <DialogDescription className="text-gray-700 dark:text-gray-300">
                          Update the role for the selected user. This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="name"
                            className="text-right text-gray-700 dark:text-gray-300"
                          >
                            Name
                          </Label>
                          <Input
                            id="name"
                            value="John Doe"
                            className="col-span-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="role"
                            className="text-right text-gray-700 dark:text-gray-300"
                          >
                            New Role
                          </Label>
                          <Select>
                            <SelectTrigger className="w-[180px] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                              <SelectValue placeholder="Select new role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800">
                              <SelectItem
                                value="student"
                                className="text-gray-900 dark:text-white"
                              >
                                Student
                              </SelectItem>
                              <SelectItem
                                value="parent"
                                className="text-gray-900 dark:text-white"
                              >
                                Parent
                              </SelectItem>
                              <SelectItem
                                value="teacher"
                                className="text-gray-900 dark:text-white"
                              >
                                Teacher
                              </SelectItem>
                              <SelectItem
                                value="admin"
                                className="text-gray-900 dark:text-white"
                              >
                                Admin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          className="bg-[#892FFF] text-white hover:bg-[#7929E6]"
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Delete User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
