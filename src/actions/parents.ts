"use server";

import { Course } from "@/hooks/user-courses";
import { COURSE_URL } from "@/lib/constant";
import firebase_app from "@/lib/firebase/firebase-client";
import { Classroom, Student, User } from "@/types";
import { auth } from "firebase-admin";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { cookies } from "next/headers";

export async function getDashboardData() {
  const session = cookies().get("session")?.value;

  if (!session) {
    console.error("Session not found");
    throw new Error("Session not found");
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);
  const { uid } = decodedClaims;
  const db = firebase_app ? getFirestore(firebase_app) : undefined;

  if (!db) {
    console.error("Database doesn't exist");
    throw new Error("Database doesn't exist");
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.error("User doesn't exist");
    throw new Error("User doesn't exist");
  }

  const user = userSnap.data() as User;
  console.log("User found:", user);

  if (user.role === "parent") {
    const studentsSnap = await getDocs(
      query(collection(db, "students"), where("parentId", "==", uid))
    );
    const students = studentsSnap.docs.map(
      (doc) => ({ ...doc.data() } as Student)
    );
    console.log("Students found:", students);
    return { student: students, role: user.role };
  }

  if (user.role === "school") {
    console.log("User role is school");
    return { role: user.role };
  }

  const studentSnap = await getDocs(
    query(collection(db, "students"), where("userId", "==", user.uid))
  );
  const student = studentSnap.docs[0]?.data() as Student;

  if (!student) {
    console.error("No student found for user");
    return null;
  }

  const classroomSnap = await getDoc(doc(db, "classrooms", student.classroom));
  const classroom = classroomSnap.data() as Classroom;

  console.log("Classroom found:", classroom);
  return { role: "student", student, classroom };
}

export async function addCourseToClass(classroomId: string, courseId: number) {
  try {
    const db = firebase_app ? getFirestore(firebase_app) : undefined;
    if (!db) {
      throw "Database doesn't exist";
    }

    const classroomRef = doc(db, "classrooms", classroomId);
    await updateDoc(classroomRef, {
      courses: arrayUnion(courseId),
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding course to class:", error);
    return { error: "Failed to add course to class" };
  }
}

export async function getClassrooms() {
  try {
    const db = firebase_app ? getFirestore(firebase_app) : undefined;
    if (!db) {
      throw "Database doesn't exist";
    }

    const classroomsSnap = await getDocs(collection(db, "classrooms"));
    const classrooms = classroomsSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      courses: doc.data().courses || [],
      userId: doc.data().userId,
    }));

    return classrooms;
  } catch (error) {
    console.error("Error retrieving classrooms:", error);
    return [];
  }
}

export async function getClassroomsByUserId(userId: string) {
  try {
    const db = firebase_app ? getFirestore(firebase_app) : undefined;
    if (!db) {
      throw "Database doesn't exist";
    }

    const q = query(
      collection(db, "classrooms"),
      where("userId", "==", userId)
    );
    const classroomsSnap = await getDocs(q);
    const classrooms = classroomsSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      courses: doc.data().courses || [],
      userId: doc.data().userId,
    }));

    return classrooms;
  } catch (error) {
    console.error("Error retrieving classrooms:", error);
    return [];
  }
}
