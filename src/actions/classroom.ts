"use server";

import { customInitApp } from "@/lib/firebase/firebase-admin";
import firebase_app from "@/lib/firebase/firebase-client";
import { doc, getDoc, getFirestore } from "firebase/firestore";

customInitApp();
const db = getFirestore(firebase_app);

export async function getClassroom(uid: string) {
  const classroom = await getDoc(doc(db, "classrooms", uid));
  const data = classroom.data();
  console.log(data);
  return data as { userId: string };
}
