"use client";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/lib/error-toast";
import { auth } from "@/lib/firebase/firebase-auth";
import { SignInSchema, signInSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRedirectResult, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }
    });
  }, []);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  async function login(data: SignInSchema) {
    setIsLoading(true);
    let { email, password } = data;
    if (!email.includes("@")) {
      email = `${email}@beblocky.com`;
    }
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        fetch("/api/sign-in", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await userCred.user.getIdToken()}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            router.push("/dashboard");
            setIsLoading(false);
          }
        });
      })
      .catch((e) => {
        toast({
          title:
            e?.message ?? "Error happened while signing in, Please try again!",
        });
        setIsLoading(false);
      });
  }
  return (
    <div>
      <Form {...form}>
        <form
          className=" space-y-4"
          onSubmit={form.handleSubmit(login, errorToast)}
        >
          <FormField
            control={form.control}
            name="email"
            render={(field) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field.field}
                    placeholder="username/email"
                    className=" h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={(field) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field.field}
                    placeholder="Password"
                    type="password"
                    className=" h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className=" w-full text-lg" size="lg" disabled={isLoading}>
            {isLoading ? <Loading /> : "Login"}
          </Button>
        </form>
      </Form>
      {/* <Link href="/forgot-password">
                <p className="text-center text-orange-900 mt-4 text-sm font-semibold cursor-pointer hover:underline transition-all duration-300">
                    Forgot Password?
                </p>
            </Link> */}
    </div>
  );
}
