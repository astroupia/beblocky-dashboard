import { addCourse } from "@/actions/student";
import useCourses, { Course } from "@/hooks/user-courses";
import { guid } from "@/lib/utils";
import { Student } from "@/types";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const AddCourseModal = ({
  student,
  courses,
}: {
  student: Student;
  courses: Course[];
}) => {
  type CourseBox = { id: string; courseId: string | undefined }[];
  const [courseBox, setCourseBox] = useState<CourseBox>(
    student.courses
      ?.filter((c) => c)
      .map((c) => ({ id: guid(), courseId: c })) ?? []
  );
  // const { courses } = useCourses()
  const router = useRouter();
  async function add(crs: CourseBox) {
    const coursesToAdd = crs.filter((d) => d.courseId).map((d) => d.courseId!);
    await addCourse(student.userId, coursesToAdd);
    router.refresh();
  }
  return (
    <Dialog>
      <DialogTrigger>
        <div
          role="button"
          className=" flex items-center gap-2 text-apple-700 font-semibold text-xs  p-1 px-2"
        >
          <Plus size={12} />
          Add
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add More Courses</DialogTitle>
        </DialogHeader>
        <DialogDescription className=" space-y-2">
          <Button
            type="button"
            size="sm"
            className=" flex items-center gap-2"
            onClick={() =>
              setCourseBox((prev) => [
                ...prev,
                { id: guid(), courseId: undefined },
              ])
            }
          >
            Add Course
            <Plus size={16} />
          </Button>
          {courseBox.map((box) => (
            <div key={box.id}>
              <Select
                onValueChange={(v) => {
                  if (v === "remove") {
                    setCourseBox((prev) => [
                      ...prev.filter((p) => p.id !== box.id),
                    ]);
                    return flushSync(() =>
                      add([...courseBox.filter((p) => p.id !== box.id)])
                    );
                  }
                  setCourseBox((prev) => [
                    ...prev.filter((p) => p.id !== box.id),
                    { id: box.id, courseId: v },
                  ]);
                  flushSync(() =>
                    add([
                      ...courseBox.filter((p) => p.id !== box.id),
                      { id: box.id, courseId: v },
                    ])
                  );
                }}
                value={box.courseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem value={course._id.toString()} key={course._id}>
                      {course.courseTitle}
                    </SelectItem>
                  ))}
                  {box.courseId && (
                    <SelectItem
                      value="remove"
                      className=" border-t rounded-none"
                    >
                      <div className=" flex items-center gap-2">
                        <X size={14} className="text-red-600" />
                        <span className=" text-red-600">Remove</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
