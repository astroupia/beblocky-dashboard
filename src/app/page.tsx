"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the sign-in page
    router.push("/sign-in");
  }, [router]);

  return null; // Optionally return null or a loading indicator
};

export default Page;
