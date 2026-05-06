import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReservationRecord } from "@/lib/reservation-store";
import type { StoredReview } from "@/lib/review-store";
import type { SiteSettings } from "@/lib/site-settings-store";
import type { SupportInquiryRecord } from "@/lib/support-inquiry-store";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(DATA_DIR, fileName), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readLocalReservations() {
  return readJsonFile<ReservationRecord[]>("reservations.json", []);
}

export async function readLocalSupportInquiries() {
  return readJsonFile<SupportInquiryRecord[]>("support-inquiries.json", []);
}

export async function readLocalReviews() {
  return readJsonFile<StoredReview[]>("reviews.json", []);
}

export async function readLocalSiteSettings() {
  return readJsonFile<SiteSettings>("site-settings.json", {
    aboutMeTitle: "ABOUT ME",
    aboutMeDescription: "원하시는 채널로 빠르게 연결해 예약 상담을 도와드립니다.",
    galleryImageUrls: [],
    vehicleSectionTitle: "",
    vehicleSectionDescription: "",
    pricingTiers: [],
    seoHomeTitle: "",
    seoHomeDescription: "",
    phoneDisplay: "010-4135-7621",
    phoneTel: "tel:+821041357621",
    contactLinks: {
      kakao: "",
      instagram: "",
      whatsapp: "",
      line: "",
      messenger: "",
    },
    heroTitle: "",
    heroSubtitle: "",
    aboutMeTitleByLocale: { ko: "", en: "", ja: "", zh: "" },
    aboutMeDescriptionByLocale: { ko: "", en: "", ja: "", zh: "" },
    heroTitleByLocale: { ko: "", en: "", ja: "", zh: "" },
    heroSubtitleByLocale: { ko: "", en: "", ja: "", zh: "" },
    seoHomeTitleByLocale: { ko: "", en: "", ja: "", zh: "" },
    seoHomeDescriptionByLocale: { ko: "", en: "", ja: "", zh: "" },
    vehicleSectionTitleByLocale: { ko: "", en: "", ja: "", zh: "" },
    vehicleSectionDescriptionByLocale: { ko: "", en: "", ja: "", zh: "" },
    pricingTiersByLocale: { ko: [], en: [], ja: [], zh: [] },
  });
}
