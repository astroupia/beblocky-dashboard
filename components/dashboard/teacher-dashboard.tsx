"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import Metrics from "@/components/dashboard/metrics";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";

export default function TeacherDashboard() {
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
    assignedStudents: 30,
    activeCourses: 5,
    upcomingAssignments: 10,
    averageProgress: 75,
  };

  const studentData = [
    {
      id: 1,
      name: "Nahom Teguade",
      email: "nahomteguade@gmail.com",
      progress: 85,
    },
    { id: 2, name: "Natan", email: "natan@beblocky.com", progress: 90 },
    {
      id: 3,
      name: "Nahom Astra",
      email: "nahomastra@gmail.com",
      progress: 70,
    },
  ];

  return (
    <div className="min-h-screen p-8 flex h-screen bg-white dark:bg-gray-900">
      {/* <Sidebar theme={theme} toggleTheme={toggleTheme} /> */}
      <div className="container mx-auto flex-1 overflow-y-auto">
        <Header
          page={"teacher"}
          header={"Teacher Dashboard"}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Metrics
            metrics={{
              ...metrics,
              totalRevenue: 15000,
              totalStudents: 32,
              totalTeachers: 13,
              totalSchools: 10,
            }}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assigned Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.assignedStudents}
                </div>
              </CardContent>
            </Card> */}
            {/* <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.activeCourses}
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.upcomingAssignments}
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Average Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#892FFF]">
                  {metrics.averageProgress}%
                </div>
              </CardContent>
            </Card> */}
          </div>

          <div className="mt-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-[#892FFF]">
                  Student Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Input placeholder="Search students..." className="mr-2" />
                    <Button>Search</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[#892FFF]">Name</TableHead>
                        <TableHead className="text-[#892FFF]">Email</TableHead>
                        <TableHead className="text-[#892FFF]">
                          Progress
                        </TableHead>
                        <TableHead className="text-[#892FFF]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {student.email}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {student.progress}%
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
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
