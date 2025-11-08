import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Kiểm tra xem có phải là client-side không
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const isAuthPage = request.nextUrl.pathname === "/login";

    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
