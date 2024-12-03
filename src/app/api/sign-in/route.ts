import { customInitApp } from "@/lib/firebase/firebase-admin";
import { auth } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "@/lib/schema/auth";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request: NextRequest) {
  const body = await request.json(); // Parse the request body
  const parsedData = signInSchema.safeParse(body); // Validate against the schema

  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors },
      { status: 400 } // Return 400 for bad request if validation fails
    );
  }

  const authorization = headers().get("Authorization");
  console.log(authorization, "Authorization");
  if (authorization?.startsWith("Bearer ")) {
    try {
      const idToken = authorization.split("Bearer ")[1];
      console.log(idToken, "Id token");
      const decodedToken = await auth().verifyIdToken(idToken);
      console.log(idToken, "Id token", "decoded", decodedToken);
      if (decodedToken) {
        // Generate session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        const options = {
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
        };
        // Add the cookie to the browser
        cookies().set(options);
        return NextResponse.json({}, { status: 200 });
      }
    } catch (error) {
      console.error("Error verifying ID token:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }
  return NextResponse.json(
    { error: "Authorization header missing" },
    { status: 403 }
  );
}

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";

  // Validate if the cookie exists in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  try {
    // Use Firebase Admin to validate the session cookie
    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (!decodedClaims) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }
    return NextResponse.json({ isLogged: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
