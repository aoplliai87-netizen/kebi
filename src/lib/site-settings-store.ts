import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  emptyHomeSections,
  parseHomeSections,
  type HomeSections,
} from "@/lib/home-sections";
import {
  emptySubpagesContent,
  parseSubpagesContent,
  type SubpagesContent,
} from "@/lib/subpages-content";
import {
  emptySeoPageSettings,
  emptySeoPagesSettings,
  parseSeoPagesSettings,
  parseSeoPerSlugMap,
  type SeoPageSettings,
  type SeoPagesSettings,
} from "@/lib/seo-settings";
import { getAllDestinationSlugs } from "../../data/landing-pages";
import {
  parseDestinationContentOverrideMap,
  type DestinationContentOverrideMap,
} from "@/lib/destination-admin-types";
import { asStringArray, getSupabaseServerClient } from "@/lib/supabase-server";

export type ManagedPricingTier = {
  label: string;
  price: string;
  note: string;
};
export type LocaleKey = "ko" | "en" | "ja" | "zh";
export type LocalizedText = Record<LocaleKey, string>;
export type LocalizedPricingTiers = Record<LocaleKey, ManagedPricingTier[]>;

export type ContactLinks = {
  kakao: string;
  instagram: string;
  whatsapp: string;
  line: string;
  messenger: string;
};

export type SiteSettings = {
  aboutMeTitle: string;
  aboutMeDescription: string;
  galleryImageUrls: string[];
  vehicleSectionTitle: string;
  vehicleSectionDescription: string;
  pricingTiers: ManagedPricingTier[];
  seoHomeTitle: string;
  seoHomeDescription: string;
  phoneDisplay: string;
  phoneTel: string;
  contactLinks: ContactLinks;
  heroTitle: string;
  heroSubtitle: string;
  aboutMeTitleByLocale: LocalizedText;
  aboutMeDescriptionByLocale: LocalizedText;
  heroTitleByLocale: LocalizedText;
  heroSubtitleByLocale: LocalizedText;
  seoHomeTitleByLocale: LocalizedText;
  seoHomeDescriptionByLocale: LocalizedText;
  vehicleSectionTitleByLocale: LocalizedText;
  vehicleSectionDescriptionByLocale: LocalizedText;
  pricingTiersByLocale: LocalizedPricingTiers;
  /** Intro / Booking / Reviews / FAQ — 비어 있으면 messages 번역 fallback */
  home: HomeSections;
  /** booking/inquiry/intro/review 본문 CMS */
  subpages: SubpagesContent;
  /** 페이지별/언어별 SEO 설정 */
  seo: SeoPagesSettings;
  /** destinations/[slug] 랜딩 본문 — 비어 있으면 data/landing-pages 기본값 */
  destinationContentOverrides: DestinationContentOverrideMap;
  /** slug별 메타/OG 등 — 비어 있으면 랜딩 데이터 파일 + 공통 규칙 */
  seoDestinationBySlug: Record<string, SeoPageSettings>;
};

const EMPTY_LOCALIZED_TEXT: LocalizedText = { ko: "", en: "", ja: "", zh: "" };
const EMPTY_LOCALIZED_PRICING: LocalizedPricingTiers = { ko: [], en: [], ja: [], zh: [] };

const DEFAULT_SETTINGS: SiteSettings = {
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
  aboutMeTitleByLocale: EMPTY_LOCALIZED_TEXT,
  aboutMeDescriptionByLocale: EMPTY_LOCALIZED_TEXT,
  heroTitleByLocale: EMPTY_LOCALIZED_TEXT,
  heroSubtitleByLocale: EMPTY_LOCALIZED_TEXT,
  seoHomeTitleByLocale: EMPTY_LOCALIZED_TEXT,
  seoHomeDescriptionByLocale: EMPTY_LOCALIZED_TEXT,
  vehicleSectionTitleByLocale: EMPTY_LOCALIZED_TEXT,
  vehicleSectionDescriptionByLocale: EMPTY_LOCALIZED_TEXT,
  pricingTiersByLocale: EMPTY_LOCALIZED_PRICING,
  home: emptyHomeSections(),
  subpages: emptySubpagesContent(),
  seo: emptySeoPagesSettings(),
  destinationContentOverrides: {},
  seoDestinationBySlug: {},
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "site-settings.json");

