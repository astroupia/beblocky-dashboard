import { useSession } from "@/lib/auth-client";
import { IUser } from "@/types/user";

export function useAuth() {
  const session = useSession();

  return {
    user: session?.data?.user as IUser | undefined,
    isLoading: session?.isPending || false,
    isAuthenticated: !!session?.data?.user,
    session: session?.data,
    error: session?.error,
  };
}
