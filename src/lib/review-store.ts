import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  const all = await listReviews();
  all.unshift(review);
  await saveReviewList(all);
}
