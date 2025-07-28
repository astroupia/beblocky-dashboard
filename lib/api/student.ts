import type { IStudent } from "@/types/student";
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
    "x-user-type": user.role || "student",
  };
};

export const studentApi = {
  // Get student by email
  async getStudentByEmail(email: string, user: IUser): Promise<IStudent> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/students/email/${email}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default student object
        console.warn(
          "Student API not available, creating default student object for email"
        );
        return {
          _id: email,
          userId: email,
          dateOfBirth: new Date(),
          grade: 1,
          gender: "other" as any,
          enrolledCourses: [],
          coins: 0,
          codingStreak: 0,
          lastCodingActivity: new Date(),
          totalCoinsEarned: 0,
          totalTimeSpent: 0,
          goals: [],
          subscription: "free",
          section: "A",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Student API error, creating default student object for email:",
        error
      );
      // Return a default student object if the API fails
      return {
        _id: email,
        userId: email,
        dateOfBirth: new Date(),
        grade: 1,
        gender: "other" as any,
        enrolledCourses: [],
        coins: 0,
        codingStreak: 0,
        lastCodingActivity: new Date(),
        totalCoinsEarned: 0,
        totalTimeSpent: 0,
        goals: [],
        subscription: "free",
        section: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get student by user ID using the new route pattern
  async getStudentByUserId(userId: string, user: IUser): Promise<IStudent> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl(`/student/user/${userId}`), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default student object
        console.warn(
          "Student API not available, creating default student object"
        );
        return {
          _id: userId,
          userId: userId,
          dateOfBirth: new Date(),
          grade: 1,
          gender: "other" as any,
          enrolledCourses: [],
          coins: 0,
          codingStreak: 0,
          lastCodingActivity: new Date(),
          totalCoinsEarned: 0,
          totalTimeSpent: 0,
          goals: [],
          subscription: "free",
          section: "A",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Student API error, creating default student object:",
        error
      );
      // Return a default student object if the API fails
      return {
        _id: userId,
        userId: userId,
        dateOfBirth: new Date(),
        grade: 1,
        gender: "other" as any,
        enrolledCourses: [],
        coins: 0,
        codingStreak: 0,
        lastCodingActivity: new Date(),
        totalCoinsEarned: 0,
        totalTimeSpent: 0,
        goals: [],
        subscription: "free",
        section: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Get current student profile
  async getCurrentStudent(user: IUser): Promise<IStudent> {
    try {
      const authHeaders = getAuthHeaders(user);
      const response = await fetch(getApiUrl("/student/me"), {
        headers: authHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        // If the API is not available, create a default student object
        console.warn(
          "Student API not available, creating default student object"
        );
        return {
          _id: user._id || "default",
          userId: user._id || user.email,
          dateOfBirth: new Date(),
          grade: 1,
          gender: "other" as any,
          enrolledCourses: [],
          coins: 0,
          codingStreak: 0,
          lastCodingActivity: new Date(),
          totalCoinsEarned: 0,
          totalTimeSpent: 0,
          goals: [],
          subscription: "free",
          section: "A",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Student API error, creating default student object:",
        error
      );
      // Return a default student object if the API fails
      return {
        _id: user._id || "default",
        userId: user._id || user.email,
        dateOfBirth: new Date(),
        grade: 1,
        gender: "other" as any,
        enrolledCourses: [],
        coins: 0,
        codingStreak: 0,
        lastCodingActivity: new Date(),
        totalCoinsEarned: 0,
        totalTimeSpent: 0,
        goals: [],
        subscription: "free",
        section: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },
};
