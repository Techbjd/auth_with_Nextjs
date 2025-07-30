import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/home" || path === "/login" || path === "/signup"||path=="/verifyemail";
  const token = request.cookies.get("token")?.value || "";


  console.log("Middleware - Path:", path);
  console.log("Middleware - Is Public Path:", isPublicPath);
  console.log("Middleware - Token exists:", !!token);
  
  if ((path === "/login" || path === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home", 
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
  ],
};