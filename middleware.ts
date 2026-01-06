// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 로그인 페이지는 통과
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // 관리자 영역 보호
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    // ❗ crypto 검증 ❌ → 존재 여부만 체크
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
