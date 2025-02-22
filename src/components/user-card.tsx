"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "./context/auth-context";
import { Button } from "./ui/button";
import useUserSubscription from "@/hooks/use-subscription";
import { Badge } from "./ui/badge";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-auth";
import { Label } from "./ui/label";
import useGetFullUser from "@/hooks/use-full-user";
import { UserAvatar } from "./user-avatar";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Function to fetch student info, returning null if not found
const fetchStudentById = async (id: string) => {
  try {
    const db = getFirestore();
    const studentRef = doc(db, "students", id);
    const studentInfo = await getDoc(studentRef);

    if (!studentInfo.exists()) {
      return null; // Return null if the student is not found
    }
    return studentInfo.data();
  } catch (error) {
    console.error("Error fetching student info:", error);
    return null;
  }
};

export const UserButton: React.FC = () => {
  const { user } = useAuthContext();
  const { userAccountData } = useGetFullUser();
  const { userData } = useUserSubscription();
  const [studentParentId, setStudentParentId] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  async function signOutUser() {
    await signOut(auth);
    await fetch("/api/sign-out", {
      method: "POST",
    });
    router.push("/");
  }

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (userAccountData?.role === "student") {
        const studentInfo = await fetchStudentById(
          userAccountData.parentId ?? ""
        );
        if (studentInfo) {
          setStudentParentId(studentInfo.parentId);
        } else {
          console.warn("Student not found"); // Handle case where student is not found
        }
      }
    };
    fetchStudentInfo();
  }, [userAccountData]);

  return (
    <div className="absolute inset-x-0 pt-4 bottom-0 flex items-center  border-t border-orange-400 gap-4 px-6 py-3 hover:cursor-pointer">
      <div className=" flex flex-col items-center gap-2">
        <UserAvatar className=" w-16 h-16" />
        <Badge
          className=" font-bold"
          variant={
            userData?.subscription === "Gold"
              ? "default"
              : userData?.subscription === "Premium"
              ? "default"
              : userData?.subscription === "Standard"
              ? "secondary"
              : "outline"
          }
        >
          {userAccountData?.role === "student" &&
          studentParentId === "lXuBzDgrMYOjzUFO1ynkXAekNWf2"
            ? "Free"
            : "Free"}
        </Badge>
      </div>
      <div className=" flex flex-col gap-2">
        <div>
          <div className=" flex flex-col my-2">
            <p className="text-lg font-semibold">{user?.displayName}</p>
            <div className=" flex items-center gap-2">
              <Label className=" font-medium">{userAccountData?.role}</Label>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className=" gap-2"
          onClick={signOutUser}
        >
          Sign Out
          <LogOutIcon size={14} />
        </Button>
      </div>
    </div>
  );
};
