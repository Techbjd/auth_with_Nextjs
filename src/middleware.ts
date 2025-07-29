import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/home" || path === "/login" || path === "/signup"||path=="/verifyemail";
  const token = request.cookies.get("token")?.value || "";

  // If user has token and tries to access login/signup, redirect to home
  if ((path === "/login" || path === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user has no token and tries to access protected routes, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home", 
    "/profile",
    "/login",
    "/signup",
    "/verifyemail"
  ],
};