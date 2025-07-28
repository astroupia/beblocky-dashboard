import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple encryption for email addresses
 * Uses base64 encoding with a simple substitution cipher and salt
 */
export function encryptEmail(email: string): string {
  if (!email) return "guest";

  // Add a salt to make it more secure
  const salt = "beblocky_2024";
  const saltedEmail = email + salt;

  // Simple encryption: reverse the string and encode to base64
  const reversed = saltedEmail.split("").reverse().join("");
  const encoded = btoa(reversed);

  // Replace some characters to make it URL-safe
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decrypt email address
 */
export function decryptEmail(encrypted: string): string {
  if (!encrypted || encrypted === "guest") return "guest";

  try {
    // Restore base64 padding and characters
    let restored = encrypted.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (restored.length % 4) {
      restored += "=";
    }

    const decoded = atob(restored);
    const reversed = decoded.split("").reverse().join("");

    // Remove the salt
    const salt = "beblocky_2024";
    const original = reversed.replace(salt, "");

    return original;
  } catch (error) {
    console.error("Failed to decrypt email:", error);
    return "guest";
  }
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}
