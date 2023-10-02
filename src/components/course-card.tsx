import { Course } from "@/hooks/user-courses";
import { ArrowRight, Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

export function CourseCard({
  course,
  progress,
}: {
  course: Course;
  progress?: boolean;
}) {
  return (
    <Card className="text-dark-ebony md:w-1/4">
      <CardHeader>
        <div className="flex flex-row justify-center gap-2 shadow-sm py-2 rounded-md">
          <Badge
            variant="secondary"
            className="rounded-xl text-dark-ebony bg-gray-200"
          >
            {course.courseLanguage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{course.courseTitle}</p>
        {progress ? (
          <div className=" py-1 space-y-2">
            <p className=" text-sm font-medium">last visited: 8/12/2023</p>
            <Progress value={50} />
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center">
        <Link
          href={`/ide/${course._id}`}
          className="rounded-full p-1 bg-gray-100 ml-auto cursor-pointer"
        >
          <ArrowRight size={24} className="text-ecstasy" />
        </Link>
      </CardFooter>
    </Card>
  );
}
