import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");
  const authPages = ["/sign-in", "/sign-up"];
  const isAuthPage = authPages.includes(request.nextUrl.pathname);
  if (!session) {
    if (isAuthPage) {
      return null;
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const responseAPI = await fetch(new URL("/api/sign-in", request.url).href, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  if (responseAPI.status !== 200) {
    request.cookies.delete("session");
    await fetch(new URL("/api/sign-out", request.url).href, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });
    return null;
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
