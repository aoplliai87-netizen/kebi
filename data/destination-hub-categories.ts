/**
 * /destinations 허브 페이지 카테고리 — 슬러그는 한 번만 첫 매칭 카테고리에 표시
 */
export const HUB_CATEGORY_ORDER = ["popular", "foreign_vip", "gyeonggi_north", "family_theme"] as const;
export type HubCategoryId = (typeof HUB_CATEGORY_ORDER)[number];

/** 카테고리별 대표 슬러그 (우선순위 순으로 검사, 중복 시 앞 카테고리만) */
export const HUB_CATEGORY_SLUGS: Record<HubCategoryId, readonly string[]> = {
  popular: [
    "incheon-airport-to-seoul",
    "incheon-airport-to-gangnam",
    "gangnam-to-incheon-airport",
    "dawn-airport-pickup",
  ],
  foreign_vip: ["foreigner-incheon-airport-meet", "incheon-airport-to-myeongdong", "korea-golf-tour"],
  gyeonggi_north: [
    "uijeongbu-to-incheon-airport",
    "nowon-to-incheon-airport",
    "gangbuk-to-incheon-airport",
    "namyangju-to-incheon-airport",
    "guri-to-incheon-airport",
    "yangju-to-incheon-airport",
    "dongducheon-to-incheon-airport",
    "byeolnae-to-incheon-airport",
    "suyu-to-incheon-airport",
    "changdong-to-incheon-airport",
    "dobong-to-incheon-airport",
  ],
  family_theme: [
    "family-airport-transfer",
    "family-airport-pickup-korea",
    "golf-bag-airport-transfer",
    "dawn-incheon-transfer",
    "dawn-airport-sanding-korea",
    "heavy-luggage-incheon-transfer",
    "incheon-airport-group-van",
  ],
};

export function bucketDestinationSlugs(allSlugs: readonly string[]): Record<HubCategoryId | "other", string[]> {
  const buckets: Record<HubCategoryId | "other", string[]> = {
    popular: [],
    foreign_vip: [],
    gyeonggi_north: [],
    family_theme: [],
    other: [],
  };
  const assigned = new Set<string>();
  for (const cat of HUB_CATEGORY_ORDER) {
    for (const slug of HUB_CATEGORY_SLUGS[cat]) {
      if (!allSlugs.includes(slug) || assigned.has(slug)) continue;
      buckets[cat].push(slug);
      assigned.add(slug);
    }
  }
  for (const slug of allSlugs) {
    if (!assigned.has(slug)) buckets.other.push(slug);
  }
  return buckets;
}
