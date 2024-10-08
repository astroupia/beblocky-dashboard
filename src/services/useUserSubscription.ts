/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useAuthContext } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "@/lib/firebaseClient";
import { FirebaseApp } from "firebase/app";
import useGetUser from "./useGetUser";

interface UserSubscriptionData {
  email: string;
  expiry_date: Date;
  subscription: string;
  tx_ref: string;
  uid: string;
  verified: boolean;
}

const useUserSubscription = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserSubscriptionData>();
  const [isLoading, setLoading] = useState(true);
  const { isLoading: userAccountDataLoading, userAccountData } = useGetUser();

  useEffect(() => {
    if (user && userAccountData) {
      const fetchUserSubscription = async () => {
        const userId =
          userAccountData.role === "Student"
            ? userAccountData.parentId
            : user.uid;
        const db = getFirestore(firebase_app as FirebaseApp);
        const userSubscriptionsRef = doc(
          db,
          "UserSubscriptions",
          userId as string
        );

        try {
          const docSnap = await getDoc(userSubscriptionsRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const userFetchedData: UserSubscriptionData = {
              email: data.email as string,
              expiry_date: data.expiry_date
                ? (data.expiry_date as Date)
                : new Date(),
              subscription: data.subscription as string,
              tx_ref: data.tx_ref as string,
              uid: data.uid as string,
              verified: data.verified as boolean,
            };
            setUserData(userFetchedData);
          } else {
            setUserData(undefined);
          }
        } catch (error) {
          setUserData(undefined);
        } finally {
          setLoading(false);
        }
      };

      fetchUserSubscription().catch((error) => {
        console.error("Failed to fetch user subscription:", error);
      });
    } else {
      setLoading(false);
      setUserData(undefined);
    }
  }, [user, userAccountData]);

  return { userData, isLoading };
};

export default useUserSubscription;
