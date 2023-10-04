"use client";
import { createChild, createStudent, getUserByEmail } from "@/actions/student";
import useGetFullUser from "@/hooks/use-full-user";
import useUserSubscription from "@/hooks/use-subscription";
import { useIsMobile } from "@/hooks/use-viewport";
import { getPlans } from "@/lib/chapa/plans";
import { errorToast } from "@/lib/error-toast";
import firebase_app from "@/lib/firebase/firebase-client";
import { AddChildSchema, addChildSchema } from "@/lib/schema/auth";
import { Classroom } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";

const db = getFirestore(firebase_app as FirebaseApp);

interface Props {
  another?: boolean;
  isSchool?: boolean;
  classrooms?: Classroom[];
  studentsCount: number;
}

export function AddChildModal({
  another,
  isSchool,
  classrooms,
  studentsCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [accountType, setAccountType] = useState<"new" | "existing">();
  const name = isSchool ? "Student" : "Child";
  const { userAccountData } = useGetFullUser();
  const { userData } = useUserSubscription();
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) {
          const quota = getPlans(userAccountData?.role ?? "Parent").find(
            (plan) => plan.name === userData?.subscription ?? "Free"
          )?.quota;
          if (studentsCount >= quota!.studentCount) {
            toast({
              title: "You reach the amount of student you add with your plan",
              description:
                "Please upgrade your package to access more features",
            });
            return;
          }
          setOpen(o);
        }
        setOpen(o);
      }}
    >
      <DialogTrigger asChild>
        {another ? (
          <Button
            className=" flex items-center gap-2"
            size={isMobile ? "sm" : "default"}
            variant="secondary"
          >
            <PlusCircle size={16} />
            Add Another {isSchool ? "Student" : "Child"}
          </Button>
        ) : (
          <Button>Add {name}</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {name}</DialogTitle>
          <DialogDescription>
            Let's crate an account for your {name.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <DialogDescription className=" space-y-2">
          <DialogTitle>
            Do your {name.toLowerCase()} already have an account?
          </DialogTitle>
          <div className=" flex gap-2 items-center mt-2">
            <Button
              variant={accountType === "existing" ? "default" : "outline"}
              onClick={() => setAccountType("existing")}
            >
              Yes
            </Button>
            <Button
              variant={accountType === "new" ? "default" : "outline"}
              onClick={() => setAccountType("new")}
            >
              No
            </Button>
          </div>
        </DialogDescription>
        {accountType === "new" ? (
          <RegisterForm classrooms={classrooms ?? []} setOpen={setOpen} />
        ) : accountType === "existing" ? (
          <AlreadyRegistered setOpen={setOpen} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export const AlreadyRegistered = ({
  setOpen,
}: {
  setOpen: (state: boolean) => void;
}) => {
  const [email, setEmail] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<User>();
  const { userAccountData } = useGetFullUser();
  const { user } = useAuthContext();
  const name = userAccountData?.role === "School" ? "Student" : "Child";
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (email) {
        setIsLoading(true);
        const validate = z.string().email();
        validate.parse(email);
        const user = await getUserByEmail(email);
        if (!user.data) {
          setIsLoading(false);
          return toast({
            title: "Error finding user by email!",
            description: user.error,
            variant: "destructive",
          });
        }
        setFoundUser(user.data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Error finding user by email!",
        description:
          "Please register them as a new user if they don't have account with beblocky yet!",
        variant: "destructive",
      });
    }
  }
  async function onAddStudent() {
    setIsLoading(true);
    const className =
      userAccountData?.role === "Parent" ? "Class A" : "Students";
    try {
      if (!foundUser) throw Error("User not found");
      await createStudent({
        parentId: user?.uid as string,
        studentName: foundUser.displayName as string,
        studentEmail: foundUser.email as string,
        studentId: foundUser.uid,
        classroom: className,
        studentUsername: foundUser.email?.replace("@beblocky.com", "") ?? "",
      });
      setIsLoading(false);
      setOpen(false);
      toast({
        title: `${name} Added Successfully!`,
        description: `A ${name.toLowerCase()} is added successfully they can login with the provided credential to access courses now!`,
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: error?.message ?? "Error happened while adding a student",
      });
      console.error(error);
    }
  }
  return (
    <div>
      <form className=" flex flex-col gap-2" onSubmit={onSubmit}>
        {!foundUser ? (
          <>
            <Label className=" font-semibold">Registered Email</Label>
            <Label className=" text-xs text-stone-700">
              Email address linked with your {name.toLowerCase()} account
            </Label>
          </>
        ) : null}
        {foundUser ? (
          <Label>
            <strong className=" font-bold">{foundUser.displayName}</strong> is
            found with this email.
          </Label>
        ) : null}
        <Input
          disabled={!!foundUser}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        {!foundUser ? (
          <Button disabled={isLoading || !!foundUser}>
            {isLoading ? <Loading /> : "Find Child/Student"}
          </Button>
        ) : (
          <Button onClick={onAddStudent}>Add Student/Child</Button>
        )}
        {foundUser ? (
          <Button
            variant="link"
            size="sm"
            className="underline"
            onClick={() => setFoundUser(undefined)}
          >
            Find Another {name}
          </Button>
        ) : null}
      </form>
    </div>
  );
};

export const RegisterForm = ({
  setOpen,
  classrooms,
}: {
  setOpen: (state: boolean) => void;
  classrooms: Classroom[];
}) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { userAccountData } = useGetFullUser();
  const isParent = userAccountData?.role === "Parent";
  const router = useRouter();
  const form = useForm<AddChildSchema>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      classroom: undefined,
    },
  });
  async function onSubmit(data: AddChildSchema) {
    setIsLoading(true);
    const className =
      userAccountData?.role === "Parent" ? "Class A" : "Students";
    try {
      await createChild({
        username: data.username,
        email: `${data.username}@beblocky.com`,
        password: data.password,
        parentId: user!.uid,
        displayName: data.name,
        classroom: data.classroom ?? className,
      });
      setIsLoading(false);
      setOpen(false);
      toast({
        title: "Child Added Successfully!",
        description:
          "A child is added successfully they can login with the provided credential to access courses now!",
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: error?.message ?? "Error happened while adding a student",
      });
      console.error(error);
    }
    router.refresh();
  }
  return (
    <Form {...form}>
      <form
        className=" space-y-4"
        onSubmit={form.handleSubmit(onSubmit, errorToast)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Full Name" className=" h-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Username" className=" h-10" />
              </FormControl>
            </FormItem>
          )}
        />
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
        <Button className=" w-full mt-4" type="submit" disabled={isLoading}>
          {isLoading ? <Loading /> : isParent ? "Add Child" : "Add Student"}
        </Button>
      </form>
    </Form>
  );
};
