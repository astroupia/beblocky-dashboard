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
import { EditCourseDialog } from "./dialogs/edit-course-dialog";
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog";

interface Course {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Premium" | "Standard" | "Gold";
  students: number;
  progress: number;
  status: string;
}

const courses: Course[] = [
  {
    id: 1,
    courseId: 101,
    courseTitle: "Introduction to Web Development",
    courseDescription: "Learn the basics of HTML, CSS, and JavaScript",
    courseLanguage: "English",
    subType: "Free",
    students: 234,
    progress: 78,
    status: "Active",
  },
  {
    id: 2,
    courseId: 102,
    courseTitle: "Advanced React Patterns",
    courseDescription: "Master advanced React concepts and patterns",
    courseLanguage: "English",
    subType: "Premium",
    students: 156,
    progress: 92,
    status: "Active",
  },
  {
    id: 3,
    courseId: 103,
    courseTitle: "Node.js Backend Development",
    courseDescription: "Build scalable backend applications with Node.js",
    courseLanguage: "English",
    subType: "Standard",
    students: 189,
    progress: 45,
    status: "Draft",
  },
];

export function CourseGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

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
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => handleEdit(course)}
            onDelete={() => handleDelete(course)}
          />
        ))}
      </div>

      <EditCourseDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        course={editingCourse || undefined}
        mode={editingCourse ? "edit" : "create"}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Course"
        itemToDelete={courseToDelete}
        itemType="course"
        onConfirm={() => {
          // Handle course deletion logic here
          console.log("Deleting course:", courseToDelete);
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{course.courseTitle}</h3>
          <p className="text-muted-foreground">{course.courseDescription}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit} className="flex items-center">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Course
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center text-destructive"
            >
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
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                course.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {course.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                course.subType === "Premium"
                  ? "bg-purple-100 text-purple-800"
                  : course.subType === "Standard"
                  ? "bg-blue-100 text-blue-800"
                  : course.subType === "Gold"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {course.subType}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
