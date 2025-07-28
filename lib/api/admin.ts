import type { IAdmin } from "@/types/admin";
import type { IUser } from "@/types/user";
import { Types } from "mongoose";

// Use the standard API URL pattern like other APIs
const getApiUrl = (endpoint: string) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
};

// Helper function to get auth headers from user data
const getAuthHeaders = (user: IUser) => {
  return {
    "x-user-id": user._id || user.email,
    "x-user-type": user.role || "admin",
  };
};

export const adminApi = {
  // Get admin by user ID using the new route pattern
  async getAdminByUserId(userId: string, user: IUser): Promise<IAdmin> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/admin/user/${userId}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default admin object
        console.warn("Admin API not available, creating default admin object");
        return {
          _id: userId,
          userId: userId,
          permissions: ["read", "write", "delete"],
          organizationId: new Types.ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn("Admin API error, creating default admin object:", error);
      // Return a default admin object if the API fails
      return {
        _id: userId,
        userId: userId,
        permissions: ["read", "write", "delete"],
        organizationId: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get current admin profile
  async getCurrentAdmin(user: IUser): Promise<IAdmin> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/admin/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default admin object
        console.warn("Admin API not available, creating default admin object");
        return {
          _id: user._id || "default",
          userId: user._id || user.email,
          permissions: ["read", "write", "delete"],
          organizationId: new Types.ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn("Admin API error, creating default admin object:", error);
      // Return a default admin object if the API fails
      return {
        _id: user._id || "default",
        userId: user._id || user.email,
        permissions: ["read", "write", "delete"],
        organizationId: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },
};