/** 신규 destination slug 추가 시 SEO 폼에 빈 레코드가 생기도록 보강 */
export function hydrateSeoDestinationBySlug(stored: Record<string, SeoPageSettings>): Record<string, SeoPageSettings> {
  let slugs: string[];
  try {
    slugs = getAllDestinationSlugs();
  } catch {
    return stored;
  }
  const next = { ...stored };
  for (const slug of slugs) {
    if (!next[slug]) next[slug] = emptySeoPageSettings();
  }
  return next;
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
  }
}

function parsePricingTiers(value: unknown): ManagedPricingTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<ManagedPricingTier>;
      const label = typeof row.label === "string" ? row.label.trim() : "";
      const price = typeof row.price === "string" ? row.price.trim() : "";
      const note = typeof row.note === "string" ? row.note.trim() : "";
      if (!label || !price || !note) return null;
      return { label, price, note };
    })
    .filter((row): row is ManagedPricingTier => Boolean(row));
}

function parseLocalizedText(value: unknown): LocalizedText {
  const v = value && typeof value === "object" ? (value as Partial<LocalizedText>) : {};
  return {
    ko: typeof v.ko === "string" ? v.ko.trim() : "",
    en: typeof v.en === "string" ? v.en.trim() : "",
    ja: typeof v.ja === "string" ? v.ja.trim() : "",
    zh: typeof v.zh === "string" ? v.zh.trim() : "",
  };
}

function parseLocalizedPricingTiers(value: unknown): LocalizedPricingTiers {
  const v = value && typeof value === "object" ? (value as Partial<LocalizedPricingTiers>) : {};
  return {
    ko: parsePricingTiers(v.ko),
    en: parsePricingTiers(v.en),
    ja: parsePricingTiers(v.ja),
    zh: parsePricingTiers(v.zh),
  };
}

function isSeoPagesEffectivelyEmpty(value: SeoPagesSettings): boolean {
  return Object.values(value).every((page) => {
    const localizedEmpty = (v: LocalizedText) =>
      !v.ko.trim() && !v.en.trim() && !v.ja.trim() && !v.zh.trim();
    return (
      localizedEmpty(page.metaTitle) &&
      localizedEmpty(page.metaDescription) &&
      localizedEmpty(page.ogTitle) &&
      localizedEmpty(page.ogDescription) &&
      !page.ogImage.trim() &&
      localizedEmpty(page.canonicalUrl) &&
      localizedEmpty(page.focusKeywords) &&
      localizedEmpty(page.searchAssistNotes)
    );
  });
}

function hydrateSeoFromLegacy(
  seo: SeoPagesSettings,
  legacyTitleByLocale: LocalizedText,
  legacyDescByLocale: LocalizedText,
  legacyTitle: string,
  legacyDesc: string,
): SeoPagesSettings {
  const next = {
    ...seo,
    home: {
      ...seo.home,
      metaTitle: { ...seo.home.metaTitle },
      metaDescription: { ...seo.home.metaDescription },
      ogTitle: { ...seo.home.ogTitle },
      ogDescription: { ...seo.home.ogDescription },
    },
  };
  const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
  for (const locale of locales) {
    const t = legacyTitleByLocale[locale].trim() || (locale === "ko" ? legacyTitle.trim() : "");
    const d = legacyDescByLocale[locale].trim() || (locale === "ko" ? legacyDesc.trim() : "");
    if (!next.home.metaTitle[locale].trim()) next.home.metaTitle[locale] = t;
    if (!next.home.metaDescription[locale].trim()) next.home.metaDescription[locale] = d;
    if (!next.home.ogTitle[locale].trim()) next.home.ogTitle[locale] = t;
    if (!next.home.ogDescription[locale].trim()) next.home.ogDescription[locale] = d;
  }
  return next;
}

