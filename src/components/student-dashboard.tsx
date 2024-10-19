"use client";

import { Course } from "@/hooks/user-courses";
import { CourseCard } from "./course-card";
import { PageHeader } from "./page-header";
import { ClassCodeDialog } from "@/components/dialogs/class-code-dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import necessary Firestore functions

const db = getFirestore(); // Initialize Firestore

export function StudentDashboard({ courses }: { courses: Course[] }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [freeCourse, setFreeCourse] = useState<Course | null>(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Fetch the class code from the student document
  useEffect(() => {
    const fetchClassCode = async () => {
      try {
        const studentId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("studentId="))
          ?.split("=")[1]; // Get studentId from cookies
        if (studentId) {
          const studentRef = doc(db, "students", studentId); // Reference to the student document
          const studentDoc = await getDoc(studentRef); // Get the student document

          if (studentDoc.exists()) {
            const studentData = studentDoc.data(); // Get the data from the document
            if (studentData) {
              // Check if studentData is defined
              const classCode = studentData.classroom; // Assuming classCode is a field in the student document

              if (classCode === "12") {
                fetch("https://beblocky-ide.vercel.app/api/v1/courses")
                  .then((response) => response.json())
                  .then((data) => {
                    const course = data.courses.find(
                      (c: Course) =>
                        c.courseTitle ===
                        "HTML Course 1 (Creating a Profile Website)"
                    );
                    setFreeCourse(course || null);
                  })
                  .catch((error) =>
                    console.error("Error fetching course:", error)
                  );
              }
            } else {
              console.error("Student data is undefined!");
            }
          } else {
            console.error("No such student document!");
          }
        } // Closing brace for the if (studentDoc.exists()) block
      } catch (error) {
        console.error("Error fetching student data:", error);
      } // Closing brace for the try block
    }; // This should be outside the try-catch block

    fetchClassCode();
  }, []);

  return (
    <div>
      <PageHeader
        showAddClassCodeBtn={true}
        onAddClassCodeClick={handleOpenDialog}
      />
      <div className="flex flex-col py-4 gap-2">
        <h3 className="text-3xl font-bold">Your Courses</h3>
        {courses.length === 0 ? (
          <p className="text-sm">
            No Course Association, Please Add a Class Code
          </p>
        ) : (
          <p className="text-sm">Course you're enrolled in</p>
        )}
        <div className="md:flex-row flex flex-col items-start gap-4">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} progress />
          ))}
          {freeCourse && (
            <CourseCard key={freeCourse._id} course={freeCourse} progress />
          )}
        </div>
      </div>
      <ClassCodeDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}
