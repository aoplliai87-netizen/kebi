import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { appendReview, listReviews, type StoredReview } from "@/lib/review-store";

const MAX_IMAGES = 4;
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extForMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export async function GET() {
  try {
    const reviews = await listReviews();
    return NextResponse.json({ ok: true, reviews });
  } catch {
    return NextResponse.json({ ok: false, reviews: [] as StoredReview[] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const content = String(formData.get("content") ?? "").trim();
    const authorRaw = String(formData.get("author") ?? "").trim();
    const locale = String(formData.get("locale") ?? "ko");
    const author = authorRaw || (locale === "en" ? "Anonymous" : "익명");

    if (content.length < 10) {
      return NextResponse.json({ ok: false, message: "content_too_short" }, { status: 400 });
    }

    const files = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (files.length > MAX_IMAGES) {
      return NextResponse.json({ ok: false, message: "too_many_images" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "reviews");
    await mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];

    for (const file of files) {
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ ok: false, message: "invalid_type" }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length > MAX_BYTES) {
        return NextResponse.json({ ok: false, message: "file_too_large" }, { status: 400 });
      }
      const name = `${randomUUID()}.${extForMime(file.type)}`;
      await writeFile(path.join(uploadDir, name), buf);
      imagePaths.push(`/uploads/reviews/${name}`);
    }

    const record: StoredReview = {
      id: `rev_${randomUUID()}`,
      createdAt: new Date().toISOString(),
      author,
      content,
      images: imagePaths,
    };

    await appendReview(record);
    return NextResponse.json({ ok: true, review: record });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
