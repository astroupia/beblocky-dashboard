import type { IUser } from "@/types/user";

// Use the standard API URL pattern like other APIs
const getApiUrl = (endpoint: string) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/users${endpoint}`;
};

// Helper function to get auth headers from user data
const getAuthHeaders = (user: IUser) => {
  return {
    "x-user-id": user._id || user.email, // Use _id if available, fallback to email
    "x-user-type": user.role || "teacher",
  };
};

export const userApi = {
  // Get user by email (this is the initial call, so we need to create a basic user object)
  async getUserByEmail(email: string): Promise<IUser> {
    try {
      // For the initial call, we create a basic user object with just the email
      const basicUser: IUser = {
        _id: email, // Use email as temporary ID
        email,
        name: "",
        emailVerified: false,
        role: "teacher" as any, // Default to teacher role
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const authHeaders = getAuthHeaders(basicUser);
      const response = await fetch(
        getApiUrl(`/by-email?email=${encodeURIComponent(email)}`),
        {
          headers: authHeaders,
          credentials: "include",
        }
      );

      if (!response.ok) {
        // If the API is not available, return a basic user object
        console.warn("User API not available, creating basic user object");
        return {
          _id: email,
          email,
          name: email.split("@")[0], // Use email prefix as name
          emailVerified: true,
          role: "teacher" as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn("User API error, creating basic user object:", error);
      // Return a basic user object if the API fails
      return {
        _id: email,
        email,
        name: email.split("@")[0], // Use email prefix as name
        emailVerified: true,
        role: "teacher" as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get current user profile
  async getCurrentUser(user: IUser): Promise<IUser> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, return the provided user object
        console.warn("User API not available, returning provided user object");
        return user;
      }

      return response.json();
    } catch (error) {
      console.warn("User API error, returning provided user object:", error);
      // Return the provided user object if the API fails
      return user;
    }
  },
};
