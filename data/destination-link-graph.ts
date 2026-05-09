/**
 * 목적지 랜딩 간 내부링크 — 지역/목적 기반 (related → popular → recommended → 경기북부)
 * slug 페이지에서 merge 되며, 개별 LandingPage 필드가 있으면 그쪽이 앞에 붙습니다.
 */
export type DestinationLinkHints = {
  relatedSlugs?: string[];
  popularSlugs?: string[];
  /** 테마·공항 중심 추천 (단체·외국인·짐 등) */
  recommendedSlugs?: string[];
  /** 의정부·노원·남양주 등 북부 권역 연계 */
  northGyeonggiSlugs?: string[];
};

const NORTH_ICN: string[] = [
  "uijeongbu-to-incheon-airport",
  "nowon-to-incheon-airport",
  "gangbuk-to-incheon-airport",
  "namyangju-to-incheon-airport",
  "guri-to-incheon-airport",
  "yangju-to-incheon-airport",
];

export const DESTINATION_LINK_GRAPH: Record<string, DestinationLinkHints> = {
  "incheon-airport-to-gangnam": {
    relatedSlugs: ["gangnam-to-incheon-airport"],
    popularSlugs: ["incheon-airport-to-seoul", "family-airport-transfer", "dawn-airport-pickup"],
    recommendedSlugs: ["foreigner-incheon-airport-meet", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "uijeongbu-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "incheon-airport-to-seoul": {
    relatedSlugs: ["gangnam-to-incheon-airport"],
    popularSlugs: ["incheon-airport-to-gangnam", "dawn-airport-pickup", "family-airport-transfer"],
    recommendedSlugs: ["foreigner-incheon-airport-meet", "family-airport-pickup-korea"],
    northGyeonggiSlugs: ["gangbuk-to-incheon-airport", "guri-to-incheon-airport", "yangju-to-incheon-airport"],
  },
  "incheon-airport-to-myeongdong": {
    relatedSlugs: ["gangnam-to-incheon-airport"],
    popularSlugs: ["incheon-airport-to-gangnam", "family-airport-transfer", "golf-bag-airport-transfer"],
    recommendedSlugs: ["foreigner-incheon-airport-meet", "heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "suyu-to-incheon-airport"],
  },
  "gangnam-to-incheon-airport": {
    relatedSlugs: ["incheon-airport-to-gangnam"],
    popularSlugs: ["dawn-airport-pickup", "family-airport-transfer", "pangyo-to-incheon-airport"],
    recommendedSlugs: ["dawn-incheon-transfer", "dawn-airport-sanding-korea", "heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "jamsil-to-incheon-airport": {
    relatedSlugs: ["incheon-airport-to-jamsil"],
    popularSlugs: ["family-airport-transfer", "gangnam-to-incheon-airport", "dawn-airport-pickup"],
    recommendedSlugs: ["family-airport-pickup-korea", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["guri-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "pangyo-to-incheon-airport": {
    relatedSlugs: ["incheon-airport-to-pangyo"],
    popularSlugs: ["gangnam-to-incheon-airport", "suwon-to-incheon-airport", "dongtan-to-incheon-airport"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "golf-bag-airport-transfer"],
    northGyeonggiSlugs: ["byeolnae-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "suwon-to-incheon-airport": {
    relatedSlugs: ["incheon-airport-to-suwon"],
    popularSlugs: ["dongtan-to-incheon-airport", "pangyo-to-incheon-airport", "family-airport-transfer"],
    recommendedSlugs: ["dawn-incheon-transfer", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport", "uijeongbu-to-incheon-airport"],
  },
  "dongtan-to-incheon-airport": {
    relatedSlugs: ["suwon-to-incheon-airport"],
    popularSlugs: ["family-airport-transfer", "dawn-airport-pickup", "golf-bag-airport-transfer"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "family-airport-pickup-korea"],
    northGyeonggiSlugs: ["byeolnae-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "uijeongbu-to-incheon-airport": {
    relatedSlugs: ["nowon-to-incheon-airport", "gimpo-airport-to-uijeongbu"],
    popularSlugs: ["dawn-incheon-transfer", "family-airport-transfer", "dawn-airport-sanding-korea"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport", "dongducheon-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "gimpo-airport-to-uijeongbu": {
    relatedSlugs: ["uijeongbu-to-incheon-airport"],
    popularSlugs: ["family-airport-pickup-korea", "gangbuk-to-incheon-airport"],
    recommendedSlugs: ["foreigner-incheon-airport-meet"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "guri-to-incheon-airport"],
  },
  "dawn-airport-pickup": {
    relatedSlugs: ["dawn-incheon-transfer"],
    popularSlugs: ["family-airport-transfer", "golf-bag-airport-transfer", "incheon-airport-to-gangnam"],
    recommendedSlugs: ["dawn-airport-sanding-korea", "heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: NORTH_ICN,
  },
  "family-airport-transfer": {
    relatedSlugs: ["family-airport-pickup-korea"],
    popularSlugs: ["gangnam-to-incheon-airport", "jamsil-to-incheon-airport", "incheon-airport-to-gangnam"],
    recommendedSlugs: ["dawn-airport-pickup", "heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "namyangju-to-incheon-airport", "uijeongbu-to-incheon-airport"],
  },
  "golf-bag-airport-transfer": {
    relatedSlugs: ["korea-golf-tour"],
    popularSlugs: ["gangnam-to-incheon-airport", "family-airport-transfer", "incheon-airport-to-gangnam"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["pangyo-to-incheon-airport", "suwon-to-incheon-airport"],
  },
  "korea-golf-tour": {
    relatedSlugs: ["golf-bag-airport-transfer"],
    popularSlugs: ["incheon-airport-to-gangnam", "family-airport-transfer"],
    recommendedSlugs: ["foreigner-incheon-airport-meet"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport"],
  },

  "nowon-to-incheon-airport": {
    relatedSlugs: ["gangbuk-to-incheon-airport", "uijeongbu-to-incheon-airport"],
    popularSlugs: ["dawn-incheon-transfer", "family-airport-pickup-korea", "dawn-airport-sanding-korea"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["namyangju-to-incheon-airport", "guri-to-incheon-airport", "yangju-to-incheon-airport"],
  },
  "gangbuk-to-incheon-airport": {
    relatedSlugs: ["suyu-to-incheon-airport", "nowon-to-incheon-airport"],
    popularSlugs: ["family-airport-transfer", "dawn-incheon-transfer", "changdong-to-incheon-airport"],
    recommendedSlugs: ["family-airport-pickup-korea", "foreigner-incheon-airport-meet"],
    northGyeonggiSlugs: ["uijeongbu-to-incheon-airport", "guri-to-incheon-airport"],
  },
  "suyu-to-incheon-airport": {
    relatedSlugs: ["gangbuk-to-incheon-airport", "dobong-to-incheon-airport"],
    popularSlugs: ["nowon-to-incheon-airport", "dawn-airport-sanding-korea", "heavy-luggage-incheon-transfer"],
    recommendedSlugs: ["family-airport-pickup-korea"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "changdong-to-incheon-airport": {
    relatedSlugs: ["dobong-to-incheon-airport", "nowon-to-incheon-airport"],
    popularSlugs: ["uijeongbu-to-incheon-airport", "dawn-incheon-transfer", "family-airport-transfer"],
    recommendedSlugs: ["incheon-airport-group-van"],
    northGyeonggiSlugs: ["dongducheon-to-incheon-airport", "yangju-to-incheon-airport"],
  },
  "dobong-to-incheon-airport": {
    relatedSlugs: ["changdong-to-incheon-airport", "suyu-to-incheon-airport"],
    popularSlugs: ["gangbuk-to-incheon-airport", "dawn-airport-pickup"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: ["uijeongbu-to-incheon-airport", "nowon-to-incheon-airport"],
  },
  "byeolnae-to-incheon-airport": {
    relatedSlugs: ["namyangju-to-incheon-airport", "guri-to-incheon-airport"],
    popularSlugs: ["uijeongbu-to-incheon-airport", "dawn-incheon-transfer", "heavy-luggage-incheon-transfer"],
    recommendedSlugs: ["family-airport-transfer", "incheon-airport-group-van"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport", "dongducheon-to-incheon-airport"],
  },
  "namyangju-to-incheon-airport": {
    relatedSlugs: ["byeolnae-to-incheon-airport", "guri-to-incheon-airport"],
    popularSlugs: ["uijeongbu-to-incheon-airport", "dawn-airport-sanding-korea", "family-airport-transfer"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "golf-bag-airport-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "yangju-to-incheon-airport"],
  },
  "guri-to-incheon-airport": {
    relatedSlugs: ["namyangju-to-incheon-airport", "byeolnae-to-incheon-airport"],
    popularSlugs: ["gangbuk-to-incheon-airport", "dawn-incheon-transfer", "family-airport-pickup-korea"],
    recommendedSlugs: ["foreigner-incheon-airport-meet"],
    northGyeonggiSlugs: ["uijeongbu-to-incheon-airport", "nowon-to-incheon-airport"],
  },
  "yangju-to-incheon-airport": {
    relatedSlugs: ["uijeongbu-to-incheon-airport", "dongducheon-to-incheon-airport"],
    popularSlugs: ["dawn-incheon-transfer", "incheon-airport-group-van", "heavy-luggage-incheon-transfer"],
    recommendedSlugs: ["family-airport-transfer", "dawn-airport-sanding-korea"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "dongducheon-to-incheon-airport": {
    relatedSlugs: ["yangju-to-incheon-airport", "uijeongbu-to-incheon-airport"],
    popularSlugs: ["dawn-incheon-transfer", "dawn-airport-sanding-korea", "heavy-luggage-incheon-transfer"],
    recommendedSlugs: ["incheon-airport-group-van", "family-airport-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "namyangju-to-incheon-airport"],
  },

  "dawn-incheon-transfer": {
    relatedSlugs: ["dawn-airport-sanding-korea"],
    popularSlugs: ["dawn-airport-pickup", "gangnam-to-incheon-airport", "uijeongbu-to-incheon-airport"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer", "family-airport-transfer"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "dongducheon-to-incheon-airport"],
  },
  "dawn-airport-sanding-korea": {
    relatedSlugs: ["dawn-incheon-transfer"],
    popularSlugs: ["dawn-airport-pickup", "family-airport-transfer", "namyangju-to-incheon-airport"],
    recommendedSlugs: ["heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: NORTH_ICN,
  },
  "family-airport-pickup-korea": {
    relatedSlugs: ["family-airport-transfer"],
    popularSlugs: ["foreigner-incheon-airport-meet", "incheon-airport-to-seoul", "guri-to-incheon-airport"],
    recommendedSlugs: ["dawn-airport-pickup", "heavy-luggage-incheon-transfer"],
    northGyeonggiSlugs: ["uijeongbu-to-incheon-airport", "namyangju-to-incheon-airport"],
  },
  "heavy-luggage-incheon-transfer": {
    relatedSlugs: ["golf-bag-airport-transfer"],
    popularSlugs: ["family-airport-transfer", "incheon-airport-group-van", "dawn-incheon-transfer"],
    recommendedSlugs: ["family-airport-pickup-korea"],
    northGyeonggiSlugs: ["yangju-to-incheon-airport", "dongducheon-to-incheon-airport"],
  },
  "foreigner-incheon-airport-meet": {
    relatedSlugs: ["incheon-airport-to-seoul", "family-airport-pickup-korea"],
    popularSlugs: ["incheon-airport-to-gangnam", "incheon-airport-to-myeongdong", "gangnam-to-incheon-airport"],
    recommendedSlugs: ["incheon-airport-group-van", "korea-golf-tour"],
    northGyeonggiSlugs: ["nowon-to-incheon-airport", "guri-to-incheon-airport"],
  },
  "incheon-airport-group-van": {
    relatedSlugs: ["heavy-luggage-incheon-transfer"],
    popularSlugs: ["foreigner-incheon-airport-meet", "family-airport-transfer", "jamsil-to-incheon-airport"],
    recommendedSlugs: ["dawn-incheon-transfer", "golf-bag-airport-transfer"],
    northGyeonggiSlugs: ["namyangju-to-incheon-airport", "uijeongbu-to-incheon-airport", "yangju-to-incheon-airport"],
  },
};
