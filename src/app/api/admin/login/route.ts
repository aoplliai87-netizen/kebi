import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionMaxAge,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

type Payload = {
  id?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyAdminCredentials(id, password)) {
      return NextResponse.json(
        { ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(getAdminCookieName(), createAdminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getAdminSessionMaxAge(),
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
