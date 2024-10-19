"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import app from "@/lib/firebase/firebase-client";
import { SignUpSchema, signUpSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { School2, User, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { errorToast } from "../../../lib/error-toast";

import { getClassroom } from "@/actions/classroom";
import { createStudent } from "@/actions/student";
import { Loading } from "@/components/loading";
import { Checkbox } from "@/components/ui/checkbox";
import useCourses from "@/hooks/user-courses";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react"; // Add this import for useEffect

const db = app ? getFirestore(app) : undefined;

export default function page() {
  const auth = getAuth();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const [isSignUpLoading, setIsSingUpLoading] = useState(false);
  const [roleState, setRoleState] = useState("");
  const { courses } = useCourses();
  const [classCode, setclassCode] = useState(false);

  async function onSubmit(data: SignUpSchema) {
    console.log("Email being submitted:", data.email); // Log the email
    setIsSingUpLoading(true);
    const { email, password, role } = data;
    let parentId = "";
    let classroomId = data.classCode || ""; // Use classCode if provided

    if (data.classCode) {
      const classroom = await getClassroom(data.classCode);
      if (!classroom || !classroom.userId) {
        form.setError("classCode", { message: "Classroom isn't found!" });
        setIsSingUpLoading(false);
        return;
      }
      parentId = classroom.userId; // Now safe to access userId
    }

    // Allow creating a student without classCode and parentId
    if (role === "student" && !data.classCode) {
      parentId = ""; // if No parent association
      classroomId = "12"; // if No classroom association
    }

    if (role === "school") {
      if (!data.schoolName) {
        form.setError("schoolName", { message: "School name is required!" });
        setIsSingUpLoading(false);
        return;
      }
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async ({ user }) => {
          await updateProfile(user, { displayName: data.name });
          if (db) {
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              email: user.email,
              name: data.name,
              role: data.role,
              schoolName: data.schoolName ?? null,
              credit: 0,
            });
            if (data.role === "student") {
              console.log("Trying To Create Student");
              await createStudent({
                parentId,
                classroom: classroomId,
                studentUsername: data.email.replace("@beblocky.com", ""),
                studentId: user.uid,
                studentEmail: data.email as string,
                studentName: data.name as string,
              });
              console.log("Student Created!");
            }
          }
          router.push("/dashboard");
        }
      );
    } catch (error: any) {
      setIsSingUpLoading(false);
      if (error.message?.includes("auth/email-already-in-user")) {
        toast({
          title: "There is already a user registered with this email.",
          variant: "destructive",
        });
      }
      toast({
        title:
          error?.message ??
          "Error happened creating your account. Please try again!",
        variant: "destructive",
      });
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          className=" space-y-4"
          onSubmit={form.handleSubmit(onSubmit, errorToast)}
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      setRoleState(e);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="parent">
                          <div className="flex items-center gap-2">
                            <Users size={18} />
                            Parent
                          </div>
                        </SelectItem>
                        <SelectItem value="school">
                          <div className="flex items-center gap-2">
                            <School2 size={18} />
                            School
                          </div>
                        </SelectItem>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <User size={18} />
                            Student
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      className=" h-10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="h-10"
                      type="email" // Ensure the type is set to email
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("role") === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="classCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Do you have a class code?</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={classCode ? "default" : "outline"}
                            onClick={() => {
                              setclassCode(true);
                              // field.onChange(true);
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={!classCode ? "default" : "outline"}
                            onClick={() => {
                              setclassCode(false);
                              field.onChange(""); // Clear the classCode field
                              form.setValue("classCode", ""); // Ensure the form value is cleared
                            }}
                          >
                            No
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {classCode && (
                  <FormField
                    control={form.control}
                    name="classCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Class Code"
                            className="h-10"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            {roleState === "school" && (
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="School Name"
                        className=" h-10"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      placeholder="Password"
                      type="password"
                      className=" h-10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Repeat Password"
                      type="password"
                      className=" h-10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      className="data-[state=checked]:bg-ecstasy border-none bg-gray-300"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name="terms"
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel htmlFor="terms">
                    <label
                      htmlFor="terms"
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 align-super"
                    >
                      I agree to the terms and conditions
                    </label>
                  </FormLabel>
                </FormItem>
              )}
            />
          </>

          <Button
            className=" w-full text-lg mt-4"
            size="lg"
            type="submit"
            disabled={isSignUpLoading}
          >
            {isSignUpLoading ? <Loading /> : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
