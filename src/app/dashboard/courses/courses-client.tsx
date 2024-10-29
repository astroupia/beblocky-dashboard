"use client";

import { ArrowRight, Star, StarHalf } from "lucide-react";
import Head from "next/head";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Course } from "@/hooks/user-courses";
import { useRouter } from "next/navigation";
import { CourseButton } from "./client";
import { COURSE_URL } from "@/lib/constant";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CourseDetailDialog } from "@/components/dialogs/course-detail-dialog";
import { AddCourseToClassDialog } from "@/components/dialogs/add-course-to-class-dialog";
import { useAuthContext } from "@/components/context/auth-context";
import { getClassroomsByUserId, getDashboardData } from "@/actions/parents";
import { Loading } from "@/components/loading"; // Create this if you haven't

interface CoursesClientProps {
  courses: Course[];
}

export function CoursesClient({ courses }: CoursesClientProps) {
  // Declare all hooks at the top level
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAddToClassDialog, setShowAddToClassDialog] = useState(false);
  const [classrooms, setClassrooms] = useState([]);

  // First useEffect for user data
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        try {
          const data = await getDashboardData();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  // Modified useEffect for classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (user?.uid) {
        const classroomsData = await getClassroomsByUserId(user.uid);
        setClassrooms(classroomsData as any);
      }
    };

    fetchClassrooms();
  }, [user]); // Add user as dependency

  if (loading) {
    return <Loading />;
  }

  if (!user || !userData) {
    return <div>Please sign in to view courses</div>;
  }

  const isTeacherOrParent =
    userData?.role === "school" || userData?.role === "parent";

  return (
    <>
      <Head>
        <title>BeBlocky Dashboard</title>
        <meta name="description" content="Welcome to BeBlocky Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-dark-ebony container grid items-center gap-2 pb-4 pt-2 md:py-5">
        <PageHeader
          title="Courses"
          description=" Discover and select your preferred course of interest."
        />
        <h2 className="text-2xl font-bold tracking-tight">
          Most Popular Courses
        </h2>
        <div className="grid grid-cols-1 items-center gap-4 pb-4 pt-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          <Card className="text-dark-ebony">
            <CardHeader>
              <div className="flex flex-row justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-dark-ebony rounded-xl bg-gray-200"
                >
                  HTML
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-dark-ebony rounded-xl bg-gray-200"
                >
                  CSS
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-dark-ebony rounded-xl bg-gray-200"
                >
                  JS
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="-mt-5">
              <p className="text-2xl font-semibold">{courses[0].courseTitle}</p>
              <p>{courses[0].courseDescription}</p>
              {/* <div className="mt-2 flex flex-row items-center justify-between">
                <div className="flex gap-1">
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <StarHalf className="text-apple" size={16} />
                </div>
                <p className="mt-2">4.7 Rating</p>
              </div> */}
            </CardContent>
          </Card>
        </div>
        <h2 className="-mt-4 text-2xl font-bold tracking-tight">All Courses</h2>
        <div className="grid grid-cols-1 items-start gap-4 pb-4 pt-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              className="text-dark-ebony flex h-full flex-col justify-between"
              key={course._id.toString()}
            >
              <CardHeader>
                <div className="flex flex-row justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-dark-ebony rounded-xl bg-gray-200"
                  >
                    HTML
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-dark-ebony rounded-xl bg-gray-200"
                  >
                    CSS
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-dark-ebony rounded-xl bg-gray-200"
                  >
                    JS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="">
                <p className="text-2xl font-semibold">{course.courseTitle}</p>
                <p>{course.courseDescription}</p>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full text-lg"
                    size="lg"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDetailDialog(true);
                    }}
                  >
                    View Detail
                  </Button>

                  {isTeacherOrParent && (
                    <Button
                      className="w-full text-lg"
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowAddToClassDialog(true);
                      }}
                    >
                      Add to Class
                    </Button>
                  )}
                </div>
                {/* <div className="mt-2 flex flex-row items-center justify-between">
                  <div className="flex gap-1">
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <StarHalf className="text-apple" size={16} />
                  </div>
                  <p className="mt-2">4.7 Rating</p>
                </div> */}
              </CardContent>
              <CardFooter></CardFooter>
              {/* <CardFooter className="flex flex-row items-center justify-between">
                <Link
                  role="button"
                  className="ml-auto rounded-full bg-gray-100 p-1"
                  href={`/ide/${course._id}`}
                >
                  <ArrowRight size={24} className="text-ecstasy" />
                </Link>
              </CardFooter> */}
            </Card>
          ))}
        </div>
        {selectedCourse && (
          <>
            <CourseDetailDialog
              course={selectedCourse}
              isOpen={showDetailDialog}
              onClose={() => setShowDetailDialog(false)}
            />

            {isTeacherOrParent && (
              <AddCourseToClassDialog
                course={selectedCourse}
                classrooms={classrooms}
                isOpen={showAddToClassDialog}
                onClose={() => setShowAddToClassDialog(false)}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
