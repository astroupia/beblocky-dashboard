"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import app from "@/lib/firebase/firebase-client";

const auth = getAuth(app);

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return null;
};

export default Page;
