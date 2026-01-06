import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function sign(value: string) {
  const secret = process.env.ADMIN_COOKIE_SECRET!;
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const adminPw = process.env.ADMIN_PASSWORD;

  if (!adminPw || password !== adminPw) {
    return NextResponse.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const payload = `ok.${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
  return res;
}
