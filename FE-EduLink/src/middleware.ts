import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Kiểm tra nếu đường dẫn là lecture hoặc quiz
  if (
    request.nextUrl.pathname.includes('/courses/') &&
    (request.nextUrl.pathname.includes('/curricula/lecture/') ||
      request.nextUrl.pathname.includes('/curricula/quiz/'))
  ) {
    const newUrl = new URL(request.nextUrl.pathname, request.url);
    newUrl.searchParams.set('requireAuth', 'true');

    // Copy tất cả các query params khác
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      if (key !== 'requireAuth') {
        newUrl.searchParams.set(key, value);
      }
    }

    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

// Xác định các đường dẫn áp dụng middleware
export const config = {
  matcher: ['/courses/:courseId/curricula/:path*'],
};
