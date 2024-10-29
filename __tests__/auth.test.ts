// Move jest.mock calls to the top, before any other code
jest.mock("@/lib/firebase/firebase-auth", () => ({
  auth: {
    currentUser: null,
    sendPasswordResetEmail: jest.fn(),
  },
}));

jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

import { sendVerificationEmail, handleForgotPassword } from "../auth";
import { auth } from "@/lib/firebase/firebase-auth";
import { toast } from "@/components/ui/use-toast";
import { Auth } from "firebase/auth";

// Define the mock type
type MockAuth = {
  currentUser: null | any;
  sendPasswordResetEmail: jest.Mock;
};

// Create the mock with proper typing
const mockAuth = {
  currentUser: null,
  sendPasswordResetEmail: jest.fn(),
} as MockAuth;

describe("Auth Actions", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("sendVerificationEmail", () => {
    it("should return error when user is not found", async () => {
      const email = "test@example.com";
      const result = await sendVerificationEmail(email);

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "User not found. Please sign in first.",
      });
    });

    it("should send verification email successfully", async () => {
      // Mock currentUser with sendEmailVerification method
      mockAuth.currentUser = {
        sendEmailVerification: jest.fn().mockResolvedValue(undefined),
        email: "test@example.com",
      };

      const email = "test@example.com";
      const result = await sendVerificationEmail(email);

      expect(result.success).toBe(true);
      expect(mockAuth.currentUser.sendEmailVerification).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Verification email sent successfully.",
      });
    });
  });

  describe("handleForgotPassword", () => {
    it("should handle password reset request", async () => {
      const email = "test@example.com";
      const result = await handleForgotPassword(email);

      // Add expectations based on your implementation
      expect(result).toBeDefined();
      // Add more specific assertions based on your implementation
    });

    // Add more test cases for error scenarios
    it("should handle errors during password reset", async () => {
      const email = "test@example.com";
      const errorMessage = "User not found";

      mockAuth.sendPasswordResetEmail.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const result = await handleForgotPassword(email);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    });
  });
});
