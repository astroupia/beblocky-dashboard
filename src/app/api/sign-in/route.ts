import { customInitApp } from "@/lib/firebase/firebase-admin";
import { auth } from "firebase-admin";

import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request: NextRequest) {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    try {
      const idToken = authorization.split("Bearer ")[1];
      const decodedToken = await auth().verifyIdToken(idToken);
      if (decodedToken) {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        cookies().set({
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        });
        return NextResponse.json({}, { status: 200 });
      }
    } catch (error) {
      console.error("Error verifying ID token:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";

  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  //Use Firebase Admin to validate the session cookie
  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
