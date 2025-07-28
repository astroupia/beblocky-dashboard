import type { ITeacher } from "@/types/teacher";
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
    "x-user-type": user.role || "teacher",
  };
};

export const teacherApi = {
  // Create teacher from user ID
  async createTeacherFromUser(userId: string, user: IUser): Promise<ITeacher> {
    try {
      const authHeaders = getAuthHeaders(user);
      const requestBody = { userId };

      console.log("Creating teacher with payload:", requestBody);
      console.log("Auth headers:", authHeaders);
      console.log("API URL:", getApiUrl("/teachers/from-user"));

      const response = await fetch(getApiUrl("/teachers/from-user"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      console.log("Teacher creation response status:", response.status);
      console.log(
        "Teacher creation response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);

        // Parse error response if it's JSON
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        // Log detailed error information for debugging
        console.error("Detailed API Error Info:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          requestBody: requestBody,
          authHeaders: authHeaders,
          errorData: errorData,
        });

        throw new Error(
          errorData.message || `Failed to create teacher: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Teacher created successfully:", result);
      return result;
    } catch (error) {
      console.error("Teacher API error:", error);
      throw error;
    }
  },

  // Get teacher by user ID using the new route pattern
  async getTeacherByUserId(userId: string, user: IUser): Promise<ITeacher> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/teacher/user/${userId}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);

        // Parse error response if it's JSON
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        // If it's a 404, the teacher doesn't exist
        if (response.status === 404) {
          throw new Error("Teacher not found");
        }

        throw new Error(
          errorData.message || `Failed to get teacher: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Teacher retrieved successfully:", result);
      return result;
    } catch (error) {
      console.error("Teacher API error:", error);
      throw error; // Re-throw the error instead of returning mock data
    }
  },

  // Get current teacher profile
  async getCurrentTeacher(user: IUser): Promise<ITeacher> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/teacher/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default teacher object
        console.warn(
          "Teacher API not available, creating default teacher object"
        );
        return {
          _id: user._id || "default",
          userId: user._id || user.email,
          qualifications: [],
          availability: new Map(),
          rating: [],
          courses: [],
          organizationId: new Types.ObjectId(),
          languages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Teacher API error, creating default teacher object:",
        error
      );
      // Return a default teacher object if the API fails
      return {
        _id: user._id || "default",
        userId: user._id || user.email,
        qualifications: [],
        availability: new Map(),
        rating: [],
        courses: [],
        organizationId: new Types.ObjectId(),
        languages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },
};
