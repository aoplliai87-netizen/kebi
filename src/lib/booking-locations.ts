import {
  isPricingRegionGroup,
  pricingRegions,
  type PricingRegion,
} from "@/constants/pricingData";

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

function regionById(id: string): PricingRegion | undefined {
  return pricingRegions.find((r) => r.id === id);
}

/** 서울 세부지역 (요금표 순서 유지) */
export function getSeoulBookingSubOptions(): string[] {
  const seoul = regionById("seoul");
  if (!seoul) return [];
  return seoul.rows.map((entry) => {
    if (isPricingRegionGroup(entry)) {
      return entry.rows.map((row) => `${entry.name} · ${row.name}`);
    }
    return entry.name;
  }).flat();
}

/** 경기/수도권 세부지역 (그룹은 시명 · 세부) */
export function getGyeonggiBookingSubOptions(): string[] {
  const gg = regionById("gyeonggi");
  if (!gg) return [];
  const out: string[] = [];
  for (const entry of gg.rows) {
    if (isPricingRegionGroup(entry)) {
      for (const row of entry.rows) {
        out.push(`${entry.name} · ${row.name}`);
      }
    } else {
      out.push(entry.name);
    }
  }
  return out;
}

/** 수도권 외 — 도 단위 · 세부지역 */
export function getOtherRegionBookingSubOptions(): string[] {
  const out: string[] = [];
  for (const region of pricingRegions) {
    if (region.id === "seoul" || region.id === "gyeonggi") continue;
    if (region.rows.length === 0) {
      out.push(`${region.name} (별도 문의)`);
      continue;
    }
    for (const entry of region.rows) {
      if (isPricingRegionGroup(entry)) {
        for (const row of entry.rows) {
          out.push(`${region.name} · ${entry.name} · ${row.name}`);
        }
      } else {
        out.push(`${region.name} · ${entry.name}`);
      }
    }
  }
  return out;
}

export function getBookingSubOptions(primary: BookingPrimaryArea): string[] {
  switch (primary) {
    case "incheon_airport":
      return [...INCHEON_TERMINAL_OPTIONS];
    case "gimpo_airport":
      return [...GIMPO_TERMINAL_OPTIONS];
    case "seoul":
      return getSeoulBookingSubOptions();
    case "gyeonggi":
      return getGyeonggiBookingSubOptions();
    case "other":
      return getOtherRegionBookingSubOptions();
    default:
      return [];
  }
}

export function isBookingAirportPrimary(primary: BookingPrimaryArea): boolean {
  return primary === "incheon_airport" || primary === "gimpo_airport";
}

/** 레거시 API `airport` 필드용 요약 */
export function deriveLegacyAirportField(
  dep: BookingPrimaryArea | "",
  dest: BookingPrimaryArea | "",
): string {
  if (dep === "incheon_airport" || dest === "incheon_airport") return "인천공항";
  if (dep === "gimpo_airport" || dest === "gimpo_airport") return "김포공항";
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
