"use client";
import useCourses from "@/hooks/user-courses";
import { Classroom } from "@/types";
import { MonitorDot, MonitorPlay, Users2 } from "lucide-react";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { Badge } from "./ui/badge";
interface ExtendedClassroom extends Classroom {
  ownerName?: string;
  studentsCount?: number;
  parentStudentsCount?: number;
}

export const StudentInfo = ({
  user,
  progress,
}: {
  user: { displayName?: string } & { classroom: ExtendedClassroom };
  progress?: { hoursSpent: number };
}) => {
  const { courses } = useCourses();
  return (
    <div className="space-y-6">
      <h3 className=" font-bold text-2xl">Child Profile</h3>
      <div className="flex flex-col items-center justify-center mt-6">
        <div className=" border bg-gray-100 border-ecstasy rounded-full w-28 h-28 flex items-center justify-center">
          <p className=" text-4xl font-medium">
            {`${user.displayName?.split(" ")[0][0]}${
              user.displayName?.split(" ")[1][0]
            }`}
          </p>
        </div>
        <h3 className=" font-bold text-2xl">{user.displayName}</h3>
      </div>
      <div>
        <div className=" bg-slate-200 flex items-center rounded-md divide-black gap-2">
          <div className=" flex flex-col items-center justify-center flex-grow">
            <span className=" font-bold text-lg">
              {progress?.hoursSpent || 0}
            </span>
            <span className=" text-sm font-medium">Avg. hour</span>
          </div>
          {/* <div className=" flex flex-col items-center justify-center flex-grow border-l-2 border-black">
                        <span className=" font-bold text-lg">2</span>
                        <span className=" text-sm font-medium">Rewards</span>
                    </div> */}
          <div className=" flex flex-col items-center justify-center flex-grow border-l-2 border-black">
            <span className=" font-bold text-lg">
              {user.classroom.courses?.length || 0}
            </span>
            <span className=" text-sm font-medium">Enrolled</span>
          </div>
        </div>
      </div>
      <div className=" space-y-2">
        <p className=" font-bold text-xl">Courses They're Taking</p>
        <div className="flex items-start gap-2">
          <div className=" bg-slate-100 p-4 rounded-lg">
            <MonitorDot size={48} className="text-ecstasy" />
          </div>
          <div className=" flex flex-col justify-between">
            <Link
              href={`/dashboard/courses/`}
              className="font-bold hover:text-ecstasy transition-colors"
            >
              {courses.find(
                (c) => c._id.toString() === user.classroom?.courses[0]
              )?.courseTitle ?? "-"}
            </Link>
            {/* <span className=" text-xs py-1">8 Members</span> */}
            <Badge className="w-[65%]" variant="default">
              Coming Soon
            </Badge>
            {/* <Progress value={80} /> */}
            <div className="flex items-center gap-2 mt-1">
              {/* <Users2 size={14} /> */}
              {/* <span className="text-xs">28k</span> */}
            </div>
          </div>
        </div>
      </div>
      <div className=" space-y-2">
        <p className=" font-bold text-xl">Joined Class</p>
        <div className="flex items-start gap-2">
          <div className=" bg-slate-100 p-4 rounded-lg">
            <Users2 size={48} className=" text-ecstasy" />
          </div>
          <div className=" flex flex-col">
            <div className=" flex items-center gap-1">
              <MonitorPlay size={12} />
              <span className="text-xs">{user.displayName}'s Class</span>
            </div>
            <p className="font-bold text-lg">
              Class - {user.classroom?.name ?? "A"}
            </p>
            {/* <span className="text-xs py-1">
              {user.classroom?.studentsCount} Members
            </span> */}
            {/* <Progress value={80} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
