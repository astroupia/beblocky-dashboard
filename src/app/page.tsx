"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = cookies().get("session")?.value;

    if (!session) {
      router.push("/sign-in");
    } else {
      console.log("User is authenticated");
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default Page;
