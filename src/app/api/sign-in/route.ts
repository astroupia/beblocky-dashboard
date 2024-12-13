import { customInitApp } from "@/lib/firebase/firebase-admin";
import { auth } from "firebase-admin";

import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request: NextRequest, response: NextResponse) {
  const authorization = headers().get("Authorization");
  console.log(authorization, "Authorization");
  if (authorization?.startsWith("Bearer ")) {
    try {
      const idToken = authorization.split("Bearer ")[1];
      console.log(idToken, "Id token");
      const decodedToken = await auth().verifyIdToken(idToken);
      console.log(idToken, "Id token", "decoded", decodedToken);
      if (decodedToken) {
        //Generate session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        const options = {
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        };
        //Add the cookie to the browser
        cookies().set(options);
        return NextResponse.json({}, { status: 200 });
      }
    } catch {
      return NextResponse.json({}, { status: 403 });
    }
  }
  return NextResponse.json({}, { status: 403 });
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
