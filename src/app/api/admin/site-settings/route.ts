import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { appendAdminChangeLog } from "@/lib/admin-change-log-store";
import { parseHomeSections } from "@/lib/home-sections";
import { parseSeoPagesSettings } from "@/lib/seo-settings";
import { parseSubpagesContent } from "@/lib/subpages-content";
import {
  type ContactLinks,
  getSiteSettings,
  type LocaleKey,
  type LocalizedPricingTiers,
  type LocalizedText,
  saveSiteSettings,
  type ManagedPricingTier,
  type SiteSettings,
} from "@/lib/site-settings-store";

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

function parseContactLinks(value: unknown): ContactLinks {
  const v = value && typeof value === "object" ? (value as Partial<ContactLinks>) : {};
  return {
    kakao: typeof v.kakao === "string" ? v.kakao.trim() : "",
    instagram: typeof v.instagram === "string" ? v.instagram.trim() : "",
    whatsapp: typeof v.whatsapp === "string" ? v.whatsapp.trim() : "",
    line: typeof v.line === "string" ? v.line.trim() : "",
    messenger: typeof v.messenger === "string" ? v.messenger.trim() : "",
  };
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
  const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
  return locales.reduce(
    (acc, locale) => {
      acc[locale] = parsePricingTiers(v[locale]);
      return acc;
    },
    { ko: [], en: [], ja: [], zh: [] } as LocalizedPricingTiers
  );
}

/** 레거시 단일 컬럼은 요청 본문 값 우선, 비었으면 다국어 필드에서 채움 */
function coalesceLegacyField(legacy: string | undefined, loc: LocalizedText): string {
  const trimmed = typeof legacy === "string" ? legacy.trim() : "";
  if (trimmed) return trimmed;
  return loc.ko || loc.en || loc.ja || loc.zh || "";
}

function coalesceLocalized(primary: LocalizedText, fallback: LocalizedText): LocalizedText {
  return {
    ko: primary.ko || fallback.ko || "",
    en: primary.en || fallback.en || "",
    ja: primary.ja || fallback.ja || "",
    zh: primary.zh || fallback.zh || "",
  };
}

