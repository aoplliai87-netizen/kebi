import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { asStringArray, getSupabaseServerClient } from "@/lib/supabase-server";

export type StoredReview = {
  id: string;
  createdAt: string;
  author: string;
  content: string;
  images: string[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(REVIEWS_FILE, "utf-8");
  } catch {
    await writeFile(REVIEWS_FILE, "[]", "utf-8");
  }
}

export async function listReviews(): Promise<StoredReview[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((row) => ({
        id: String(row.id),
        createdAt: String(row.created_at),
        author: String(row.author),
        content: String(row.content),
        images: asStringArray(row.images),
      }));
    }
  }

  await ensureStore();
  const raw = await readFile(REVIEWS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as StoredReview[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveReviewList(reviews: StoredReview[]): Promise<void> {
  await ensureStore();
  await writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function appendReview(review: StoredReview): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("reviews").insert({
      id: review.id,
      created_at: review.createdAt,
      author: review.author,
      content: review.content,
      images: review.images,
    });
    if (!error) return;
  }

  const all = await listReviews();
  all.unshift(review);
  await saveReviewList(all);
}
