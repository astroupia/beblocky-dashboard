import React from "react";
import nookies from "nookies";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import firebase_app from "@/lib/firebaseClient";
import { useRouter } from "next/router";

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext<{ user: User | null }>({
  user: null,
});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const handleAuthStateChange = (user: User | null) => {
      const processAuthState = async () => {
        if (user) {
          try {
            const token = await user.getIdToken();
            setUser(user);
            nookies.set(undefined, "token", token, { path: "/" });
          } catch (error) {
            console.error("Failed to get user token:", error);
          }
        } else {
          setUser(null);
          nookies.set(undefined, "token", "", { path: "/" });
          try {
            await router.push("/register");
          } catch (error) {
            console.error("Failed to redirect to register:", error);
          }
        }
        setLoading(false);
      };

      processAuthState().catch(console.error);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
