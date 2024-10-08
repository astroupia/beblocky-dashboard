/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Head from "next/head";

import TopBar from "@/components/topbar";
import { useAuthContext } from "@/components/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import usePayment, {
  UserPaymentData,
  subscriptionPlans,
} from "@/services/usePayment";
import { useState, useEffect } from "react";
import SubscriptionCard from "@/components/subscription-card";
import useUserSubscription from "@/services/useUserSubscription";

export const monthlySubscriptionPlans = {
  1000: subscriptionPlans[1000],
  2500: subscriptionPlans[2500],
  5000: subscriptionPlans[5000],
};

export const yearlySubscriptionPlans = {
  10_000: subscriptionPlans[10_000],
  25_000: subscriptionPlans[25_000],
  50_000: subscriptionPlans[50_000],
};

export default function UpgradePage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { isLoading, isSuccess, checkoutUrl, makePayment } = usePayment();
  const [checkedOut, setCheckedOut] = useState(false);
  const { userData, isLoading: userDataLoading } = useUserSubscription();

  const handleBuyClick = (price: string) => {
    void onBuyClick(price);
  };

  const onBuyClick = async (price: string) => {
    if (user == null) return;
    const paymentData: UserPaymentData = {
      first_name: user.displayName?.split(" ")[0] || "First Name",
      last_name: user.displayName?.split(" ")[1] || "Last Name",
      amount: parseInt(price),
      email: user.email || "email@email.com",
      return_url: "https://beb-blocky-ide-kxez.vercel.app" + "/upgrade",
    };
    try {
      await makePayment(paymentData);
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    if (isSuccess && !checkedOut) {
      setCheckedOut(true);
      console.log(checkoutUrl);
      router.push(checkoutUrl).catch((error) => {
        console.error("Navigation failed:", error);
        // Handle the error appropriately
      });
    }
  }, [isSuccess, checkedOut, checkoutUrl, router]);

  if (isLoading)
    return (
      <p className="text-center text-2xl font-semibold text-dark-ebony">
        Payment is being processed, you&apos;ll be redirected to Chapa once we
        are done...
      </p>
    );
  if (userDataLoading)
    return (
      <p className="text-center text-2xl font-semibold text-dark-ebony">
        Getting your data...
      </p>
    );
  return (
    <>
      <Head>
        <title>BeBlocky Dashboard</title>
        <meta name="description" content="Welcome to BeBlocky Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="ml-8 grid items-center gap-4 pb-4 pt-2 text-dark-ebony md:py-5">
        <TopBar name={user?.displayName as string} />
        <div className="text-center">
          <h1 className="text-4xl font-bold">Best Plans for you</h1>
          <p>
            You can upgrade your subscription plan at any time for additional
            features.
          </p>
        </div>
        <Tabs defaultValue="monthly" className="mb-20">
          <TabsList className="grid grid-cols-2 justify-center rounded-3xl bg-apple text-white lg:mx-[400px]">
            <TabsTrigger
              className="rounded-3xl px-12 data-[state=active]:text-apple"
              value="monthly"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              className="rounded-3xl px-12 data-[state=active]:text-apple"
              value="yearly"
            >
              Yearly
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <div className="mx-5 mt-10 grid w-fit grid-cols-1 place-items-center gap-8 text-center lg:grid-cols-3">
              {Object.entries(monthlySubscriptionPlans).map(
                ([price, planName]) => (
                  <SubscriptionCard
                    key={price}
                    onAction={() => handleBuyClick(price)}
                    price={price}
                    isPremium={price === "2500"}
                    name={planName ? planName : ""}
                    isOwened={planName == userData?.subscription}
                    isMonthly={true}
                    isVerified={userData?.verified!}
                    expiry_date={userData?.expiry_date!}
                  />
                )
              )}
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div className="mx-5 mt-10 grid w-fit grid-cols-1 place-items-center gap-8 text-center lg:grid-cols-3">
              {Object.entries(yearlySubscriptionPlans).map(
                ([price, planName]) => (
                  <SubscriptionCard
                    key={price}
                    onAction={() => handleBuyClick(price)}
                    price={price}
                    isPremium={price === "25000"}
                    name={planName ? planName : ""}
                    isOwened={planName == userData?.subscription}
                    isMonthly={false}
                    isVerified={userData?.verified!}
                    expiry_date={userData?.expiry_date!}
                  />
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
