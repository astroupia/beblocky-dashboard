"use server";

import firebase_app from "@/lib/firebase/firebase-client";
import { Progress } from "@/types";
import { FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore(firebase_app as FirebaseApp);

const PROGRESS_COLLECTION = "progress";

export async function getStudentProgress(
  userId: string
): Promise<Progress | null> {
  const docRef = doc(db, PROGRESS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Progress;
  }
  return null;
}

export async function updateHoursSpent(userId: string, hours: number) {
  const docRef = doc(db, PROGRESS_COLLECTION, userId);
  await updateDoc(docRef, {
    hoursSpent: hours,
    lastUpdated: new Date(),
  });
}

export async function addAchievement(userId: string, achievement: any) {
  const docRef = doc(db, PROGRESS_COLLECTION, userId);
  const current = await getDoc(docRef);
  const data = current.data() as Progress;

  await updateDoc(docRef, {
    achievements: [...(data.achievements || []), achievement],
    lastUpdated: new Date(),
  });
}

export async function initializeProgress(userId: string) {
  const docRef = doc(db, PROGRESS_COLLECTION, userId);
  const initialData: Progress = {
    userId,
    hoursSpent: 0,
    coinsEarned: 0,
    achievements: [],
    lastUpdated: new Date(),
  };
  await setDoc(docRef, initialData);
}
