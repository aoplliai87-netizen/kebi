import {
  isPricingRegionGroup,
  pricingRegions,
  type PricingRegion,
  type PricingRow,
  type PricingTableEntry,
} from "@/constants/pricingData";
import { BOOKING_REGION_JA_ZH } from "./booking-region-ja-zh";

/** 예약 Step 3 상단 지역 (순서 고정: 인천 → 김포 → 서울 → 경기/수도권 → 기타) */
export type BookingPrimaryArea =
  | "incheon_airport"
  | "gimpo_airport"
  | "seoul"
  | "gyeonggi"
  | "other";

export const BOOKING_PRIMARY_ORDER: BookingPrimaryArea[] = [
  "incheon_airport",
  "gimpo_airport",
  "seoul",
  "gyeonggi",
  "other",
];

export const INCHEON_TERMINAL_OPTIONS = [
  "인천공항 제1여객터미널 (T1)",
  "인천공항 제2여객터미널 (T2)",
] as const;

export const GIMPO_TERMINAL_OPTIONS = [
  "김포공항 (국내선)",
  "김포공항 (국제선)",
] as const;

/** 슬롯 value로 사용되는 한글 문자열(기존 API·DB 호환) */
export type BookingSubOptionDescriptor = {
  value: string;
  slug: string;
  nameKo: string;
  nameEn: string;
};

