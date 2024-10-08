/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  StarHalf,
  ShoppingCartIcon,
  Link,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import htmlLogo from "../../public/icons/html5/html5-original.svg";
import cssLogo from "../../public/icons/css3/css3-original.svg";
import jsLogo from "../../public/icons/javascript/javascript-original.svg";
import python from "../../public/icons/python/python-original.svg";
import { type Course } from "@/services/useCourses";
import { useAuthContext } from "./AuthContext";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

interface LogoDict {
  [key: string]: string; // Defining the type for logo dictionary
}
const logoDict: LogoDict = {
  html: htmlLogo.src as string,
  css: cssLogo.src as string,
  js: jsLogo.src as string,
  python: python.src as string,
  py: python.src as string,
};

interface Props {
  course: Course;
  userHasCourse: boolean;
  userHasCourseVerified: boolean;
}

const CourseCard = ({
  course,
  userHasCourse,
  userHasCourseVerified,
}: Props) => {
  const router = useRouter();

  return (
    <Card className="bg-gray-100 text-dark-ebony">
      <CardHeader>
        <Image
          src={logoDict[course.courseLanguage] || ""}
          alt="Course image"
          width={180}
          height={110}
          className="mx-auto mb-3 rounded-xl"
        />
        <div className="flex flex-row justify-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-xl bg-gray-200 text-dark-ebony"
          >
            {course.courseLanguage.toUpperCase()}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-xl bg-gray-200 text-dark-ebony"
          >
            {course.subType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="-mt-5">
        <CardTitle>{course.courseTitle}</CardTitle>
        <div className="mt-2 flex flex-row items-center justify-between">
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
      <CardFooter className="flex flex-row items-center justify-between">
        <p className="text-xl font-bold"></p>
        <div className="flex flex-row gap-2 rounded-full bg-gray-100 p-1">
          {userHasCourse && userHasCourseVerified && (
            <ArrowRight
              size={24}
              className="cursor-pointer text-ecstasy"
              onClick={() => {
                void router.push(
                  `https://bebblocky.vercel.app/ide/${course.courseId}`
                );
              }}
            />
          )}
          {!userHasCourse && (
            <p
              onClick={() => {
                void router.push("/upgrade");
              }}
              className="cursor-pointer text-right text-lg font-semibold text-ecstasy hover:underline"
            >
              Upgrade
            </p>
          )}
          {userHasCourse && !userHasCourseVerified && (
            <p
              onClick={() => {
                void router.push("/upgrade");
              }}
              className="cursor-pointer text-right text-lg font-semibold text-ecstasy hover:underline"
            >
              Verify Payment
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
