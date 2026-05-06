import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extForMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size <= 0) {
      return NextResponse.json({ ok: false, message: "파일이 없습니다." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ ok: false, message: "지원하지 않는 파일 형식입니다." }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ ok: false, message: "파일 용량이 너무 큽니다. (최대 5MB)" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
    await mkdir(uploadDir, { recursive: true });
    const name = `${randomUUID()}.${extForMime(file.type)}`;
    await writeFile(path.join(uploadDir, name), buf);

    return NextResponse.json({ ok: true, url: `/uploads/gallery/${name}` });
  } catch {
    return NextResponse.json({ ok: false, message: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
