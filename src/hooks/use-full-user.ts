import { useAuthContext } from "@/components/context/auth-context";
import firebase_app from "@/lib/firebase/firebase-client";
import { FirebaseApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

type UserAccountData = {
  role: "parent" | "student" | "school";
  parentId: string;
};
const useGetFullUser = () => {
  const { user } = useAuthContext();
  const [userAccountData, setUserAccountData] = useState<UserAccountData>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserAccountData = async () => {
        const db = getFirestore(firebase_app as FirebaseApp);
        const userRef = doc(db, "users", user.uid);

        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserAccountData(data as UserAccountData);
          } else {
            setUserAccountData(undefined);
          }
        } catch (error) {
          setUserAccountData(undefined);
        } finally {
          setLoading(false);
        }
      };
      fetchUserAccountData();
    } else {
      setLoading(false);
      setUserAccountData(undefined);
    }
  }, [user]);

  return { userAccountData, isLoading };
};

export default useGetFullUser;
