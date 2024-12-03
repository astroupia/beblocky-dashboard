import { customInitApp } from "@/lib/firebase/firebase-admin";
import { auth } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "@/lib/schema/auth";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request: NextRequest) {
  try {
    // Check if the request has a body
    if (!request.body) {
      console.error("Request body is missing");
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const body = await request.json(); // Parse the request body
    console.log("Request body:", body); // Log the request body for debugging

    const parsedData = signInSchema.safeParse(body); // Validate against the schema

    if (!parsedData.success) {
      console.error("Validation error:", parsedData.error.errors);
      return NextResponse.json(
        { error: parsedData.error.errors },
        { status: 400 } // Return 400 for bad request if validation fails
      );
    }

    const authorization = headers().get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      console.error("Authorization header missing or malformed");
      return NextResponse.json(
        { error: "Authorization header missing or malformed" },
        { status: 403 }
      );
    }

    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth().verifyIdToken(idToken);
      if (decodedToken) {
        // Generate session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        cookies().set({
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn / 1000, // Set in seconds
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/", // Ensure cookie is available throughout the app
        });

        console.log("Session cookie successfully created");
        return NextResponse.json(
          { message: "Session established" },
          { status: 200 }
        );
      } else {
        console.error("Failed to decode token");
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error: any) {
      console.error("Token verification failed:", error.message, error.stack);
      return NextResponse.json(
        { error: "Session expired or invalid token" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error processing request:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = cookies().get("session")?.value;
    if (!session) {
      console.error("No session cookie found");
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    try {
      const decodedClaims = await auth().verifySessionCookie(session, true);
      if (decodedClaims) {
        console.log("Session cookie validated successfully");
        return NextResponse.json({ isLogged: true }, { status: 200 });
      } else {
        console.error("Session validation failed");
        return NextResponse.json({ isLogged: false }, { status: 401 });
      }
    } catch (error) {
      console.error(
        "Error verifying session cookie:",
        (error as Error).message,
        (error as Error).stack
      );
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }
  } catch (error: any) {
    console.error(
      "Unexpected error in GET handler:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
