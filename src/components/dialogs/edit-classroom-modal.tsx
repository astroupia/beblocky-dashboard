"use client";
import { editClass } from "@/actions/schools";
import useCourses from "@/hooks/user-courses";
import { guid } from "@/lib/utils";
import { Classroom } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "../context/auth-context";
import { Loading } from "../loading";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";

export const EditClassRoomModal = ({ classroom }: { classroom: Classroom }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Edit3 size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add New Classroom</DialogHeader>
        <DialogDescription>
          <EditClassRoomForm classroom={classroom} setOpen={setOpen} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export const EditClassRoomForm = ({
  classroom,
  setOpen,
}: {
  classroom: Classroom;
  setOpen: (state: boolean) => void;
}) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schema = z.object({
    name: z.string(),
    courses: z.array(z.string()),
  });
  type Schema = z.infer<typeof schema>;
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      courses: classroom.courses,
      name: classroom.name,
    },
  });
  async function onSubmit(data: Schema) {
    setIsLoading(true);
    setOpen(false);
    console.log(classroom);
    await editClass(
      classroom.uid,
      user?.uid ?? "",
      data.name,
      courseBox.map((d) => d.courseId ?? "")
    );
    setIsLoading(false);
    toast({
      title: "Classroom Successfully Edited!",
    });
    router.refresh();
  }
  const [courseBox, setCourseBox] = useState<
    { id: string; courseId: string | undefined }[]
  >(classroom.courses.map((c) => ({ id: guid(), courseId: c })));
  const { courses } = useCourses();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Classroom Name" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courses"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className=" flex items-center gap-2"
                  onClick={() =>
                    setCourseBox((prev) => [
                      ...prev,
                      { courseId: undefined, id: guid() },
                    ])
                  }
                >
                  Add Course
                  <Plus size={16} />
                </Button>
              </FormControl>
            </FormItem>
          )}
        />
        {Array.from(new Set(courseBox)).map((box) => (
          <div key={box.courseId}>
            <Select
              onValueChange={(v) => {
                setCourseBox((prev) => [
                  ...prev.filter((p) => p.id !== box.id),
                  { courseId: v, id: box.id },
                ]);
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
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button className=" mt-4">
          {isLoading ? <Loading /> : "Edit Class"}
        </Button>
      </form>
    </Form>
  );
};
