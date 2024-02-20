"use client";

import { useIsMobile } from "@/hooks/use-viewport";
import useCourses from "@/hooks/user-courses";
import { Classroom } from "@/types";
import { Plus } from "lucide-react";
import { EditClassRoomModal } from "./dialogs/edit-classroom-modal";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CopyButton } from "./ui/copy-button";

export function ClassroomCard({ classroom }: { classroom: Classroom }) {
  const isMobile = useIsMobile();
  const { courses } = useCourses();
  return (
    <Card className="rounded-2xl lg:w-1/4 w-full flex-grow h-full flex flex-col justify-between">
      <CardHeader className=" text-white p-6 bg-gradient-to-tr from-lime-600 to-lime-500 rounded-t-2xl">
        <div className=" border-b pb-2">
          <p className=" font-medium text-sm">Classroom</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium pt-4">{classroom.name}</p>
          <EditClassRoomModal classroom={classroom} />
        </div>
        <div className=" flex items-center">
          <CopyButton value={classroom.uid}>
            Copy Classroom ID
          </CopyButton>
          <div></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className=" mt-4 flex items-center justify-between border-b pb-4">
          <div>
            <p className=" text-sm font-bold">Members</p>
          </div>
          {/* <div
            role="button"
            className=" flex items-center gap-2 text-green-700 font-semibold text-xs bg-green-100 p-1 px-2"
          >
            <Plus size={12} />
            Add
          </div> */}
        </div>
        <div className=" mt-2 space-y-2">
          <p className=" text-sm font-bold">Course</p>
          {classroom.courses.map((course) => (
            <p className=" font-medium text-sm">
              {courses.find((c) => c._id.toString() === course)?.courseTitle}
            </p>
          ))}
        </div>
        {/* <Button className=" gap-4 py-4 mt-4">
                    <span className=" font-semibold text-xs">
                        VIEW PROGRESS
                    </span>
                    <ChevronRight />
                </Button> */}
      </CardContent>
    </Card>
  );
}