function toPhoneTel(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return DEFAULT_SETTINGS.phoneTel;
  if (digits.startsWith("82")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+82${digits.slice(1)}`;
  return `tel:+${digits}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (!error && data) {
      const legacySeoHomeTitleByLocale: LocalizedText = {
        ko: data.seo_home_title_ko?.trim() || data.seo_home_title?.trim() || "",
        en: data.seo_home_title_en?.trim() || "",
        ja: data.seo_home_title_ja?.trim() || "",
        zh: data.seo_home_title_zh?.trim() || "",
      };
      const legacySeoHomeDescriptionByLocale: LocalizedText = {
        ko: data.seo_home_description_ko?.trim() || data.seo_home_description?.trim() || "",
        en: data.seo_home_description_en?.trim() || "",
        ja: data.seo_home_description_ja?.trim() || "",
        zh: data.seo_home_description_zh?.trim() || "",
      };
      const parsedSeo = parseSeoPagesSettings((data as { seo_pages?: unknown }).seo_pages ?? undefined);
      const seo = isSeoPagesEffectivelyEmpty(parsedSeo)
        ? hydrateSeoFromLegacy(
            parsedSeo,
            legacySeoHomeTitleByLocale,
            legacySeoHomeDescriptionByLocale,
            data.seo_home_title?.trim() || "",
            data.seo_home_description?.trim() || "",
          )
        : parsedSeo;

      return {
        aboutMeTitle: data.about_me_title?.trim() || DEFAULT_SETTINGS.aboutMeTitle,
        aboutMeDescription:
          data.about_me_description?.trim() || DEFAULT_SETTINGS.aboutMeDescription,
        galleryImageUrls: asStringArray(data.gallery_image_urls),
        vehicleSectionTitle: data.vehicle_section_title?.trim() || "",
        vehicleSectionDescription: data.vehicle_section_description?.trim() || "",
        pricingTiers: parsePricingTiers(data.pricing_tiers),
        seoHomeTitle: data.seo_home_title?.trim() || "",
        seoHomeDescription: data.seo_home_description?.trim() || "",
        phoneDisplay: data.phone_display?.trim() || DEFAULT_SETTINGS.phoneDisplay,
        phoneTel:
          data.phone_tel?.trim() ||
          toPhoneTel(data.phone_display?.trim() || DEFAULT_SETTINGS.phoneDisplay),
        contactLinks: {
          kakao: data.kakao_url?.trim() || "",
          instagram: data.instagram_url?.trim() || "",
          whatsapp: data.whatsapp_url?.trim() || "",
          line: data.line_url?.trim() || "",
          messenger: data.messenger_url?.trim() || "",
        },
        heroTitle: data.hero_title?.trim() || "",
        heroSubtitle: data.hero_subtitle?.trim() || "",
        aboutMeTitleByLocale: {
          ko: data.about_me_title_ko?.trim() || data.about_me_title?.trim() || "",
          en: data.about_me_title_en?.trim() || "",
          ja: data.about_me_title_ja?.trim() || "",
          zh: data.about_me_title_zh?.trim() || "",
        },
        aboutMeDescriptionByLocale: {
          ko: data.about_me_description_ko?.trim() || data.about_me_description?.trim() || "",
          en: data.about_me_description_en?.trim() || "",
          ja: data.about_me_description_ja?.trim() || "",
          zh: data.about_me_description_zh?.trim() || "",
        },
        heroTitleByLocale: {
          ko: data.hero_title_ko?.trim() || data.hero_title?.trim() || "",
          en: data.hero_title_en?.trim() || "",
          ja: data.hero_title_ja?.trim() || "",
          zh: data.hero_title_zh?.trim() || "",
        },
        heroSubtitleByLocale: {
          ko: data.hero_subtitle_ko?.trim() || data.hero_subtitle?.trim() || "",
          en: data.hero_subtitle_en?.trim() || "",
          ja: data.hero_subtitle_ja?.trim() || "",
          zh: data.hero_subtitle_zh?.trim() || "",
        },
        seoHomeTitleByLocale: legacySeoHomeTitleByLocale,
        seoHomeDescriptionByLocale: legacySeoHomeDescriptionByLocale,
        vehicleSectionTitleByLocale: {
          ko: data.vehicle_section_title_ko?.trim() || data.vehicle_section_title?.trim() || "",
          en: data.vehicle_section_title_en?.trim() || "",
          ja: data.vehicle_section_title_ja?.trim() || "",
          zh: data.vehicle_section_title_zh?.trim() || "",
        },
        vehicleSectionDescriptionByLocale: {
          ko:
            data.vehicle_section_description_ko?.trim() ||
            data.vehicle_section_description?.trim() ||
            "",
          en: data.vehicle_section_description_en?.trim() || "",
          ja: data.vehicle_section_description_ja?.trim() || "",
          zh: data.vehicle_section_description_zh?.trim() || "",
        },
        pricingTiersByLocale: {
          ko: parsePricingTiers(data.pricing_tiers_ko) || parsePricingTiers(data.pricing_tiers),
          en: parsePricingTiers(data.pricing_tiers_en),
          ja: parsePricingTiers(data.pricing_tiers_ja),
          zh: parsePricingTiers(data.pricing_tiers_zh),
        },
        home: parseHomeSections(
          (data as { home_sections?: unknown }).home_sections ?? undefined,
        ),
        subpages: parseSubpagesContent(
          (data as { subpages_content?: unknown }).subpages_content ?? undefined,
        ),
        seo,
        destinationContentOverrides: parseDestinationContentOverrideMap(
          (data as { destination_content_overrides?: unknown }).destination_content_overrides ??
            undefined,
        ),
        seoDestinationBySlug: hydrateSeoDestinationBySlug(
          parseSeoPerSlugMap((data as { seo_destination_by_slug?: unknown }).seo_destination_by_slug ?? undefined),
        ),
      };
    }
  }

  await ensureStore();
  try {
    const raw = await readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    const legacySeoHomeTitleByLocale = parseLocalizedText(parsed.seoHomeTitleByLocale);
    const legacySeoHomeDescriptionByLocale = parseLocalizedText(parsed.seoHomeDescriptionByLocale);
    const parsedSeo = parseSeoPagesSettings(parsed.seo);
    const seo = isSeoPagesEffectivelyEmpty(parsedSeo)
      ? hydrateSeoFromLegacy(
          parsedSeo,
          legacySeoHomeTitleByLocale,
          legacySeoHomeDescriptionByLocale,
          typeof parsed.seoHomeTitle === "string" ? parsed.seoHomeTitle.trim() : "",
          typeof parsed.seoHomeDescription === "string" ? parsed.seoHomeDescription.trim() : "",
        )
      : parsedSeo;

    return {
      aboutMeTitle: parsed.aboutMeTitle?.trim() || DEFAULT_SETTINGS.aboutMeTitle,
      aboutMeDescription: parsed.aboutMeDescription?.trim() || DEFAULT_SETTINGS.aboutMeDescription,
      galleryImageUrls: Array.isArray(parsed.galleryImageUrls)
        ? parsed.galleryImageUrls.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
        : [],
      vehicleSectionTitle:
        typeof parsed.vehicleSectionTitle === "string" ? parsed.vehicleSectionTitle.trim() : "",
      vehicleSectionDescription:
        typeof parsed.vehicleSectionDescription === "string"
          ? parsed.vehicleSectionDescription.trim()
          : "",
      pricingTiers: parsePricingTiers(parsed.pricingTiers),
      seoHomeTitle: typeof parsed.seoHomeTitle === "string" ? parsed.seoHomeTitle.trim() : "",
      seoHomeDescription:
        typeof parsed.seoHomeDescription === "string" ? parsed.seoHomeDescription.trim() : "",
      phoneDisplay:
        typeof parsed.phoneDisplay === "string" && parsed.phoneDisplay.trim()
          ? parsed.phoneDisplay.trim()
          : DEFAULT_SETTINGS.phoneDisplay,
      phoneTel:
        typeof parsed.phoneTel === "string" && parsed.phoneTel.trim()
          ? parsed.phoneTel.trim()
          : toPhoneTel(
              typeof parsed.phoneDisplay === "string" ? parsed.phoneDisplay : DEFAULT_SETTINGS.phoneDisplay
            ),
      contactLinks: {
        kakao:
          parsed.contactLinks &&
          typeof parsed.contactLinks === "object" &&
          typeof (parsed.contactLinks as ContactLinks).kakao === "string"
            ? (parsed.contactLinks as ContactLinks).kakao.trim()
            : "",
        instagram:
          parsed.contactLinks &&
          typeof parsed.contactLinks === "object" &&
          typeof (parsed.contactLinks as ContactLinks).instagram === "string"
            ? (parsed.contactLinks as ContactLinks).instagram.trim()
            : "",
        whatsapp:
          parsed.contactLinks &&
          typeof parsed.contactLinks === "object" &&
          typeof (parsed.contactLinks as ContactLinks).whatsapp === "string"
            ? (parsed.contactLinks as ContactLinks).whatsapp.trim()
            : "",
        line:
          parsed.contactLinks &&
          typeof parsed.contactLinks === "object" &&
          typeof (parsed.contactLinks as ContactLinks).line === "string"
            ? (parsed.contactLinks as ContactLinks).line.trim()
            : "",
        messenger:
          parsed.contactLinks &&
          typeof parsed.contactLinks === "object" &&
          typeof (parsed.contactLinks as ContactLinks).messenger === "string"
            ? (parsed.contactLinks as ContactLinks).messenger.trim()
            : "",
      },
      heroTitle: typeof parsed.heroTitle === "string" ? parsed.heroTitle.trim() : "",
      heroSubtitle: typeof parsed.heroSubtitle === "string" ? parsed.heroSubtitle.trim() : "",
      aboutMeTitleByLocale: parseLocalizedText(parsed.aboutMeTitleByLocale),
      aboutMeDescriptionByLocale: parseLocalizedText(parsed.aboutMeDescriptionByLocale),
      heroTitleByLocale: parseLocalizedText(parsed.heroTitleByLocale),
      heroSubtitleByLocale: parseLocalizedText(parsed.heroSubtitleByLocale),
      seoHomeTitleByLocale: legacySeoHomeTitleByLocale,
      seoHomeDescriptionByLocale: legacySeoHomeDescriptionByLocale,
      vehicleSectionTitleByLocale: parseLocalizedText(parsed.vehicleSectionTitleByLocale),
      vehicleSectionDescriptionByLocale: parseLocalizedText(parsed.vehicleSectionDescriptionByLocale),
      pricingTiersByLocale: parseLocalizedPricingTiers(parsed.pricingTiersByLocale),
      home: parseHomeSections(parsed.home),
      subpages: parseSubpagesContent(parsed.subpages),
      seo,
      destinationContentOverrides: parseDestinationContentOverrideMap(parsed.destinationContentOverrides),
      seoDestinationBySlug: hydrateSeoDestinationBySlug(parseSeoPerSlugMap(parsed.seoDestinationBySlug)),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(nextSettings: SiteSettings) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const payload = {
      id: "default",
      about_me_title: nextSettings.aboutMeTitle,
      about_me_description: nextSettings.aboutMeDescription,
      gallery_image_urls: nextSettings.galleryImageUrls,
      vehicle_section_title: nextSettings.vehicleSectionTitle,
      vehicle_section_description: nextSettings.vehicleSectionDescription,
      pricing_tiers: nextSettings.pricingTiers,
      seo_home_title: nextSettings.seoHomeTitle,
      seo_home_description: nextSettings.seoHomeDescription,
      phone_display: nextSettings.phoneDisplay,
      phone_tel: nextSettings.phoneTel,
      kakao_url: nextSettings.contactLinks.kakao,
      instagram_url: nextSettings.contactLinks.instagram,
      whatsapp_url: nextSettings.contactLinks.whatsapp,
      line_url: nextSettings.contactLinks.line,
      messenger_url: nextSettings.contactLinks.messenger,
      hero_title: nextSettings.heroTitle,
      hero_subtitle: nextSettings.heroSubtitle,
      about_me_title_ko: nextSettings.aboutMeTitleByLocale.ko,
      about_me_title_en: nextSettings.aboutMeTitleByLocale.en,
      about_me_title_ja: nextSettings.aboutMeTitleByLocale.ja,
      about_me_title_zh: nextSettings.aboutMeTitleByLocale.zh,
      about_me_description_ko: nextSettings.aboutMeDescriptionByLocale.ko,
      about_me_description_en: nextSettings.aboutMeDescriptionByLocale.en,
      about_me_description_ja: nextSettings.aboutMeDescriptionByLocale.ja,
      about_me_description_zh: nextSettings.aboutMeDescriptionByLocale.zh,
      hero_title_ko: nextSettings.heroTitleByLocale.ko,
      hero_title_en: nextSettings.heroTitleByLocale.en,
      hero_title_ja: nextSettings.heroTitleByLocale.ja,
      hero_title_zh: nextSettings.heroTitleByLocale.zh,
      hero_subtitle_ko: nextSettings.heroSubtitleByLocale.ko,
      hero_subtitle_en: nextSettings.heroSubtitleByLocale.en,
      hero_subtitle_ja: nextSettings.heroSubtitleByLocale.ja,
      hero_subtitle_zh: nextSettings.heroSubtitleByLocale.zh,
      seo_home_title_ko: nextSettings.seoHomeTitleByLocale.ko,
      seo_home_title_en: nextSettings.seoHomeTitleByLocale.en,
      seo_home_title_ja: nextSettings.seoHomeTitleByLocale.ja,
      seo_home_title_zh: nextSettings.seoHomeTitleByLocale.zh,
      seo_home_description_ko: nextSettings.seoHomeDescriptionByLocale.ko,
      seo_home_description_en: nextSettings.seoHomeDescriptionByLocale.en,
      seo_home_description_ja: nextSettings.seoHomeDescriptionByLocale.ja,
      seo_home_description_zh: nextSettings.seoHomeDescriptionByLocale.zh,
      vehicle_section_title_ko: nextSettings.vehicleSectionTitleByLocale.ko,
      vehicle_section_title_en: nextSettings.vehicleSectionTitleByLocale.en,
      vehicle_section_title_ja: nextSettings.vehicleSectionTitleByLocale.ja,
      vehicle_section_title_zh: nextSettings.vehicleSectionTitleByLocale.zh,
      vehicle_section_description_ko: nextSettings.vehicleSectionDescriptionByLocale.ko,
      vehicle_section_description_en: nextSettings.vehicleSectionDescriptionByLocale.en,
      vehicle_section_description_ja: nextSettings.vehicleSectionDescriptionByLocale.ja,
      vehicle_section_description_zh: nextSettings.vehicleSectionDescriptionByLocale.zh,
      pricing_tiers_ko: nextSettings.pricingTiersByLocale.ko,
      pricing_tiers_en: nextSettings.pricingTiersByLocale.en,
      pricing_tiers_ja: nextSettings.pricingTiersByLocale.ja,
      pricing_tiers_zh: nextSettings.pricingTiersByLocale.zh,
      home_sections: nextSettings.home,
      subpages_content: nextSettings.subpages,
      seo_pages: nextSettings.seo,
      destination_content_overrides: nextSettings.destinationContentOverrides,
      seo_destination_by_slug: nextSettings.seoDestinationBySlug,
    } as const;

    const payloadForUpsert: Record<string, unknown> = { ...payload };
    for (let i = 0; i < 20; i += 1) {
      const { error } = await supabase.from("site_settings").upsert(payloadForUpsert, { onConflict: "id" });
      if (!error) return;

      const message = error.message ?? "";
      const missingColumnMatch = message.match(/Could not find the '([^']+)' column/i);
      const missingColumn = missingColumnMatch?.[1];
      if ((error as { code?: string }).code === "PGRST204" && missingColumn && missingColumn in payloadForUpsert) {
        delete payloadForUpsert[missingColumn];
        console.warn("[site-settings] Missing column on remote DB; retrying without column", {
          missingColumn,
        });
        continue;
      }

      console.error("[site-settings] Supabase upsert failed", {
        message: error.message,
        details: (error as { details?: string }).details,
        hint: (error as { hint?: string }).hint,
        code: (error as { code?: string }).code,
      });
      throw new Error(
        `Supabase site_settings upsert failed: ${error.message} [code=${(error as { code?: string }).code ?? "-"}]`,
      );
    }
    throw new Error("Supabase site_settings upsert failed after retrying unknown columns.");
  }

  await ensureStore();
  await writeFile(FILE, JSON.stringify(nextSettings, null, 2), "utf-8");
}
