"use client";
import { createStudent } from "@/actions/student";
import useGetFullUser from "@/hooks/use-full-user";
import { EditChildSchema, editChildSchema } from "@/lib/schema/auth";
import { Classroom, Student } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/auth-context";
import { Loading } from "../loading";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";

export const EditChildModal = ({
  student,
  classrooms,
}: {
  student: Student;
  classrooms: Classroom[];
}) => {
  const form = useForm<EditChildSchema>({
    resolver: zodResolver(editChildSchema),
    defaultValues: {
      name: student.name,
      classroom: student.classroom,
      username: student.email.replace("@beblocky.com", ""),
    },
  });
  const { userAccountData } = useGetFullUser();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function onSubmit(data: EditChildSchema) {
    setIsLoading(true);
    await createStudent({
      parentId: user?.uid as string,
      classroom: data.classroom,
      studentId: student.userId,
      studentEmail: student.email,
      studentName: data.name,
      studentUsername: data.username,
    });
    setIsLoading(false);
    router.refresh();
    setOpen(false);
    toast({
      title: "Successfully done!",
      description: "Student information updated successfully!",
    });
  }
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Edit3 size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student Info</DialogTitle>
          <DialogDescription>Edit student information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            {userAccountData?.role === "School" && (
              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => {
                  const classroom = form.getValues("classroom");
                  return (
                    <FormItem className=" w-full">
                      <FormControl>
                        <Select
                          value={classroom?.length ? classroom : undefined}
                          onValueChange={(value) =>
                            form.setValue("classroom", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Classroom" />
                          </SelectTrigger>
                          <SelectContent>
                            {classrooms.map((cls) => (
                              <SelectItem key={cls.uid} value={cls.uid}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            )}
            <Button>{isLoading ? <Loading /> : "Edit Child Info"}</Button>
            {/* <Button variant="destructive" className="gap-2">
                            <Trash2 size={14} /> Remove Child
                        </Button> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
