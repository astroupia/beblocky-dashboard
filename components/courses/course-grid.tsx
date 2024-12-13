"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const courses = [
  {
    id: 1,
    title: "HTML Course 1 (Creating a Profile Website)",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    students: 234,
    progress: 78,
    status: "Active",
  },
  {
    id: 2,
    title: "More on Basic HTML",
    description:
      "Welcome to the HTML & CSS Basics course for beginners! In this course, you will learn the foundational concepts of HTML and CSS, which are essential for creating web pages. By the end of this course, you will be able to build a simple webpage from scratch. Let's get started on your journey to becoming a web developer",
    students: 156,
    progress: 92,
    status: "Active",
  },
  {
    id: 3,
    title: "Kid's Car Adventure with HTML",
    description:
      "Welcome to the Kids' Car Adventure with HTML! In this exciting course, young learners will discover the world of cars while learning the basics of HTML. Get ready for a fun-filled coding journey with colorful slides, interactive examples, and car-themed activities!",
    students: 189,
    progress: 45,
    status: "Draft",
  },
];

export function CourseGrid() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    students: number;
    progress: number;
    status: string;
  };
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex items-center">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Course
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {course.students} students
          </span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              course.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {course.status}
          </span>
        </div>
      </div>
    </Card>
  );
}
