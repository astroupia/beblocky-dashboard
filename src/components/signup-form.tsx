import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useStepper } from "headless-stepper";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import firebase_app from "@/lib/firebaseClient";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, PlusIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import usePayment, { UserPaymentData } from "@/services/usePayment";
import { useAuthContext } from "./AuthContext";
import { useRouter } from "next/router";

const FormSchema = z
  .object({
    name: z.string().min(2).max(32),
    role: z.enum(["parent", "school", "student"]).default("parent").optional(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    passwordConfirmation: z.string().min(8).max(32),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

const db = firebase_app ? getFirestore(firebase_app) : undefined;

export default function SignUpForm() {
  const auth = getAuth();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { user } = useAuthContext();
  const router = useRouter();
  const { isSuccess, isLoading, checkoutUrl, makePayment } = usePayment();
  const [userData, setUserData] = useState<UserPaymentData>({
    first_name: "",
    last_name: "",
    email: "",
    return_url: "",
    amount: 0,
  });

  const paymentPlans = [
    {
      title: "Free",
      price: 0,
      description: "You can try it for free and upgrade later.",
    },
    {
      title: "Standard",
      price: 1000,
      description: "Unlocks access to some of our best courses.",
    },
    {
      title: "Gold",
      price: 2500,
      description:
        "Chosen by the majority of our users. Provides access to premium courses.",
    },
    {
      title: "Premium",
      price: 5000,
      description:
        "This is the premium plan; the best plan for the best learning experience.",
    },
  ];

  const onBuyClick = (price: number) => {
    if (price === 0) {
      void router.push("https://beb-blocky-ide-kxez.vercel.app/");
    }
    if (user !== null) {
      const paymentData: UserPaymentData = {
        first_name: user.displayName?.split(" ")[0] || "First Name",
        last_name: user.displayName?.split(" ")[1] || "Last Name",
        amount: price,
        email: user.email || "email@email.com",
        return_url: "https://beb-blocky-ide-kxez.vercel.app/register",
      };
      void makePayment(paymentData);
    }
  };

  React.useEffect(() => {
    if (isSuccess && checkoutUrl) {
      void router.push(checkoutUrl);
    }
  }, [isSuccess, checkoutUrl, router]);

  const steps = React.useMemo(
    () => [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }],
    []
  );

  const { state, nextStep, stepsProps, stepperProps } = useStepper({
    steps,
  });

  // const barSize = React.useMemo(
  //   () => Math.ceil((state.currentStep / (steps?.length - 1)) * 100),
  //   [state, steps]
  // );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password, role } = data;

    setUserData({ ...userData });
    setUserData({ ...userData, email: email });
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: data.name });
      if (db) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: data.name,
          role: data.role,
          credit: 0,
        });
        await setDoc(doc(db, "School", user.uid), {
          uid: user.uid,
          name: data.name,
          role: data.role,
        });
        if (role === "parent") {
          await setDoc(doc(db, `School/${user.uid}/Classes`, "Class A"), {
            uid: user.uid,
            name: "Class A",
          });
        }
      }
      nextStep();
    } catch (error) {
      console.error(error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  }

  if (isLoading)
    return (
      <p>
        Your account has been created. We are redirecting you to chapa to finish
        your payment now...
      </p>
    );

  return (
    <div className="grid h-full w-full place-items-center gap-4 xs:grid-cols-6 sm:grid-cols-6">
      {state?.currentStep == 0 && (
        <div className="space-y-4 xs:col-span-5 sm:col-span-5">
          <h3>Join BeBlocky As</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="col-span-2 w-full cursor-pointer"
              onClick={() => {
                form.setValue("role", "parent");
                nextStep();
              }}
            >
              <CardHeader className="-mt-4 flex items-center">
                <PlusIcon className="text-apple" size={50} />
              </CardHeader>
              <CardFooter className="-mt-4 justify-center">
                <p className="text-lg">Parent</p>
              </CardFooter>
            </Card>
            {/* <Card className="w-full cursor-pointer"
              onClick={() => { form.setValue("role", "school"); nextStep() }}
            >
              <CardHeader className="flex items-center -mt-4">
                <GraduationCap className="text-apple" size={70} />
              </CardHeader>
              <CardFooter className="justify-center -mt-4">
                <p className="text-lg">School</p>
              </CardFooter>
            </Card> */}
            <Card
              className="col-span-2 w-full cursor-pointer"
              onClick={() => {
                form.setValue("role", "student");
                nextStep();
              }}
            >
              <CardHeader className="-mt-4 flex items-center">
                <PlusIcon className="text-apple" size={50} />
              </CardHeader>
              <CardFooter className="-mt-4 justify-center">
                <p className="text-lg">Student</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      {state?.currentStep == 1 && (
        <Form {...form}>
          <form
            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
            className="space-y-4 xs:col-span-5 sm:col-span-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name"
                      className="shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      type="email"
                      placeholder="Email"
                      className="rounded-xl shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      type="password"
                      placeholder="Password"
                      className="shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      className="shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      className="border-none bg-gray-300 data-[state=checked]:bg-ecstasy"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    <label
                      htmlFor="terms"
                      className="align-super text-xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              variant={"mainButton"}
              type="submit"
              className="w-full bg-ecstasy text-white"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      )}
      {state?.currentStep == 2 && (
        <div className="space-y-4  xs:col-span-5 sm:col-span-5">
          <h3>Choose Your Plan</h3>
          <div className="grid grid-cols-2 gap-4">
            {paymentPlans.map((plan) => (
              <>
                <Card
                  className="w-full cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl"
                  onClick={() => {
                    onBuyClick(plan.price);
                  }}
                >
                  <div className="m-4 rounded-3xl">
                    <CardHeader className="flex items-center">
                      {plan.title}
                    </CardHeader>
                    <CardContent className="-my-4 flex items-center justify-center text-3xl font-extrabold text-ecstasy">
                      ETB {plan.price}
                    </CardContent>
                  </div>
                  <CardFooter className="justify-center">
                    <p>{plan.description}</p>
                  </CardFooter>
                </Card>
              </>
            ))}
          </div>
        </div>
      )}
      <nav className="" {...stepperProps}>
        <ol className="grid grid-flow-col grid-rows-4">
          {stepsProps?.map((step, index) => (
            <li className="flex-[1_0_auto] text-center" key={index}>
              <a className="group flex flex-col items-center focus:outline-0">
                <span
                  className={`border-full ease-in-out flex h-8 w-8 items-center justify-center rounded-full border text-black transition-colors ${
                    state?.currentStep === index
                      ? "bg-ecstasy text-white"
                      : "bg-white"
                  } ${index === 3 ? "ml-2" : ""}`}
                >
                  {index + 1}
                </span>
                <span
                  className={`${
                    state?.currentStep === index ? "font-bold" : ""
                  }`}
                >
                  {index === 0 && "Role"}
                  {index === 1 && "Detail"}
                  {index === 2 && "Plan"}
                </span>
              </a>
            </li>
          ))}
        </ol>
        {/* <div
          style={{ gridColumn: "2 / 8" }}
          className="flex items-center flex-row top-4 right-8 relative border-0.5 bg-gray-300 z-[-1] pointer-events-none row-span-full w-full h-0.5"
          {...progressProps}
        >
          <span className="h-full w=full flex" />
          <div
            style={{
              width: `${barSize}%`,
              gridColumn: 1 / -1,
              gridRow: 1 / -1
            }}
            className="flex flex-row h-full overflow-hidden border-solid border-0 bg-sky-500"
          />
        </div> */}
      </nav>
    </div>
  );
}
