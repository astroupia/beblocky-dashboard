import type { IParent } from "@/types/parent";
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
    "x-user-type": user.role || "parent",
  };
};

export const parentApi = {
  // Get parent by user ID using the new route pattern
  async getParentByUserId(userId: string, user: IUser): Promise<IParent> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/parent/user/${userId}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default parent object
        console.warn(
          "Parent API not available, creating default parent object"
        );
        return {
          _id: userId,
          userId: userId,
          children: [],
          phoneNumber: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
          },
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn("Parent API error, creating default parent object:", error);
      // Return a default parent object if the API fails
      return {
        _id: userId,
        userId: userId,
        children: [],
        phoneNumber: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
        },
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get current parent profile
  async getCurrentParent(user: IUser): Promise<IParent> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/parent/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default parent object
        console.warn(
          "Parent API not available, creating default parent object"
        );
        return {
          _id: user._id || "default",
          userId: user._id || user.email,
          children: [],
          phoneNumber: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
          },
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn("Parent API error, creating default parent object:", error);
      // Return a default parent object if the API fails
      return {
        _id: user._id || "default",
        userId: user._id || user.email,
        children: [],
        phoneNumber: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
        },
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },
};