function toPhoneTel(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "tel:+821041357621";
  if (digits.startsWith("82")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+82${digits.slice(1)}`;
  return `tel:+${digits}`;
}

function normalizePhoneDisplay(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("01")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("02")) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return null;
}

function isValidExternalUrl(value: string) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ["http:", "https:", "kakaotalk:", "line:", "fb-messenger:", "tel:", "sms:"].includes(
      parsed.protocol
    );
  } catch {
    return false;
  }
}

function sameJson(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const phoneDisplayRaw =
      typeof body.phoneDisplay === "string" && body.phoneDisplay.trim()
        ? body.phoneDisplay.trim()
        : "010-4135-7621";
    const normalizedPhoneDisplay = normalizePhoneDisplay(phoneDisplayRaw);
    if (!normalizedPhoneDisplay) {
      return NextResponse.json(
        { ok: false, message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)" },
        { status: 400 }
      );
    }

    const parsedLinks = parseContactLinks(body.contactLinks);
    const linkEntries = Object.entries(parsedLinks);
    const invalidEntry = linkEntries.find(([, url]) => !isValidExternalUrl(url));
    if (invalidEntry) {
      return NextResponse.json(
        { ok: false, message: `${invalidEntry[0]} 링크 형식이 올바르지 않습니다.` },
        { status: 400 }
      );
    }

    const before = await getSiteSettings();

    const aboutMeTitleByLocale = parseLocalizedText(body.aboutMeTitleByLocale);
    const aboutMeDescriptionByLocale = parseLocalizedText(body.aboutMeDescriptionByLocale);
    const heroTitleByLocale = parseLocalizedText(body.heroTitleByLocale);
    const heroSubtitleByLocale = parseLocalizedText(body.heroSubtitleByLocale);
    const seoHomeTitleByLocaleRaw = parseLocalizedText(body.seoHomeTitleByLocale);
    const seoHomeDescriptionByLocaleRaw = parseLocalizedText(body.seoHomeDescriptionByLocale);
    const vehicleSectionTitleByLocale = parseLocalizedText(body.vehicleSectionTitleByLocale);
    const vehicleSectionDescriptionByLocale = parseLocalizedText(
      body.vehicleSectionDescriptionByLocale,
    );
    const pricingTiersByLocale = parseLocalizedPricingTiers(body.pricingTiersByLocale);
    const home = body.home !== undefined ? parseHomeSections(body.home) : before.home;
    const subpages = body.subpages !== undefined ? parseSubpagesContent(body.subpages) : before.subpages;
    const seo = body.seo !== undefined ? parseSeoPagesSettings(body.seo) : before.seo;
    const seoHomeTitleByLocaleFromSeo = seo.home.metaTitle;
    const seoHomeDescriptionByLocaleFromSeo = seo.home.metaDescription;
    const seoHomeTitleByLocale = coalesceLocalized(seoHomeTitleByLocaleRaw, seoHomeTitleByLocaleFromSeo);
    const seoHomeDescriptionByLocale = coalesceLocalized(
      seoHomeDescriptionByLocaleRaw,
      seoHomeDescriptionByLocaleFromSeo,
    );

    let pricingTiers = parsePricingTiers(body.pricingTiers);
    if (pricingTiers.length === 0 && pricingTiersByLocale.ko.length > 0) {
      pricingTiers = parsePricingTiers(pricingTiersByLocale.ko);
    }

    const nextSettings: SiteSettings = {
      aboutMeTitle: coalesceLegacyField(body.aboutMeTitle, aboutMeTitleByLocale),
      aboutMeDescription: coalesceLegacyField(body.aboutMeDescription, aboutMeDescriptionByLocale),
      galleryImageUrls: Array.isArray(body.galleryImageUrls)
        ? body.galleryImageUrls.filter(
            (v): v is string => typeof v === "string" && v.trim().length > 0
          )
        : [],
      vehicleSectionTitle: coalesceLegacyField(body.vehicleSectionTitle, vehicleSectionTitleByLocale),
      vehicleSectionDescription: coalesceLegacyField(
        body.vehicleSectionDescription,
        vehicleSectionDescriptionByLocale,
      ),
      pricingTiers,
      seoHomeTitle: coalesceLegacyField(body.seoHomeTitle, seoHomeTitleByLocale),
      seoHomeDescription: coalesceLegacyField(
        body.seoHomeDescription,
        seoHomeDescriptionByLocale,
      ),
      phoneDisplay: normalizedPhoneDisplay,
      phoneTel: toPhoneTel(normalizedPhoneDisplay),
      contactLinks: parsedLinks,
      heroTitle: coalesceLegacyField(body.heroTitle, heroTitleByLocale),
      heroSubtitle: coalesceLegacyField(body.heroSubtitle, heroSubtitleByLocale),
      aboutMeTitleByLocale,
      aboutMeDescriptionByLocale,
      heroTitleByLocale,
      heroSubtitleByLocale,
      seoHomeTitleByLocale,
      seoHomeDescriptionByLocale,
      vehicleSectionTitleByLocale,
      vehicleSectionDescriptionByLocale,
      pricingTiersByLocale,
      home,
      subpages,
      seo,
    };

    if (!nextSettings.aboutMeTitle || !nextSettings.aboutMeDescription) {
      return NextResponse.json(
        { ok: false, message: "필수 항목이 비어 있습니다." },
        { status: 400 }
      );
    }

    await saveSiteSettings(nextSettings);
    const persisted = await getSiteSettings();
    const verificationFailures: string[] = [];
    const checks: Array<[name: string, persistedValue: unknown, expectedValue: unknown]> = [
      ["heroTitleByLocale", persisted.heroTitleByLocale, nextSettings.heroTitleByLocale],
      ["heroSubtitleByLocale", persisted.heroSubtitleByLocale, nextSettings.heroSubtitleByLocale],
      ["aboutMeTitleByLocale", persisted.aboutMeTitleByLocale, nextSettings.aboutMeTitleByLocale],
      ["aboutMeDescriptionByLocale", persisted.aboutMeDescriptionByLocale, nextSettings.aboutMeDescriptionByLocale],
      ["vehicleSectionTitleByLocale", persisted.vehicleSectionTitleByLocale, nextSettings.vehicleSectionTitleByLocale],
      ["vehicleSectionDescriptionByLocale", persisted.vehicleSectionDescriptionByLocale, nextSettings.vehicleSectionDescriptionByLocale],
      ["pricingTiersByLocale", persisted.pricingTiersByLocale, nextSettings.pricingTiersByLocale],
      ["seoHomeTitleByLocale", persisted.seoHomeTitleByLocale, nextSettings.seoHomeTitleByLocale],
      ["seoHomeDescriptionByLocale", persisted.seoHomeDescriptionByLocale, nextSettings.seoHomeDescriptionByLocale],
      ["galleryImageUrls", persisted.galleryImageUrls, nextSettings.galleryImageUrls],
      ["contactLinks", persisted.contactLinks, nextSettings.contactLinks],
      ["home", persisted.home, nextSettings.home],
      ["subpages", persisted.subpages, nextSettings.subpages],
      ["seo", persisted.seo, nextSettings.seo],
    ];
    for (const [name, actual, expected] of checks) {
      if (!sameJson(actual, expected)) verificationFailures.push(name);
    }

    if (verificationFailures.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `저장 검증에 실패했습니다: ${verificationFailures.join(", ")}. DB 컬럼/권한 상태를 확인해주세요.`,
        },
        { status: 500 },
      );
    }
    const changes: Record<string, { before: unknown; after: unknown }> = {};
    const tracked: Array<keyof SiteSettings> = [
      "phoneDisplay",
      "phoneTel",
      "aboutMeTitle",
      "aboutMeDescription",
      "vehicleSectionTitle",
      "vehicleSectionDescription",
      "seoHomeTitle",
      "seoHomeDescription",
      "heroTitle",
      "heroSubtitle",
      "galleryImageUrls",
      "pricingTiers",
      "contactLinks",
      "aboutMeTitleByLocale",
      "aboutMeDescriptionByLocale",
      "heroTitleByLocale",
      "heroSubtitleByLocale",
      "seoHomeTitleByLocale",
      "seoHomeDescriptionByLocale",
      "vehicleSectionTitleByLocale",
      "vehicleSectionDescriptionByLocale",
      "pricingTiersByLocale",
      "home",
      "subpages",
      "seo",
    ];
    for (const key of tracked) {
      const prevVal = before[key];
      const nextVal = nextSettings[key];
      if (JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
        changes[key] = { before: prevVal, after: nextVal };
      }
    }
    if (Object.keys(changes).length > 0) {
      await appendAdminChangeLog({
        id: `chg_${randomUUID()}`,
        createdAt: new Date().toISOString(),
        actor: "admin",
        summary: `콘텐츠 설정 변경 (${Object.keys(changes).length}개 항목)`,
        changes,
        clientIp: request.headers.get("x-forwarded-for") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/site-settings] POST failed", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ ok: false, message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
