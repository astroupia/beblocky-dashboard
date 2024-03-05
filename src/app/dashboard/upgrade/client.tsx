"use client";

import { addSubscription } from "@/actions/subscription";
import { useAuthContext } from "@/components/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site-config";
import useGetFullUser from "@/hooks/use-full-user";
import useUserSubscription from "@/hooks/use-subscription";
import { makePayment } from "@/lib/chapa/initate";
import { Plan, getPlans } from "@/lib/chapa/plans";
import firebase_app from "@/lib/firebase/firebase-client";
import { cn, nFormat } from "@/lib/utils";
import { Tab, Tabs } from "@nextui-org/react";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const db = firebase_app ? getFirestore(firebase_app) : undefined;

export const UpgradeTab = () => {
  const { user } = useAuthContext();
  const { userAccountData } = useGetFullUser();
  const { userData } = useUserSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [yearly, setIsYearly] = useState(false);

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
  const plans = getPlans(userAccountData?.role ?? "parent");
  return (
    <Tabs
      aria-label="Options"
      variant="solid"
      size="lg"
      radius="full"
      classNames={{
        tabList: "bg-brand-green rounded-full w-full",
        tabContent:
          "group-data-[selected=true]:text-[#68b946] text-[#ffffff] font-bold md:text-xl px-4",
      }}
      onSelectionChange={(key) => setIsYearly(key === "yearly")}
    >
      <Tab key="/monthly" title="Monthly">
        <div className=" flex flex-col md:flex-row md:items-center gap-12 py-6 md:py-20">
          {plans.map((plan) => {
            const isCurrent =
              plan.name.toLowerCase() === userData?.subscription.toLowerCase();
            return (
              <Card
                key={plan.name}
                className={cn(
                  "flex-grow flex flex-col justify-between text-xs md:text-base",
                  plan.name === "Standard" && " border border-brand-orange/20 "
                )}
              >
                <CardHeader>
                  <CardTitle className=" md:flex-row flex-col text-xl flex gap-2 md:items-center justify-between">
                    {plan.name}
                    <p className=" text-orange-600 text-sm">
                      {isCurrent && "Current"}
                    </p>
                  </CardTitle>
                  <CardDescription className=" break-words overflow-hidden text-xs md:text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <div>
                  <CardContent>
                    <CardTitle className=" md:text-xl text-base">
                      ETB {nFormat(plan.price.monthly)}
                    </CardTitle>
                    <CardDescription>
                      <div>
                        <p>- {plan.quota.studentCount} Students</p>
                      </div>
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="text-xs md:text-base"
                      onClick={() => subscribeToPlan(plan)}
                      disabled={isLoading || isCurrent}
                    >
                      Choose Plan
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      </Tab>
      <Tab key="/yearly" title="Annual">
        <div className=" flex items-center gap-12 py-20">
          {plans.map((plan) => {
            const isCurrent =
              plan.name.toLowerCase() === userData?.subscription.toLowerCase();
            return (
              <Card
                key={plan.name}
                className={cn(
                  "flex-grow flex flex-col justify-between text-xs md:text-base",
                  plan.name === "Standard" && " border border-brand-orange/20 "
                )}
              >
                <CardHeader>
                  <CardTitle className=" md:flex-row flex-col text-xl flex gap-2 md:items-center justify-between">
                    {plan.name}
                    <p className=" text-orange-600 text-sm">
                      {isCurrent && "Current"}
                    </p>
                  </CardTitle>
                  <CardDescription className=" break-words overflow-hidden text-xs md:text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <div>
                  <CardContent>
                    <CardTitle className=" md:text-xl text-base">
                      ETB {nFormat(plan.price.yearly)}
                    </CardTitle>
                    <CardDescription>
                      <div>
                        <p>- {plan.quota.studentCount} Students</p>
                      </div>
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="text-xs md:text-base"
                      onClick={() => subscribeToPlan(plan)}
                      disabled={isLoading || isCurrent}
                    >
                      Choose Plan
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      </Tab>
    </Tabs>
  );
};
