/**
 * 랜딩 슬러그 → 운영/현지화 번들 키 (enrichment · i18n refine 공통)
 */
export type DestinationBundleKey =
  | "toAirport"
  | "fromAirport"
  | "north"
  | "dawn"
  | "family"
  | "golf"
  | "foreigner"
  | "group"
  | "heavy"
  | "balanced";

const NORTH_RE =
  /nowon|gangbuk|suyu|changdong|dobong|byeolnae|namyangju|guri|yangju|dongducheon|uijeongbu-to-incheon|gimpo-airport-to-uijeongbu/;

export function classifyDestinationSlug(slug: string): DestinationBundleKey {
  if (slug.includes("foreigner")) return "foreigner";
  if (slug.includes("group") || slug.includes("단체")) return "group";
  if (slug.includes("heavy-luggage")) return "heavy";
  if (slug.includes("golf")) return "golf";
  if (slug.includes("family")) return "family";
  if (slug.includes("dawn") || slug.includes("새벽")) return "dawn";
  if (NORTH_RE.test(slug)) return "north";
  if (slug.includes("to-incheon-airport") || slug.endsWith("to-incheon-airport")) return "toAirport";
  if (slug.startsWith("incheon-airport-to") || slug.startsWith("gimpo-airport-to")) return "fromAirport";
  return "balanced";
}
