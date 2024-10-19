"use server";

import { customInitApp } from "@/lib/firebase/firebase-admin";
import firebase_app from "@/lib/firebase/firebase-client";
import { Classroom, Student } from "@/types";
import { auth } from "firebase-admin";
import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { addSubscription } from "@/actions/subscription"; // Import the addSubscription function

customInitApp();

const db = getFirestore(firebase_app as FirebaseApp);

export async function createChild({
  email,
  password,
  displayName,
  parentId,
  classroom,
  username,
}: {
  email: string;
  password: string;
  displayName: string;
  parentId: string;
  classroom?: string;
  username: string;
}) {
  console.log({
    email,
    password,
    displayName,
    parentId,
    classroom,
    username,
  });
  const createdUser = await auth().createUser({
    email: email,
    emailVerified: false,
    password,
    displayName,
  });
  await createStudent({
    parentId,
    classroom,
    studentUsername: username,
    studentId: createdUser.uid,
    studentEmail: createdUser.email as string,
    studentName: createdUser.displayName as string,
  });
}

export async function createStudent({
  parentId,
  classroom,
  studentId,
  studentName,
  studentEmail,
  studentUsername,
}: {
  parentId: string;
  classroom?: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  studentUsername: string;
}) {
  await setDoc(doc(db, "users", studentId), {
    uid: studentId,
    email: studentEmail,
    name: studentName,
    role: "student",
    credit: 0,
    parentId,
    classId: classroom,
    userName: studentUsername,
  });
  await setDoc(doc(db, "students", studentId), {
    name: studentName,
    email: studentEmail,
    classroom: classroom,
    courses: [""],
    parentId,
    userId: studentId,
    userName: studentUsername,
  });

  // Check if the student is created without a class code and parentId
  if (!parentId) {
    // Ensure userId is valid before calling addSubscription
    if (studentId) {
      // Automatically assign a free subscription
      await addSubscription({
        userId: studentId,
        plan: {
          name: "Free",
          price: {
            monthly: 0,
            yearly: 0,
          },
          quota: {
            studentCount: 0,
          },
          description: "Access to basic features",
        },
        paymentInfo: {
          txRef: "auto-generated-ref", // You can generate a unique reference here
          email: studentEmail,
          verified: true, // Set to true if you want to mark it as verified
        },
      });

      // {{ edit_1 }}: Assign the course after subscription
      // const coursesToAssign = ["64c6bf88588e55011314a3c3"]; // {{ edit_2 }}: Changed to an array
      // await addCourse(studentId, coursesToAssign); // Assign the courses
    } else {
      console.error("Cannot create subscription: Invalid studentId.");
    }
  }
}

export const getUserByEmail = async (
  email: string,
  newClassCode: string // {{ edit_2 }}: Added parameter for dynamic class code
): Promise<{ error: string; data: null } | { data: User }> => {
  const user = await auth().getUserByEmail(email);
  const userRef = doc(db, "users", user.uid);
  const docSnap = (await getDoc(userRef)).data();
  if (docSnap) {
    if (docSnap.role !== "student")
      return {
        error: "The user found associated email isn't student.",
        data: null,
      };
    if (docSnap.parentId)
      return { error: "Already assigned to another class!", data: null };

    // {{ edit_3 }}
    if (docSnap.classId === "PhldhtU6vVDeTMej1Ub8") {
      await updateDoc(userRef, { classId: newClassCode }); // Use the dynamic parameter
    }
    // {{ edit_4 }}
  }
  return { data: user.toJSON() as User };
};

export const addCourse = async (studentId: string, courses: string[]) => {
  await updateDoc(doc(db, "students", studentId), {
    courses,
  });

  await Promise.allSettled(
    courses.map((course) => {
      if (!studentId) {
        console.error("Invalid studentId:", studentId);
        return; // Skip if studentId is invalid
      }
      setDoc(doc(db, "studentCourses", studentId, course), {
        // Ensure this path is valid
        courseId: course,
        progress: 0,
        slideIndex: 0,
        coins: 0,
      });
    })
  );
};

export const getUser = async (userId: string) => {
  const user = await auth().getUser(userId);
  const ref = doc(db, "students", userId);
  const students = (await getDoc(ref)).data() as Student;
  const classroom = (
    await getDoc(doc(db, "classrooms", students.classroom))
  ).data() as Classroom;
  return { ...user, ...students, classroom };
};
