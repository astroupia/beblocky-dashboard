"use server";

import { Course } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import firebase_app from "@/lib/firebase/firebase-client";
import { Classroom, Student, User } from "@/types";
import { auth } from "firebase-admin";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { cookies } from "next/headers";

export async function getDashboardData() {
  console.log("Starting getDashboardData function"); // Log start of function
  const session = cookies().get("session")?.value || "";
  if (!session) {
    console.error("Session not found"); // Log if session is not found
    throw "Session not found";
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);
  const { uid } = decodedClaims;
  const db = firebase_app ? getFirestore(firebase_app) : undefined;
  if (!db) {
    console.error("Database doesn't exist"); // Log if database is not initialized
    throw "Database doesn't exist";
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const user = userSnap.data() as User;
    console.log("User found:", user); // Log user data

    if (user.role === "parent") {
      const q = query(collection(db, "students"), where("parentId", "==", uid));
      const studentsSnap = await getDocs(q);
      const students = studentsSnap.docs.map(
        (doc) => ({ ...doc.data() } as Student)
      );
      console.log("Students found:", students); // Log students data
      return {
        student: students,
        role: user.role,
      };
    }

    if (user.role === "school") {
      console.log("User role is school"); // Log user role
      return {
        role: user.role,
      };
    }

    const student = await getDocs(
      query(collection(db, "students"), where("userId", "==", user.uid))
    ).then((res) => res.docs[0]?.data() as Student);

    if (!student) {
      console.error("No student found for user"); // Log if no student found
      return null;
    }

    const classroom = await getDoc(
      doc(db, "classrooms", student.classroom)
    ).then((res) => res.data() as Classroom);

    console.log("Classroom found:", classroom); // Log classroom data
    return {
      role: "student" as const,
      student: student,
      classroom,
    };
  }

  console.error("User Doesn't Exist"); // Log if user doesn't exist
  throw "User Doesn't Exist";
}
