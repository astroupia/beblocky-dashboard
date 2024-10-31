"use client";
import { useEffect, useState } from "react";
import { updateHoursSpent } from "@/actions/progress";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import firebase_app from "@/lib/firebase/firebase-client";
import { FirebaseApp } from "firebase/app";

const db = getFirestore(firebase_app as FirebaseApp);

export function TimeTracker({ userId }: { userId: string }) {
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const trackTime = async () => {
      if (!startTime) {
        setStartTime(new Date());
        return;
      }

      const interval = setInterval(async () => {
        const currentTime = new Date();
        const hoursSpent =
          (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        try {
          // Add a new time entry
          await addDoc(collection(db, "timeEntries"), {
            userId,
            timestamp: currentTime,
            duration: hoursSpent,
          });

          // Calculate total hours
          const timeEntriesRef = collection(db, "timeEntries");
          const q = query(
            timeEntriesRef,
            where("userId", "==", userId),
            orderBy("timestamp", "desc")
          );

          const querySnapshot = await getDocs(q);
          const totalHours = querySnapshot.docs.reduce((acc, doc) => {
            return acc + doc.data().duration;
          }, 0);

          await updateHoursSpent(userId, totalHours);
        } catch (error) {
          console.error("Error updating time:", error);
        }
      }, 5 * 60 * 1000); // Update every 5 minutes

      return () => clearInterval(interval);
    };

    trackTime();
  }, [userId, startTime]);

  return null;
}