export function slugifyBookingNameEn(nameEn: string): string {
  return nameEn
    .replace(/['']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function regionById(id: string): PricingRegion | undefined {
  return pricingRegions.find((r) => r.id === id);
}

const INCHEON_DESCRIPTORS: BookingSubOptionDescriptor[] = [
  {
    value: INCHEON_TERMINAL_OPTIONS[0],
    slug: "incheon_terminal_t1",
    nameKo: "인천공항 제1여객터미널 (T1)",
    nameEn: "Incheon Airport Terminal 1 (T1)",
  },
  {
    value: INCHEON_TERMINAL_OPTIONS[1],
    slug: "incheon_terminal_t2",
    nameKo: "인천공항 제2여객터미널 (T2)",
    nameEn: "Incheon Airport Terminal 2 (T2)",
  },
];

const GIMPO_DESCRIPTORS: BookingSubOptionDescriptor[] = [
  {
    value: GIMPO_TERMINAL_OPTIONS[0],
    slug: "gimpo_terminal_domestic",
    nameKo: "김포공항 (국내선)",
    nameEn: "Gimpo Airport (Domestic)",
  },
  {
    value: GIMPO_TERMINAL_OPTIONS[1],
    slug: "gimpo_terminal_intl",
    nameKo: "김포공항 (국제선)",
    nameEn: "Gimpo Airport (International)",
  },
];

function describeSeoulBookingSubOptions(): BookingSubOptionDescriptor[] {
  const seoul = regionById("seoul");
  if (!seoul) return [];
  const out: BookingSubOptionDescriptor[] = [];
  for (const entry of seoul.rows) {
    if (isPricingRegionGroup(entry)) {
      for (const row of entry.rows) {
        const value = `${entry.name} · ${row.name}`;
        out.push({
          value,
          slug: `seoul__${entry.id}__${slugifyBookingNameEn(row.nameEn)}`,
          nameKo: value,
          nameEn: `${entry.nameEn} · ${row.nameEn}`,
        });
      }
    } else {
      const row = entry as PricingRow;
      out.push({
        value: row.name,
        slug: `seoul__${slugifyBookingNameEn(row.nameEn)}`,
        nameKo: row.name,
        nameEn: row.nameEn,
      });
    }
  }
  return out;
}

function describeGyeonggiBookingSubOptions(): BookingSubOptionDescriptor[] {
  const gg = regionById("gyeonggi");
  if (!gg) return [];
  const out: BookingSubOptionDescriptor[] = [];
  for (const entry of gg.rows as PricingTableEntry[]) {
    if (isPricingRegionGroup(entry)) {
      for (const row of entry.rows) {
        const value = `${entry.name} · ${row.name}`;
        out.push({
          value,
          slug: `gyeonggi__${entry.id}__${slugifyBookingNameEn(row.nameEn)}`,
          nameKo: value,
          nameEn: `${entry.nameEn} · ${row.nameEn}`,
        });
      }
    } else {
      const row = entry as PricingRow;
      out.push({
        value: row.name,
        slug: `gyeonggi__${slugifyBookingNameEn(row.nameEn)}`,
        nameKo: row.name,
        nameEn: row.nameEn,
      });
    }
  }
  return out;
}

function describeOtherRegionBookingSubOptions(): BookingSubOptionDescriptor[] {
  const out: BookingSubOptionDescriptor[] = [];
  for (const region of pricingRegions) {
    if (region.id === "seoul" || region.id === "gyeonggi") continue;
    if (region.rows.length === 0) {
      const value = `${region.name} (별도 문의)`;
      out.push({
        value,
        slug: `${region.id}__inquiry`,
        nameKo: value,
        nameEn: `${region.nameEn} (inquire separately)`,
      });
      continue;
    }
    for (const entry of region.rows as PricingTableEntry[]) {
      if (isPricingRegionGroup(entry)) {
        for (const row of entry.rows) {
          const value = `${region.name} · ${entry.name} · ${row.name}`;
          out.push({
            value,
            slug: `${region.id}__${entry.id}__${slugifyBookingNameEn(row.nameEn)}`,
            nameKo: value,
            nameEn: `${region.nameEn} · ${entry.nameEn} · ${row.nameEn}`,
          });
        }
      } else {
        const row = entry as PricingRow;
        const flatValue = `${region.name} · ${row.name}`;
        out.push({
          value: flatValue,
          slug: `${region.id}__${slugifyBookingNameEn(row.nameEn)}`,
          nameKo: flatValue,
          nameEn: `${region.nameEn} · ${row.nameEn}`,
        });
      }
    }
  }
  return out;
}

const SUB_OPTION_CACHE: Partial<Record<BookingPrimaryArea, BookingSubOptionDescriptor[]>> = {};

function buildBookingSubOptionDescriptors(primary: BookingPrimaryArea): BookingSubOptionDescriptor[] {
  switch (primary) {
    case "incheon_airport":
      return INCHEON_DESCRIPTORS;
    case "gimpo_airport":
      return GIMPO_DESCRIPTORS;
    case "seoul":
      return describeSeoulBookingSubOptions();
    case "gyeonggi":
      return describeGyeonggiBookingSubOptions();
    case "other":
      return describeOtherRegionBookingSubOptions();
    default:
      return [];
  }
}

/** 세부 지역 옵션 메타 (한글 value는 기존과 동일 · slug로 JA/ZH 조회) */
export function getBookingSubOptionDescriptors(primary: BookingPrimaryArea): BookingSubOptionDescriptor[] {
  if (!SUB_OPTION_CACHE[primary]) {
    SUB_OPTION_CACHE[primary] = buildBookingSubOptionDescriptors(primary);
  }
  return SUB_OPTION_CACHE[primary]!;
}

export function getBookingSubOptions(primary: BookingPrimaryArea): string[] {
  return getBookingSubOptionDescriptors(primary).map((d) => d.value);
}

export function findBookingSubOptionDescriptor(
  primary: BookingPrimaryArea,
  value: string,
): BookingSubOptionDescriptor | undefined {
  return getBookingSubOptionDescriptors(primary).find((d) => d.value === value);
}

/** 예약 UI 표시용 — value(한글)는 그대로 두고 로케일별 라벨 */
export function resolveBookingSubOptionLabel(
  desc: BookingSubOptionDescriptor,
  locale: string,
): string {
  if (locale === "ko") return desc.nameKo;
  if (locale === "en") return desc.nameEn;
  const pack = BOOKING_REGION_JA_ZH[desc.slug];
  if (locale === "ja") return pack?.ja ?? desc.nameEn;
  if (locale === "zh") return pack?.zh ?? desc.nameEn;
  return desc.nameEn;
}

export function formatRouteEndForDisplay(
  primary: BookingPrimaryArea,
  subValue: string,
  detail: string,
  locale: string,
): string {
  const desc = findBookingSubOptionDescriptor(primary, subValue);
  const subDisplay = desc ? resolveBookingSubOptionLabel(desc, locale) : subValue;
  return composeRouteLine(primary, subDisplay, detail);
}

export function isBookingAirportPrimary(primary: BookingPrimaryArea): boolean {
  return primary === "incheon_airport" || primary === "gimpo_airport";
}

export type LegacyAirportSummaryKey = "incheon" | "gimpo" | "none";

/** 레거시 API `airport` 필드용 분류 — 표시 문구는 BookingExperience 번역 키로 매핑 */
export function deriveLegacyAirportSummaryKey(
  dep: BookingPrimaryArea | "",
  dest: BookingPrimaryArea | "",
): LegacyAirportSummaryKey {
  if (dep === "incheon_airport" || dest === "incheon_airport") return "incheon";
  if (dep === "gimpo_airport" || dest === "gimpo_airport") return "gimpo";
  return "none";
}

/** @deprecated 요약 키·번역 사용 권장 */
export function deriveLegacyAirportField(
  dep: BookingPrimaryArea | "",
  dest: BookingPrimaryArea | "",
): string {
  const k = deriveLegacyAirportSummaryKey(dep, dest);
  if (k === "incheon") return "인천공항";
  if (k === "gimpo") return "김포공항";
  return "공항 아님";
}

export function composeRouteLine(
  primary: BookingPrimaryArea,
  sub: string,
  detail: string,
): string {
  const d = detail.trim();
  const base = sub.trim();
  if (!base) return d;
  return d ? `${base} · ${d}` : base;
}
