import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Tomar Sign In page er route - jodi /signin hoy, ekhane change kore dio
const SIGN_IN_PATH = "/sign-in";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better Auth er session cookie ache kina check koro
  const sessionCookie = getSessionCookie(request);

  // Login na thakle Sign In page e pathiye dao
  if (!sessionCookie) {
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    // Login er pore jekhane jete chaichilo, sekhane ferot pathanor jonno
    signInUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // // Dashboard - sob role
    "/dashboard/:path*",
    "/vendor/:path*",
    "/customer/:path*",
    "/admin/:path*",

    // Profile Settings
    "/profile/:path*",

    // Service Details - sudhu /services/123 er moto page
    // /services (Browse) public thakbe, tai :path+ use korlam
    "/services/:path+",

    // Payment pages
    "/payment/:path*",
  ],
};
