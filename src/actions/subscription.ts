import { Plan } from "@/lib/chapa/plans";
import firebase_app from "@/lib/firebase/firebase-client";
import { FirebaseApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export async function addSubscription({
  userId,
  plan,
  yearly,
  paymentInfo: { email, txRef, verified },
}: {
  userId: string;
  plan: Plan;
  yearly?: boolean;
  paymentInfo: {
    txRef: string;
    email: string;
    verified?: boolean;
  };
}) {
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Invalid userId: userId must be a non-empty string.");
  }

  console.log(`Creating subscription for userId: ${userId}`); // Log the userId for debugging

  const firestore = getFirestore(firebase_app as FirebaseApp);
  const userSubscriptionsRef = doc(firestore, "UserSubscriptions", userId); // Ensure userId is passed as the document ID

  await setDoc(userSubscriptionsRef, {
    uid: userId,
    subscription: plan.name,
    tx_ref: txRef,
    email,
    verified: verified ?? false,
    expiry_date: yearly
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
