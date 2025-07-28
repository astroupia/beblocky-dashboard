import type { IOrganization } from "@/types/organization";
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
    "x-user-type": user.role || "organization",
  };
};

export const organizationApi = {
  // Get organization by user ID using the new route pattern
  async getOrganizationByUserId(
    userId: string,
    user: IUser
  ): Promise<IOrganization> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/organization/user/${userId}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default organization object
        console.warn(
          "Organization API not available, creating default organization object"
        );
        return {
          _id: userId,
          name: "Default Organization",
          type: "school" as any,
          status: "active" as any,
          description: "Default organization",
          website: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          contactInfo: {
            email: user.email,
            phone: "",
            contactPerson: user.name,
          },
          subscription: new Types.ObjectId(),
          teachers: [],
          students: [],
          courses: [],
          classes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Organization API error, creating default organization object:",
        error
      );
      // Return a default organization object if the API fails
      return {
        _id: userId,
        name: "Default Organization",
        type: "school" as any,
        status: "active" as any,
        description: "Default organization",
        website: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        contactInfo: {
          email: user.email,
          phone: "",
          contactPerson: user.name,
        },
        subscription: new Types.ObjectId(),
        teachers: [],
        students: [],
        courses: [],
        classes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get current organization profile
  async getCurrentOrganization(user: IUser): Promise<IOrganization> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/organization/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default organization object
        console.warn(
          "Organization API not available, creating default organization object"
        );
        return {
          _id: user._id || "default",
          name: "Default Organization",
          type: "school" as any,
          status: "active" as any,
          description: "Default organization",
          website: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          contactInfo: {
            email: user.email,
            phone: "",
            contactPerson: user.name,
          },
          subscription: new Types.ObjectId(),
          teachers: [],
          students: [],
          courses: [],
          classes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Organization API error, creating default organization object:",
        error
      );
      // Return a default organization object if the API fails
      return {
        _id: user._id || "default",
        name: "Default Organization",
        type: "school" as any,
        status: "active" as any,
        description: "Default organization",
        website: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        contactInfo: {
          email: user.email,
          phone: "",
          contactPerson: user.name,
        },
        subscription: new Types.ObjectId(),
        teachers: [],
        students: [],
        courses: [],
        classes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },
};
