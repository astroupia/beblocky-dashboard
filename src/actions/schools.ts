"use server";

import { customInitApp } from "@/lib/firebase/firebase-admin";
import firebase_app from "@/lib/firebase/firebase-client";
import { Classroom, Student, User } from "@/types";
import { auth } from "firebase-admin";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { cookies } from "next/headers";

customInitApp();
const db = firebase_app ? getFirestore(firebase_app) : undefined;

export async function getSchools() {
  const session = cookies().get("session")?.value || "";
  if (!session) {
    throw "Session not found";
  }
  const decodedClaims = await auth().verifySessionCookie(session, true);
  const { uid } = decodedClaims;
  if (!db) {
    throw "Database doesn't exist";
  }
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const user = userSnap.data() as User;
    if (user.role === "school") {
      const q = query(collection(db, "classrooms"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const data = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const studentsQuery = query(
            collection(db, "students"),
            where("classroom", "==", doc.id)
          );
          const studentsSnap = await getDocs(studentsQuery);
          const students = studentsSnap.docs.map(
            (doc) => ({ ...doc.data() } as Student)
          );
          const classrooms = { ...(doc.data() as Classroom), uid: doc.id };
          // console.log({
          //   students,
          // });
          return {
            classRoom: classrooms,
            students: students.map((s) => ({
              ...s,
              courses: [...s.courses!, ...classrooms.courses],
            })),
          };
        })
      );
      return data;
    }
    return null;
  }
  throw "User Doesn't Exist";
}

export const addClass = async (
  userId: string,
  name: string,
  courses: string[]
) => {
  if (!db) {
    throw Error("Db Isn't here");
  }
  const res = await addDoc(collection(db, "classrooms"), {
    name,
    userId,
    courses,
  });
  console.log(res.id);
};

export const editClass = async (
  uid: string,
  userId: string,
  name: string,
  courses: string[]
) => {
  if (!db) {
    throw Error("Db Isn't here");
  }
  const ref = doc(db, "classrooms", uid);
  const res = await setDoc(ref, {
    name,
    userId,
    courses,
  });
};

export const getClasses = async (userId: string) => {
  if (!db) {
    throw Error("Db Isn't here");
  }
  const docRef = doc(db, "Classes", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};
