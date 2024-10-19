"use client";
import { cn } from "@/lib/utils";
import { useAuthContext } from "./context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const UserAvatar = ({
  className,
  profile,
}: {
  className?: string;
  profile?: {
    photoURL?: string;
    displayName: string;
    role?: string;
    parent?: string;
    parentId?: string;
  };
}) => {
  const { user: currentUser } = useAuthContext();
  const user = profile ?? currentUser;
  const [studentParentId, setStudentParentId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (profile?.role === "student") {
        // Fetch student info using the new function
        const studentInfo = await fetchStudentById(profile.parentId ?? ""); // {{ edit_1 }}: Updated to use fetchStudentById with parentId
        setStudentParentId(studentInfo.parentId); // Assuming parentId is part of the returned data
      }
    };
    fetchStudentInfo();
  }, [user]);

  return (
    <Avatar className={cn("w-8 h-8", className)}>
      {user?.photoURL ? (
        <AvatarImage
          src={user.photoURL}
          alt={user.displayName ?? "Profile picture"}
        />
      ) : null}
      <AvatarFallback
        className={cn(
          "flex items-center justify-center w-8 h-8 overflow-hidden border border-orange-400 text-gray-700 bg-gray-100 rounded-full",
          className
        )}
      >
        {(user?.displayName ?? "U").slice(0, 2).toUpperCase()}
        {profile?.role === "student" &&
        profile?.parentId === studentParentId ? (
          <span className="text-sm text-green-500">Free</span>
        ) : null}
      </AvatarFallback>
    </Avatar>
  );
};

// Mock function to simulate fetching student info
const fetchStudentById = async (id: string) => {
  const db = getFirestore(); // {{ edit_2 }}: Initialize Firestore
  const studentRef = doc(db, "students", id); // {{ edit_3 }}: Create a reference to the student document
  const studentInfo = await getDoc(studentRef); // {{ edit_4 }}: Use getDoc to fetch the document

  if (!studentInfo.exists()) {
    throw new Error("Student not found");
  }
  return studentInfo.data(); // Assuming the data is in the expected format
};
