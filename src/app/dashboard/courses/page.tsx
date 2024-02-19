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

export default async function CoursesRoute() {
  const courses = await fetch(
    COURSE_URL
  ).then(async (res) => (await res.json()) as { courses: Course[] });

  return (
    <>
      <Head>
        <title>BeBlocky Dashboard</title>
        <meta name="description" content="Welcome to BeBlocky Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container grid items-center gap-2 pb-4 pt-2 md:py-5 text-dark-ebony">
        <PageHeader
          title="Courses"
          description=" Discover and select your preferred course of interest."
        />
        <h2 className="text-2xl font-bold tracking-tight">
          Most Popular Courses
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 items-center gap-4 pb-4 pt-2">
          <Card className="text-dark-ebony">
            <CardHeader>
              <div className="flex flex-row justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-xl text-dark-ebony bg-gray-200"
                >
                  HTML
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-xl text-dark-ebony bg-gray-200"
                >
                  CSS
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-xl text-dark-ebony bg-gray-200"
                >
                  JS
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="-mt-5">
              <p className="text-2xl font-semibold">
                {courses.courses[0].courseTitle}
              </p>
              <p>{courses.courses[0].courseDescription}</p>
              <div className="flex flex-row justify-between items-center mt-2">
                <div className="flex gap-1">
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <Star size={16} className="text-apple" />
                  <StarHalf className="text-apple" size={16} />
                </div>
                <p className="mt-2">4.7 Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-bold tracking-tight -mt-4">All Courses</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 items-start gap-4 pb-4 pt-2">
          {courses.courses.map((course) => (
            <Card
              className="text-dark-ebony h-full flex flex-col justify-between"
              key={course._id.toString()}
            >
              <CardHeader>
                <div className="flex flex-row justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-xl text-dark-ebony bg-gray-200"
                  >
                    HTML
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-xl text-dark-ebony bg-gray-200"
                  >
                    CSS
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-xl text-dark-ebony bg-gray-200"
                  >
                    JS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="">
                <p className="text-2xl font-semibold">{course.courseTitle}</p>
                <p>{course.courseDescription}</p>
                <div className="flex flex-row justify-between items-center mt-2">
                  <div className="flex gap-1">
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <Star size={16} className="text-apple" />
                    <StarHalf className="text-apple" size={16} />
                  </div>
                  <p className="mt-2">4.7 Rating</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row justify-between items-center">
                <CourseButton course_id={course._id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
