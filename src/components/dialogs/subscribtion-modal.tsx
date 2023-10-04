"use client";
import { addSubscription } from "@/actions/subscription";
import { siteConfig } from "@/config/site-config";
import useGetFullUser from "@/hooks/use-full-user";
import useUserSubscription from "@/hooks/use-subscription";
import { makePayment } from "@/lib/chapa/initate";
import { Plan, getPlans } from "@/lib/chapa/plans";
import firebase_app from "@/lib/firebase/firebase-client";
import { cn, nFormat } from "@/lib/utils";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/auth-context";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "../ui/use-toast";

const db = firebase_app ? getFirestore(firebase_app) : undefined;

export const SubscriptionModal = () => {
  const [openLocal, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yearly, setYearly] = useState(false);
  const subscription = useUserSubscription();
  const router = useRouter();
  const { user } = useAuthContext();
  const { userAccountData } = useGetFullUser();
  useEffect(() => {
    setOpen(subscription.userData === null);
  }, [subscription.userData]);

  const plans = getPlans(userAccountData?.role ?? "Parent");
  async function subscribeToPlan(plan: Plan) {
    setIsLoading(true);
    if (plan.name === "Free") {
      const plan = plans[0]; //this is assuming the first plan is free
      if (db && user) {
        await addSubscription({
          userId: user.uid,
          yearly: true,
          paymentInfo: {
            txRef: "",
            email: user.email ?? "",
          },
          plan,
        });
        setIsLoading(false);
        setOpen(false);
        return toast({
          title: "Successfully subscribe to free tier!",
        });
      }
      return;
    }
    const paymentData = {
      first_name: user?.displayName?.split(" ")[0] || "First Name",
      last_name: user?.displayName?.split(" ")[1] || "Last Name",
      amount: yearly ? plan.price.yearly : plan.price.monthly,
      email: user?.email || "email@email.com",
      return_url: `${siteConfig.url}/dashboard`,
    };
    const checkoutUrl = await makePayment(
      paymentData,
      user?.uid ?? "",
      plan,
      yearly
    );
    if (!checkoutUrl) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    router.push(checkoutUrl);
  }

  return (
    <Dialog open={openLocal} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className=" max-w-4xl">
        <DialogTitle className=" text-2xl text-brand-orange font-bold font-heading">
          Hey, {user?.displayName}
        </DialogTitle>
        <DialogDescription className=" text-lg font-medium">
          Choose a plan to continue
          <Tabs
            value={yearly ? "yearly" : "monthly"}
            onValueChange={(value) => setYearly(value === "yearly")}
          >
            <TabsList className=" relative">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className=" relative">
                Yearly
              </TabsTrigger>
              <p
                className={cn(
                  " absolute rounded-full opacity-70 w-6 h-6 font-bold flex p-2 items-center justify-center bg-brand-primary-orange-800 -top-2 text-white -right-2 text-[8px]",
                  yearly && " opacity-100"
                )}
              >
                -17%
              </p>
            </TabsList>
          </Tabs>
        </DialogDescription>
        <ScrollArea>
          <div className=" grid grid-cols-2 gap-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "flex-grow flex flex-col justify-between text-xs md:text-base",
                  plan.name === "Standard" && " border border-brand-orange/20 "
                )}
              >
                <CardHeader>
                  <CardTitle className=" md:flex-row flex-col flex gap-2 md:items-center justify-between">
                    {plan.name}
                    {plan.name === "Standard" && (
                      <p className=" text-orange-600 border p-1 px-2 rounded-lg border-ecstasy">
                        Popular
                      </p>
                    )}
                  </CardTitle>
                  <CardDescription className="break-words overflow-hidden text-xs md:text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <div>
                  <CardContent>
                    <CardTitle className=" md:text-xl text-base">
                      ETB{" "}
                      {yearly
                        ? nFormat(plan.price.yearly)
                        : nFormat(plan.price.monthly)}
                    </CardTitle>
                    <CardDescription>
                      <div>
                        <p>- {plan.quota.studentCount} Students</p>
                        <p>
                          -{" "}
                          {plan.name === "Free"
                            ? "Trail Course"
                            : "Access All Courses"}
                        </p>
                      </div>
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="text-xs md:text-base"
                      onClick={() => subscribeToPlan(plan)}
                      disabled={isLoading}
                    >
                      Choose Plan
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
