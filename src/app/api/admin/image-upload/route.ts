import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function extForMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const sectionRaw = typeof formData.get("section") === "string" ? String(formData.get("section")) : "admin";
    const purposeRaw = typeof formData.get("purpose") === "string" ? String(formData.get("purpose")) : "image";

    if (!(file instanceof File) || file.size <= 0) {
      return NextResponse.json({ ok: false, message: "파일이 없습니다." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ ok: false, message: "지원하지 않는 파일 형식입니다. (JPG/PNG/WebP)" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ ok: false, message: "파일 용량이 너무 큽니다. (최대 8MB)" }, { status: 400 });
    }

    const section = slugify(sectionRaw) || "admin";
    const purpose = slugify(purposeRaw) || "image";
    const ts = Date.now();
    const id = randomUUID().slice(0, 8);
    const ext = extForMime(file.type);
    const name = `${section}-${purpose}-${ts}-${id}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "admin-uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, name), buf);

    return NextResponse.json({ ok: true, url: `/images/admin-uploads/${name}` });
  } catch {
    return NextResponse.json({ ok: false, message: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}

