/**
 * 추가 인천·김포·수도권 SEO 랜딩 — 명동 템플릿을 기준으로 슬건별 고유 KO/EN 메타·본문을 덮어씁니다.
 */
import type { LandingFaqItem, LandingPage, LandingPageCopy, LandingPriceItem } from "./landing-pages";

type Loc = "ko" | "en" | "ja" | "zh";

function heroBox(src: string, altKo: string, altEn: string): Record<Loc, LandingPageCopy["hero"]> {
  const b = { src, width: 1200, height: 750 };
  return {
    ko: { ...b, alt: altKo },
    en: { ...b, alt: altEn },
    ja: { ...b, alt: altEn },
    zh: { ...b, alt: altEn },
  };
}

const H1 = heroBox(
  "/images/vehicles/staria-hero.png",
  "인천공항 연결 프라이빗 미니밴",
  "Private minivan airport transfer Korea",
);
const H2 = heroBox(
  "/images/vehicles/solati-hero.png",
  "인천공항 연결 대형 밴",
  "Large van airport transfer Korea",
);
const H3 = heroBox(
  "/images/vehicles/county-hero.png",
  "단체·대형 수하물 전용 밴",
  "Group van airport transfer Korea",
);

function sec(
  ko: [string, string, string],
  en: [string, string, string],
): { ko: LandingPageCopy["sections"]; en: LandingPageCopy["sections"] } {
  const hk = ["서비스 안내", "이동 구간 안내", "추천 대상"];
  const he = ["Service overview", "Route coverage", "Best suited for"];
  const ids = ["service", "coverage", "why"] as const;
  return {
    ko: ids.map((id, i) => ({ id, heading: hk[i], body: ko[i] })),
    en: ids.map((id, i) => ({ id, heading: he[i], body: en[i] })),
  };
}

/** 명동 기준 템플릿 (KO/EN 완전 분리) */
function baseTemplate(hero: Record<Loc, LandingPageCopy["hero"]>): { ko: LandingPageCopy; en: LandingPageCopy } {
  const { ko: sKo, en: sEn } = sec(
    [
      "터미널별 미팅 포인트를 안내하고 호텔·숙소 하차 위치를 확정합니다. 유모차·대형 가방은 사전 알림 시 배차를 조정합니다.",
      "목적지 주소·구역에 맞춰 공항고속도로·시내 간선을 선택합니다. 서울 및 수도권 다른 지역과 연계 이동도 상담 가능합니다.",
      "외국인 관광객·출장객, 첫 방문 서울 고객, 짐이 많은 가족 단위 이동에 적합합니다.",
    ],
    [
      "We confirm terminal meeting points and drop-off pins before departure.",
      "Routing adapts to your address across Seoul and neighboring cities when combined bookings are requested.",
      "Ideal for international travelers who prefer one private ride after a long flight.",
    ],
  );
  const ko: LandingPageCopy = {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    linkTitle: "",
    h1: "",
    lede: "",
    vehicleRecommendBlurb: "",
    travelTraitsLine: "",
    sections: sKo,
    pricingIntro:
      "거리·시간대·대기에 따라 정찰제로 안내합니다. 서울 및 수도권 전역 연계 동선은 예약 시 함께 확정합니다.",
    pricingItems: [
      { label: "인천공항 → 목적지", price: "구간별 정찰제", note: "통행료 포함 기준" },
      { label: "경유·대기", price: "사전 협의", note: "일정 반영" },
      { label: "심야·연착", price: "시간 재조정", note: "항공편 연동" },
    ],
    faq: [
      { q: "호텔 주소만 알려도 되나요?", a: "네. 건물명·출입구를 알려 주시면 됩니다." },
      { q: "영어 예약이 가능한가요?", a: "WhatsApp·온라인 폼으로 가능합니다." },
      { q: "비행기 연착 시?", a: "새 도착 시간을 알려 주시면 픽업을 조정합니다." },
    ],
    primaryCtaLabel: "예약·문의하기",
    secondaryCtaLabel: "요금 안내 보기",
    whatsappCtaLabel: "WhatsApp 문의",
    kakaoCtaLabel: "카카오톡 문의",
    homeLinkLabel: "홈으로",
    bookingPathLabel: "/booking",
    hero: hero.ko,
    localBusinessDescription: "",
    areaServedNames: ["Incheon International Airport", "Seoul", "South Korea"],
  };
  const en: LandingPageCopy = {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    linkTitle: "",
    h1: "",
    lede: "",
    vehicleRecommendBlurb: "",
    travelTraitsLine: "",
    sections: sEn,
    pricingIntro:
      "Quotes vary by distance and time window. Combined routes across Seoul and the capital region can be quoted together.",
    pricingItems: [
      { label: "ICN → destination", price: "Fixed-rate quote", note: "Tolls included basis" },
      { label: "Extra stops / waiting", price: "Discussed upfront", note: "Itinerary-based" },
      { label: "Late arrival / delay", price: "Rescheduled pickup", note: "Flight updates welcome" },
    ],
    faq: [
      { q: "Can I book in English?", a: "Yes—via WhatsApp or the online form." },
      { q: "Do you need my hotel address?", a: "Yes—building name and entrance details help us route precisely." },
      { q: "What if my flight is delayed?", a: "Share your new ETA and we adjust pickup timing." },
    ],
    primaryCtaLabel: "Book or inquire",
    secondaryCtaLabel: "See pricing",
    whatsappCtaLabel: "WhatsApp",
    kakaoCtaLabel: "KakaoTalk",
    homeLinkLabel: "Home",
    bookingPathLabel: "/booking",
    hero: hero.en,
    localBusinessDescription: "",
    areaServedNames: ["Incheon International Airport", "Seoul", "South Korea"],
  };
  return { ko, en };
}

function mergeCopy(base: LandingPageCopy, patch: Partial<LandingPageCopy>): LandingPageCopy {
  return {
    ...base,
    ...patch,
    keywords: patch.keywords ?? base.keywords,
    sections: patch.sections ?? base.sections,
    faq: patch.faq ?? base.faq,
    pricingItems: patch.pricingItems ?? base.pricingItems,
    hero: patch.hero ?? base.hero,
    areaServedNames: patch.areaServedNames ?? base.areaServedNames,
  };
}

function buildPage(
  slug: string,
  jaMetaTitle: string,
  zhMetaTitle: string,
  hero: Record<Loc, LandingPageCopy["hero"]>,
  ko: Partial<LandingPageCopy>,
  en: Partial<LandingPageCopy>,
): LandingPage {
  const t = baseTemplate(hero);
  const k = mergeCopy(t.ko, ko);
  const e = mergeCopy(t.en, en);
  const ja: LandingPageCopy = { ...e, metaTitle: jaMetaTitle };
  const zh: LandingPageCopy = { ...e, metaTitle: zhMetaTitle };
  return { slug, byLocale: { ko: k, en: e, ja, zh } };
}

export const MORE_DESTINATION_LANDINGS: LandingPage[] = [
  buildPage(
    "incheon-airport-to-myeongdong",
    "仁川空港から明洞へ｜貸切バン",
    "仁川机场至明洞｜专车包车",
    H1,
    {
      metaTitle: "인천공항 명동 픽업·콜밴 | 쇼핑·관광 동선 맞춤 이동",
      metaDescription:
        "인천공항에서 명동·소공·을지로까지 프라이빗 밴. 외국인 관광객 맞춤 미팅. 서울 및 수도권 일대 예약 가능.",
      keywords: ["인천공항 명동", "명동 픽업", "Myeongdong airport transfer", "인천 명동 콜밴"],
      linkTitle: "인천공항 → 명동",
      h1: "인천공항에서 명동까지 프라이빗 밴 이동",
      lede:
        "명동 상권·호텔까지 한 번에 연결합니다. 환전·쇼핑 일정에 맞춰 도착 시간과 하차 지점을 조정합니다.",
      vehicleRecommendBlurb: "짐이 많은 관광객에게는 스타리아·카니발급 미니밴을 우선 배정합니다.",
      travelTraitsLine:
        "공항고속도로 교통 상황에 따라 소요 시간이 달라지며, 서울 및 수도권 다른 목적지 경유도 상담 가능합니다.",
      sections: sec(
        [
          "명동·소공·남대문 인근 호텔까지 차량 진입 가능 지점을 안내합니다.",
          "관광·쇼핑 동선을 고려해 공항에서 시내까지 최단 루트를 제안합니다.",
          "첫 서울 방문 외국인 관광객과 가족 단위 고객에게 적합합니다.",
        ],
        [
          "We align drop-offs with hotel access rules around Myeongdong retail blocks.",
          "Routing prioritizes predictable ETA into downtown Seoul after ICN arrival.",
          "Ideal for shoppers and tourists who want door-to-door comfort after long flights.",
        ],
      ).ko,
      faq: [
        { q: "명동 호텔만 알려도 되나요?", a: "네. 주소를 알려 주시면 하차 지점을 안내합니다." },
        { q: "환전 후 이동도 가능한가요?", a: "동선에 따라 가능 여부를 상담 시 확정합니다." },
        { q: "영어 문의?", a: "WhatsApp으로 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 명동 상권을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Myeongdong", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Myeongdong | Private Van Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Myeongdong—tourist-friendly meet-and-greet, luggage-friendly vans, coverage across Seoul and the broader metro area.",
      keywords: ["Incheon to Myeongdong", "Myeongdong airport transfer", "ICN van Korea", "private van Seoul"],
      linkTitle: "Incheon Airport → Myeongdong",
      h1: "Incheon Airport to Myeongdong Private Van Transfer",
      lede:
        "Door-to-door service into Myeongdong—perfect for visitors heading straight to hotels and shopping streets.",
      vehicleRecommendBlurb: "Minibuses are prioritized when luggage volume is high.",
      travelTraitsLine:
        "Travel time varies with highway traffic; combined routes across Seoul can be quoted together.",
      sections: sec(
        [
          "명동·소공·남대문 인근 호텔까지 차량 진입 가능 지점을 안내합니다.",
          "관광·쇼핑 동선을 고려해 공항에서 시내까지 최단 루트를 제안합니다.",
          "첫 서울 방문 외국인 관광객과 가족 단위 고객에게 적합합니다.",
        ],
        [
          "Meet-and-greet aligned with your terminal and arrival gate.",
          "Coverage for major hotels around Myeongdong and Euljiro access roads.",
          "Great for first-time visitors who want a seamless ICN arrival experience.",
        ],
      ).en,
      faq: [
        { q: "Hotel-only address?", a: "Yes—share the official hotel name and address." },
        { q: "English booking?", a: "Yes via WhatsApp or online form." },
        { q: "Delayed flight?", a: "Notify us for a new pickup window." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Myeongdong.",
      areaServedNames: ["Incheon International Airport", "Myeongdong", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-hongdae",
    "仁川空港から弘大へ｜深夜便対応バン",
    "仁川机场至弘大｜深夜航班包车",
    H1,
    {
      metaTitle: "인천공항 홍대 픽업 | 밤비행·공연 일정 맞춤 콜밴",
      metaDescription:
        "인천공항에서 홍대·상수·합정까지 프라이빗 밴. K-컬처·공연·숙소 동선에 맞춘 픽업. 서울 및 수도권 연계 가능.",
      keywords: ["인천공항 홍대", "홍대 픽업", "Hongdae airport transfer", "인천 홍대 콜밴"],
      linkTitle: "인천공항 → 홍대",
      h1: "인천공항에서 홍대까지 프라이빗 밴 이동",
      lede:
        "홍익대·상수·연남 등 홍대 권역 호텔·게스트하우스까지 동선을 맞춥니다. 심야 도착 스케줄도 반영합니다.",
      vehicleRecommendBlurb: "대형 캐리어·악기 동반 시 미니밴 이상 차종으로 배정합니다.",
      travelTraitsLine: "주말 심야에는 홍대 상권 주변 차량 통제가 있을 수 있어 하차 지점을 사전 조율합니다.",
      sections: sec(
        [
          "터미널별 미팅 후 홍대 접근로에 맞춰 안내합니다.",
          "합정·디지털단지 방향 등 목적지에 따라 진입로가 달라집니다.",
          "공연·페스티벌 일정에 맞춘 픽업·샌딩을 지원합니다.",
        ],
        [
          "Meet-and-greet tailored for Hongdae’s hotel lanes and guesthouse clusters.",
          "Routing considers late-night venue traffic near Hongdae station.",
          "Ideal for travelers catching concerts or nightlife after landing at ICN.",
        ],
      ).ko,
      faq: [
        { q: "새벽 도착도 가능?", a: "네. 항공편 시간에 맞춰 조정합니다." },
        { q: "연남동까지 가능?", a: "주소 알려 주시면 진입 가능 지점으로 안내합니다." },
        { q: "영어 가능?", a: "WhatsApp 영문 예약 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 홍대 권역을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Hongdae", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Hongdae | Late Flight Friendly Van",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Hongdae—ideal for nightlife, concerts, and guesthouses near Hongik University. Seoul metro-wide routing available.",
      keywords: ["Incheon to Hongdae", "Hongdae airport transfer", "ICN to Hongdae van", "Korea night pickup"],
      linkTitle: "Incheon Airport → Hongdae",
      h1: "Incheon Airport to Hongdae Private Van Transfer",
      lede:
        "Door-to-door service into Hongdae’s cafe and nightlife zone—great for travelers with late arrivals.",
      vehicleRecommendBlurb: "Tell us about oversized luggage or instruments for the right van size.",
      travelTraitsLine: "Weekend nights may have crowd control near Hongdae—drop-off pin confirmed when you book.",
      sections: sec(
        [
          "터미널별 미팅 후 홍대 접근로에 맞춰 안내합니다.",
          "합정·디지털단지 방향 등 목적지에 따라 진입로가 달라집니다.",
          "공연·페스티벌 일정에 맞춘 픽업·샌딩을 지원합니다.",
        ],
        [
          "Meeting instructions matched to your arrival hall.",
          "Coverage for Hongdae, Hapjeong, and Sangsu addresses.",
          "Perfect for visitors combining ICN arrival with nightlife plans.",
        ],
      ).en,
      faq: [
        { q: "Late-night pickup?", a: "Yes—aligned with your flight ETA." },
        { q: "Drop-off at Yeonnam?", a: "Share the exact address for routing rules." },
        { q: "English support?", a: "WhatsApp booking available." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Hongdae.",
      areaServedNames: ["Incheon International Airport", "Hongdae", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-coex",
    "仁川空港からCOEXへ｜展示会・会議向け送迎",
    "仁川机场至COEX｜展会会议包车",
    H2,
    {
      metaTitle: "인천공항 코엑스 픽업 | 전시·회의 일정 맞춤 프라이빗 밴",
      metaDescription:
        "인천공항에서 삼성 코엑스·무역센터까지 프라이빗 밴. 박람회·비즈니스 방문객 대응. 외국인 출장객 검색 키워드 반영.",
      keywords: ["인천공항 코엑스", "COEX 픽업", "COEX airport transfer", "삼성역 공항"],
      linkTitle: "인천공항 → 코엑스",
      h1: "인천공항에서 코엑스·삼성역까지 프라이빗 밴",
      lede:
        "전시 입장·컨퍼런스 일정에 맞춰 도착 시간을 조정합니다. 무역센터·코엑스 동선에 익숙하게 연결합니다.",
      vehicleRecommendBlurb: "전시 장비·샘플 박스 동반 시 적재 높이에 맞는 차량을 배정합니다.",
      travelTraitsLine: "삼성역 주변 행사 시 교통이 몰릴 수 있어 하차 게이트를 사전에 조율합니다.",
      sections: sec(
        [
          "전시장 입구·회의동선에 맞춘 하차 포인트를 안내합니다.",
          "영문 일정표를 주시면 픽업 시간을 제안합니다.",
          "단체 인원도 차량 클래스를 나눠 배차 가능합니다.",
        ],
        [
          "Drop-offs coordinated with COEX and Trade Tower entrances.",
          "Share your badge pickup time—we propose pickup windows.",
          "Supports corporate groups visiting exhibitions or forums.",
        ],
      ).ko,
      faq: [
        { q: "전시 부스 근처까지 가능?", a: "행사 안내에 따라 가능한 지점으로 안내합니다." },
        { q: "영문 일정표 전달?", a: "가능합니다. 시간 조정에 활용합니다." },
        { q: "연착 시?", a: "도착 시간 알림 후 픽업 재조정합니다." },
      ],
      localBusinessDescription: "인천국제공항과 코엑스·삼성 비즈니스 권역을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "COEX", "Gangnam", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to COEX | Convention & MICE Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to COEX and Samsung station area—built for trade-show visitors, meetings, and English-friendly bookings.",
      keywords: ["Incheon to COEX", "COEX airport transfer", "Samsung station pickup", "MICE transfer Seoul"],
      linkTitle: "Incheon Airport → COEX",
      h1: "Incheon Airport to COEX & Samsung Station Private Van",
      lede:
        "Tailored for exhibition attendees—timing aligned with badge pickup, seminars, and hotel clusters near COEX.",
      vehicleRecommendBlurb: "Oversized booth materials? Tell us dimensions for van selection.",
      travelTraitsLine: "Event days may add congestion near Samsung—drop-off gates confirmed when you book.",
      sections: sec(
        [
          "전시장 입구·회의동선에 맞춘 하차 포인트를 안내합니다.",
          "영문 일정표를 주시면 픽업 시간을 제안합니다.",
          "단체 인원도 차량 클래스를 나눠 배차 가능합니다.",
        ],
        [
          "Drop-off guidance for COEX exhibition entrances.",
          "Share event schedules—we tune pickup times accordingly.",
          "Ideal for international delegates landing at ICN.",
        ],
      ).en,
      faq: [
        { q: "Closest hall drop-off?", a: "We follow venue rules shared by organizers." },
        { q: "Share agenda in English?", a: "Yes—helps us schedule realistically." },
        { q: "Flight delayed?", a: "Message us to reschedule pickup." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and COEX Gangnam.",
      areaServedNames: ["Incheon International Airport", "COEX", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-jamsil",
    "仁川空港から蚕室へ｜ロッテワールド観光送迎",
    "仁川机场至蚕室｜乐天世界包车",
    H2,
    {
      metaTitle: "인천공항 잠실 픽업 | 롯데월드·석촌 호텔 동선 콜밴",
      metaDescription:
        "인천공항에서 잠실·석촌·송파까지 프라이빗 밴. 가족 여행·테마파크 일정에 맞춘 픽업. 서울 및 수도권 연계 가능.",
      keywords: ["인천공항 잠실", "잠실 픽업", "Jamsil airport transfer", "롯데월드 공항"],
      linkTitle: "인천공항 → 잠실",
      h1: "인천공항에서 잠실·송파까지 프라이빗 밴",
      lede:
        "잠실 종합운동장·롯데월드·석촌 호텔까지 동선을 맞춥니다. 유아 동반 가족 이동에 적합합니다.",
      vehicleRecommendBlurb: "유모차·대형 캐리어 동반 시 미니밴 이상 권장합니다.",
      travelTraitsLine: "주말·공휴일에는 잠실 일대 교통이 혼잡할 수 있습니다.",
      sections: sec(
        [
          "테마파크 입장 시간에 맞춘 도착 스케줄을 제안합니다.",
          "석촌호수·롯데타워 일대 호텔까지 안내합니다.",
          "가족 단위 고객 배차 경험을 바탕으로 좌석 구성을 조정합니다.",
        ],
        [
          "Timed arrivals for Lotte World schedules and nearby hotels.",
          "Coverage for Jamsil Sports Complex events when addresses are shared.",
          "Family-friendly luggage handling after ICN arrivals.",
        ],
      ).ko,
      faq: [
        { q: "롯데호텔까지 가능?", a: "네. 호텔 출입구 정보를 알려 주세요." },
        { q: "유모차 접수?", a: "사전에 알려 주시면 적합한 차량으로 배정합니다." },
        { q: "영어 예약?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 잠실·송파 권역을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Jamsil", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Jamsil | Lotte World Family Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Jamsil—Lotte World, hotels near Seokchon Lake, family-friendly luggage space.",
      keywords: ["Incheon to Jamsil", "Jamsil airport transfer", "Lotte World pickup", "Songpa van"],
      linkTitle: "Incheon Airport → Jamsil",
      h1: "Incheon Airport to Jamsil & Songpa Private Van",
      lede:
        "Great for families heading to Lotte World or hotels around Seokchon—door-to-door comfort after ICN.",
      vehicleRecommendBlurb: "Child seats available on request when notified early.",
      travelTraitsLine: "Weekends around Jamsil can be busy—pickup windows confirmed up front.",
      sections: sec(
        [
          "테마파크 입장 시간에 맞춘 도착 스케줄을 제안합니다.",
          "석촌호수·롯데타워 일대 호텔까지 안내합니다.",
          "가족 단위 고객 배차 경험을 바탕으로 좌석 구성을 조정합니다.",
        ],
        [
          "Planning aligned with Lotte World operating hours.",
          "Coverage for Songpa hotels along Olympic-ro.",
          "Ideal for travelers avoiding transfers with kids and bags.",
        ],
      ).en,
      faq: [
        { q: "Hotel drop at Lotte?", a: "Yes—share tower/wing details." },
        { q: "Strollers?", a: "Tell us in advance for trunk planning." },
        { q: "English booking?", a: "Available via WhatsApp." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Jamsil.",
      areaServedNames: ["Incheon International Airport", "Jamsil", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-seoul-station",
    "仁川空港からソウル駅へ｜KTX・鉄道接続送迎",
    "仁川机场至首尔站｜KTX铁路接驳包车",
    H1,
    {
      metaTitle: "인천공항 서울역 픽업 | KTX·지하철 연계 동선 콜밴",
      metaDescription:
        "인천공항에서 서울역·중구 일대까지 프라이빗 밴. KTX·공항리무진 연계 고객 동선에 맞춘 이동. 서울 및 수도권 연결 가능.",
      keywords: ["인천공항 서울역", "서울역 픽업", "Seoul station airport transfer"],
      linkTitle: "인천공항 → 서울역",
      h1: "인천공항에서 서울역·중구까지 프라이빗 밴",
      lede:
        "KTX·수도권 광역열차 연계 고객에게 공항 도착 후 서울역 접근을 빠르게 연결합니다.",
      vehicleRecommendBlurb: "대형 캐리어 다수 시 미니밴 이상 권장합니다.",
      travelTraitsLine: "서울역 주변은 보행·차량 통제 구간이 있어 하차 지점을 함께 조율합니다.",
      sections: sec(
        [
          "공항 도착 시간과 열차 시간을 함께 받아 동선을 제안합니다.",
          "서울역 인근 호텔·숙소까지 연결합니다.",
          "출장객·관광객 모두 이용 가능합니다.",
        ],
        [
          "Great for travelers connecting to KTX after landing at ICN.",
          "Hotel drops near Seoul Station and Plaza.",
          "Supports tight transfer windows when you share schedules.",
        ],
      ).ko,
      faq: [
        { q: "KTX 시간에 맞출 수 있나요?", a: "열차 시간표를 알려 주시면 동선을 제안합니다." },
        { q: "서울역 호텔까지?", a: "주소 기준으로 진입 가능 지점을 안내합니다." },
        { q: "연착 시?", a: "픽업 시간 재조정 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 서울역 권역을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Seoul Station", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Seoul Station | KTX Connection Van",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Seoul Station—ideal for KTX transfers, downtown hotels, and tight schedules.",
      keywords: ["Incheon to Seoul Station", "Seoul Station transfer", "KTX connection van"],
      linkTitle: "Incheon Airport → Seoul Station",
      h1: "Incheon Airport to Seoul Station Private Van",
      lede:
        "Smooth link from ICN arrivals to Seoul Station hotels and rail connections—great when train timing matters.",
      vehicleRecommendBlurb: "Heavy suitcases? We assign vans with ample luggage space.",
      travelTraitsLine: "Seoul Station roads can be crowded—drop-off points coordinated when booking.",
      sections: sec(
        [
          "공항 도착 시간과 열차 시간을 함께 받아 동선을 제안합니다.",
          "서울역 인근 호텔·숙소까지 연결합니다.",
          "출장객·관광객 모두 이용 가능합니다.",
        ],
        [
          "Share both flight and train times—we advise buffers.",
          "Coverage for Jung-gu hotels walking distance to KTX.",
          "Avoid dragging luggage through subway stairs.",
        ],
      ).en,
      faq: [
        { q: "Match KTX departure?", a: "Share times—we propose pickup buffers." },
        { q: "Hotel near station?", a: "Yes—pin required." },
        { q: "Delayed flight?", a: "We reschedule pickup." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Seoul Station.",
      areaServedNames: ["Incheon International Airport", "Seoul Station", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-seongsu",
    "仁川空港から聖水へ｜カフェ街・ブランド展示送迎",
    "仁川机场至圣水｜咖啡厅街区包车",
    H1,
    {
      metaTitle: "인천공항 성수 픽업 | 카페·팝업 거리 동선 맞춤 이동",
      metaDescription:
        "인천공항에서 성수·뚝섬 일대까지 프라이빗 밴. 브랜드 이벤트·쇼룸 방문 동선에 맞춘 픽업.",
      keywords: ["인천공항 성수", "성수 픽업", "Seongsu airport transfer"],
      linkTitle: "인천공항 → 성수동",
      h1: "인천공항에서 성수·뚝섬까지 프라이빗 밴",
      lede:
        "성수 카페 거리·쇼룸 밀집 지역까지 목적지 주소에 맞춰 연결합니다.",
      vehicleRecommendBlurb: "협골 도로·주차 제한이 있는 블록은 하차 포인트를 함께 정합니다.",
      travelTraitsLine: "주말에는 성수 일대 통행이 느려질 수 있습니다.",
      sections: sec(
        [
          "성수동 내 세부 주소 기준으로 진입로를 선택합니다.",
          "팝업·전시 일정에 맞춘 시간 조정이 가능합니다.",
          "외국인 관광객 동선에 맞춘 안내를 제공합니다.",
        ],
        [
          "Precise pins matter in Seongsu’s café district.",
          "Timed pickups for showroom visits or brand events.",
          "Popular with travelers exploring Seoul’s east-side creative quarter.",
        ],
      ).ko,
      faq: [
        { q: "쇼룸 주소만 있으면 되나요?", a: "네. 건물 출입 정보를 함께 주세요." },
        { q: "주말 예약?", a: "혼잡 시간대를 안내해 드립니다." },
        { q: "영어 문의?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 성수 권역을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Seongsu", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Seongsu | Café District Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Seongsu—perfect for showroom visits, café hopping, and east Seoul pins.",
      keywords: ["Incheon to Seongsu", "Seongsu transfer", "Seoul east side van"],
      linkTitle: "Incheon Airport → Seongsu",
      h1: "Incheon Airport to Seongsu Private Van Transfer",
      lede:
        "Drop-offs tuned for Seongsu’s café streets—avoid hauling luggage through crowds after ICN.",
      vehicleRecommendBlurb: "Narrow lanes mean precise drop-off coordination.",
      travelTraitsLine: "Weekend traffic around Seongsu can slow trips—ETA shared honestly.",
      sections: sec(
        [
          "성수동 내 세부 주소 기준으로 진입로를 선택합니다.",
          "팝업·전시 일정에 맞춘 시간 조정이 가능합니다.",
          "외국인 관광객 동선에 맞춘 안내를 제공합니다.",
        ],
        [
          "Meeting instructions matched to ICN arrival halls.",
          "Coverage for addresses near Seongsu station exits.",
          "Ideal when trains aren’t ideal with heavy luggage.",
        ],
      ).en,
      faq: [
        { q: "Showroom address only?", a: "Provide building access notes." },
        { q: "Weekend traffic?", a: "We factor congestion into ETA." },
        { q: "English?", a: "WhatsApp booking works." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Seongsu.",
      areaServedNames: ["Incheon International Airport", "Seongsu", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-yeouido",
    "仁川空港から汝矣島へ｜金融街・議会エリア送迎",
    "仁川机场至汝矣岛｜金融区包车",
    H2,
    {
      metaTitle: "인천공항 여의도 픽업 | 금융가·방송국 동선 콜밴",
      metaDescription:
        "인천공항에서 여의도·영등포까지 프라이빗 밴. 금융·방송 일정에 맞춘 픽업. 서울 및 수도권 연계 가능.",
      keywords: ["인천공항 여의도", "여의도 픽업", "Yeouido airport transfer"],
      linkTitle: "인천공항 → 여의도",
      h1: "인천공항에서 여의도·영등포까지 프라이빗 밴",
      lede:
        "여의도 금융가·공공기관·방송국 일대까지 안내에 맞춰 연결합니다.",
      vehicleRecommendBlurb: "출장 서류·장비 동반 시 적재 공간을 확보해 배정합니다.",
      travelTraitsLine: "평일 출근 시간대에는 여의도 접근로가 혼잡할 수 있습니다.",
      sections: sec(
        [
          "회의 일정에 맞춘 도착 시간 조정이 가능합니다.",
          "여의도 내 빌딩 출입 정보를 바탕으로 하차 지점을 안내합니다.",
          "외국인 출장객 영문 예약을 지원합니다.",
        ],
        [
          "Corporate-focused timing for Yeouido towers.",
          "Drop-offs aligned with lobby access rules.",
          "Popular with finance and media visitors arriving via ICN.",
        ],
      ).ko,
      faq: [
        { q: "증권가 빌딩 앞 가능?", a: "건물별 진입 규정에 따라 안내합니다." },
        { q: "영문 일정표?", a: "전달 가능합니다." },
        { q: "연착 시?", a: "픽업 재조정합니다." },
      ],
      localBusinessDescription: "인천국제공항과 여의도 업무 지구를 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Yeouido", "Seoul"],
    },
    {
      metaTitle: "Incheon Airport to Yeouido | IFC & Finance District Van",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Yeouido—finance towers, broadcast hubs, and Yeongdeungpo addresses.",
      keywords: ["Incheon to Yeouido", "Yeouido transfer", "IFC Seoul pickup"],
      linkTitle: "Incheon Airport → Yeouido",
      h1: "Incheon Airport to Yeouido Private Van Transfer",
      lede:
        "Tailored for business travelers heading to IFC-area towers after landing at ICN.",
      vehicleRecommendBlurb: "Equipment cases welcome—tell us dimensions.",
      travelTraitsLine: "Weekday rush hours may extend travel time—buffers advised.",
      sections: sec(
        [
          "회의 일정에 맞춘 도착 시간 조정이 가능합니다.",
          "여의도 내 빌딩 출입 정보를 바탕으로 하차 지점을 안내합니다.",
          "외국인 출장객 영문 예약을 지원합니다.",
        ],
        [
          "Share meeting windows—we tune pickup timing.",
          "Drop-offs near major towers with lobby guidance.",
          "Ideal for ICN arrivals straight into finance meetings.",
        ],
      ).en,
      faq: [
        { q: "IFC drop-off?", a: "Provide tower lobby instructions." },
        { q: "English itinerary?", a: "Yes—helps scheduling." },
        { q: "Flight delay?", a: "We adjust pickup." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Yeouido.",
      areaServedNames: ["Incheon International Airport", "Yeouido", "Seoul"],
    },
  ),
  buildPage(
    "incheon-airport-to-pangyo",
    "仁川空港から판교へ｜テクノバレー送迎",
    "仁川机场至板桥｜科技城包车",
    H2,
    {
      metaTitle: "인천공항 판교 픽업 | 테크노밸리·분당 동선 콜밴",
      metaDescription:
        "인천공항에서 판교·분당까지 프라이빗 밴. 기업 출장·테크 캠퍼스 방문 동선에 맞춘 장거리 이동.",
      keywords: ["인천공항 판교", "판교 픽업", "Pangyo airport transfer"],
      linkTitle: "인천공항 → 판교",
      h1: "인천공항에서 판교·분당까지 프라이빗 밴",
      lede:
        "수도권 남동부로 이어지는 장거리 구간을 정찰제 기준으로 안내합니다. 출장 일정에 맞춰 휴게·경유를 조율합니다.",
      vehicleRecommendBlurb: "장거리 이동에는 넉넉한 연료·운행 시간 버퍼를 둡니다.",
      travelTraitsLine: "경부·영동 고속도로 교통량에 따라 소요 시간이 크게 달라질 수 있습니다.",
      sections: sec(
        [
          "판교 테크노밸리 내 사업장 주소 기준으로 안내합니다.",
          "출장 일정표를 받아 픽업 시간을 제안합니다.",
          "여러 인원 동반 시 대형 밴 배차가 가능합니다.",
        ],
        [
          "Long-distance quotes covering Pangyo and Bundang clusters.",
          "Corporate itineraries welcomed—share campus pins.",
          "Ideal when trains with luggage aren’t practical after ICN.",
        ],
      ).ko,
      faq: [
        { q: "판교까지 얼마나 걸리나요?", a: "교통 상황에 따라 상이하며 예약 시 참고 시간을 안내합니다." },
        { q: "대형 밴 가능?", a: "인원·짐에 따라 가능합니다." },
        { q: "영어 예약?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 판교 테크노밸리를 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Pangyo", "Seongnam", "South Korea"],
    },
    {
      metaTitle: "Incheon Airport to Pangyo | Tech Valley Corporate Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Pangyo—corporate campuses, Bundang addresses, long-distance fixed-rate guidance.",
      keywords: ["Incheon to Pangyo", "Pangyo transfer", "Bundang van ICN"],
      linkTitle: "Incheon Airport → Pangyo",
      h1: "Incheon Airport to Pangyo & Bundang Private Van",
      lede:
        "Door-to-door service for tech-campus travelers who need predictable timing after ICN arrivals.",
      vehicleRecommendBlurb: "Groups may require Solati/County-class vans—tell us headcount.",
      travelTraitsLine: "Highway congestion can swing ETA—buffers recommended.",
      sections: sec(
        [
          "판교 테크노밸리 내 사업장 주소 기준으로 안내합니다.",
          "출장 일정표를 받아 픽업 시간을 제안합니다.",
          "여러 인원 동반 시 대형 밴 배차가 가능합니다.",
        ],
        [
          "Share building names for Pangyo HQ complexes.",
          "English bookings via WhatsApp.",
          "Ideal alternative to trains with heavy kits.",
        ],
      ).en,
      faq: [
        { q: "How long is the ride?", a: "Depends on traffic—we quote realistic buffers." },
        { q: "Large vans?", a: "Available based on group size." },
        { q: "English?", a: "WhatsApp supported." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Pangyo.",
      areaServedNames: ["Incheon International Airport", "Pangyo", "South Korea"],
    },
  ),
  buildPage(
    "incheon-airport-to-suwon",
    "仁川空港から水原へ｜首都圏南部ドアツードア",
    "仁川机场至水原｜首都圈南部包车",
    H2,
    {
      metaTitle: "인천공항 수원 픽업 | 영통·광교·출장 동선 콜밴",
      metaDescription:
        "인천공항에서 수원·영통·광교까지 프라이빗 밴. 경기 남부 장거리 이동을 정찰제로 안내합니다.",
      keywords: ["인천공항 수원", "수원 픽업", "Suwon airport transfer"],
      linkTitle: "인천공항 → 수원",
      h1: "인천공항에서 수원·경기 남부까지 프라이빗 밴",
      lede:
        "경기 남부 장거리 구간을 짐·일정에 맞춰 안내합니다. 서울 및 수도권 다른 지역과 연계 일정도 상담 가능합니다.",
      vehicleRecommendBlurb: "장거리 운행 시 운전 시간 규정과 휴게 계획을 안내합니다.",
      travelTraitsLine: "수원 방향은 고속도로 구간이 길어 교통·날씨에 따라 시간 차이가 큽니다.",
      sections: sec(
        [
          "수원 시내·영통·광교 등 목적지별 최단 고속도로 루트를 선택합니다.",
          "출장 일정에 맞춰 도착 시간을 제안합니다.",
          "기업 방문·공장 동선 등 특수 목적 이동도 상담 가능합니다.",
        ],
        [
          "Long-distance ride planning from ICN toward Suwon hubs.",
          "Corporate travelers welcomed—share addresses early.",
          "Comfort-focused routing with toll-inclusive quotes.",
        ],
      ).ko,
      faq: [
        { q: "수원까지 거리?", a: "교통 상황에 따라 상이하며 예약 시 참고 시간을 드립니다." },
        { q: "경유 가능?", a: "동선에 따라 협의합니다." },
        { q: "영어?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 수원·경기 남부를 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Suwon", "Gyeonggi", "South Korea"],
    },
    {
      metaTitle: "Incheon Airport to Suwon | Gyeonggi South Door-to-Door",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Suwon—Yeongtong, Gwanggyo, and southern Gyeonggi addresses.",
      keywords: ["Incheon to Suwon", "Suwon transfer", "Gyeonggi van"],
      linkTitle: "Incheon Airport → Suwon",
      h1: "Incheon Airport to Suwon Private Van Transfer",
      lede:
        "Ideal for travelers heading south of Seoul—predictable quotes for longer highway segments.",
      vehicleRecommendBlurb: "High-capacity vans available for teams.",
      travelTraitsLine: "Highway weather and traffic can shift ETA—buffers help.",
      sections: sec(
        [
          "수원 시내·영통·광교 등 목적지별 최단 고속도로 루트를 선택합니다.",
          "출장 일정에 맞춰 도착 시간을 제안합니다.",
          "기업 방문·공장 동선 등 특수 목적 이동도 상담 가능합니다.",
        ],
        [
          "Share pins inside Suwon for precise routing.",
          "English coordination via WhatsApp.",
          "Better than dragging luggage across multiple trains.",
        ],
      ).en,
      faq: [
        { q: "Drive duration?", a: "Depends on traffic—we quote buffers." },
        { q: "Extra stops?", a: "Discuss during booking." },
        { q: "English?", a: "Supported." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Suwon.",
      areaServedNames: ["Incheon International Airport", "Suwon", "South Korea"],
    },
  ),
  buildPage(
    "incheon-airport-to-songdo",
    "仁川空港から松島へ｜国際都市コンベンション送迎",
    "仁川机场至松岛｜国际商务城包车",
    H2,
    {
      metaTitle: "인천공항 송도 픽업 | 국제업무지구·컨벤션 동선 콜밴",
      metaDescription:
        "인천공항에서 송도·연수구까지 프라이빗 밴. 컨벤션·호텔 밀집 지역 동선에 맞춘 단거리·중거리 이동.",
      keywords: ["인천공항 송도", "송도 픽업", "Songdo airport transfer"],
      linkTitle: "인천공항 → 송도",
      h1: "인천공항에서 송도·연수까지 프라이빗 밴",
      lede:
        "공항과 인접한 송도 국제도시까지 빠르게 연결합니다. 컨벤션·세미나 일정에 맞춰 도착 시간을 조정합니다.",
      vehicleRecommendBlurb: "단거리라도 짐이 많으면 미니밴 배정을 권장합니다.",
      travelTraitsLine: "송도 내 행사 일정에는 주변 도로가 일시적으로 혼잡할 수 있습니다.",
      sections: sec(
        [
          "송도 컨벤시아·호텔 클러스터까지 목적지별 안내.",
          "영문 초청장·행사 일정을 받아 시간을 제안합니다.",
          "외국인 참가자 픽업 동선에 익숙합니다.",
        ],
        [
          "Fast connectivity from ICN to Songdo’s convention shoreline.",
          "Supports conference delegates with tight seminar schedules.",
          "Ideal when Uber/taxi queues are unpredictable.",
        ],
      ).ko,
      faq: [
        { q: "컨벤시아까지 가능?", a: "네. 행사장 게이트 정보를 알려 주세요." },
        { q: "단거리인데 미니밴?", a: "짐·인원에 따라 권장합니다." },
        { q: "영어?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "인천국제공항과 송도 국제도시를 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Songdo", "Incheon", "South Korea"],
    },
    {
      metaTitle: "Incheon Airport to Songdo | Convention Hub Transfer",
      metaDescription:
        "Private van from Incheon Airport (ICN) to Songdo—short hop to convention centers and waterfront hotels.",
      keywords: ["Incheon to Songdo", "Songdo transfer", "Convention van ICN"],
      linkTitle: "Incheon Airport → Songdo",
      h1: "Incheon Airport to Songdo Private Van Transfer",
      lede:
        "Quick transfer into Songdo’s international district—great for conference badges and hotel clusters.",
      vehicleRecommendBlurb: "Even short hops deserve luggage-friendly vans when bags pile up.",
      travelTraitsLine: "Event days may surge traffic near Convensia—timed pickups help.",
      sections: sec(
        [
          "송도 컨벤시아·호텔 클러스터까지 목적지별 안내.",
          "영문 초청장·행사 일정을 받아 시간을 제안합니다.",
          "외국인 참가자 픽업 동선에 익숙합니다.",
        ],
        [
          "Meeting instructions tuned to ICN arrivals.",
          "Coverage for hotels along Central Park.",
          "Popular with international attendees.",
        ],
      ).en,
      faq: [
        { q: "Convensia access?", a: "Share gate info from organizers." },
        { q: "Short ride van?", a: "Recommended for heavy luggage." },
        { q: "English?", a: "WhatsApp OK." },
      ],
      localBusinessDescription: "Private van transfers between Incheon Airport and Songdo.",
      areaServedNames: ["Incheon International Airport", "Songdo", "South Korea"],
    },
  ),
  buildPage(
    "incheon-vip-airport-service",
    "仁川空港VIPミート・グリート｜外国人優先対応",
    "仁川机场VIP接机｜外语优先服务",
    H3,
    {
      metaTitle: "인천공항 외국인 VIP 픽업 | 미팅·영어 응대 우선 배차",
      metaDescription:
        "인천공항 도착 후 우선 미팅·영어 응대 가능한 VIP 공항 픽업. 호텔·비즈니스 일정에 맞춘 프라이빗 밴.",
      keywords: ["인천공항 VIP", "공항 픽업 영어", "VIP airport pickup Korea", "foreign visitor transfer"],
      linkTitle: "외국인 VIP 공항 픽업",
      h1: "인천공항 외국인 VIP 공항 픽업 서비스",
      lede:
        "도착 동선 안내·영어 커뮤니케이션을 중심으로 비즈니스·관광 고객을 우선 지원합니다. 서울 및 수도권 호텔까지 연결합니다.",
      vehicleRecommendBlurb: "VIP 요청 시 스타리아·쏠라티 등 상위 차종 우선 배정을 검토합니다.",
      travelTraitsLine: "항공편·터미널에 따라 미팅 포인트가 달라지며 사전 공유가 중요합니다.",
      sections: sec(
        [
          "도착 게이트·수하물 정보를 받아 미팅 동선을 안내합니다.",
          "영문 일정표 기반으로 도착 시간을 조정합니다.",
          "호텔 연계·경유 요청을 반영합니다.",
        ],
        [
          "Meet-and-greet oriented service for international arrivals.",
          "English-first coordination via WhatsApp.",
          "Designed for executives and VIP leisure travelers.",
        ],
      ).ko,
      faq: [
        { q: "영어 드라이버?", a: "일정·안내는 영어 채널로 조율합니다." },
        { q: "항공편 변경 시?", a: "즉시 알려 주시면 시간을 재조정합니다." },
        { q: "차종 지정?", a: "가능 여부를 상담 시 안내합니다." },
      ],
      localBusinessDescription: "외국인 방문객을 위한 인천공항 VIP 픽업 프라이빗 밴 서비스.",
      areaServedNames: ["Incheon International Airport", "Seoul", "South Korea"],
    },
    {
      metaTitle: "VIP Airport Pickup Incheon | English-First Meet & Greet",
      metaDescription:
        "VIP-style private van pickup at Incheon Airport—English coordination, meet-and-greet focus, transfers to Seoul hotels.",
      keywords: ["VIP Incheon pickup", "English airport transfer Korea", "meet and greet ICN"],
      linkTitle: "Foreign Visitor VIP Pickup",
      h1: "VIP Airport Pickup Service at Incheon (English Friendly)",
      lede:
        "Tailored for visitors who want proactive communication and smoother arrivals after long international flights.",
      vehicleRecommendBlurb: "Upsized vans available when premium vehicle classes are requested.",
      travelTraitsLine: "Share terminal and baggage details early for seamless meet points.",
      sections: sec(
        [
          "도착 게이트·수하물 정보를 받아 미팅 동선을 안내합니다.",
          "영문 일정표 기반으로 도착 시간을 조정합니다.",
          "호텔 연계·경유 요청을 반영합니다.",
        ],
        [
          "Executive-ready coordination after ICN landing.",
          "Ideal when schedules must stay predictable.",
          "Supports VIP leisure travelers as well.",
        ],
      ).en,
      faq: [
        { q: "English coordination?", a: "Yes—WhatsApp is preferred." },
        { q: "Flight changes?", a: "Notify us ASAP for rescheduling." },
        { q: "Vehicle class?", a: "Discuss availability when booking." },
      ],
      localBusinessDescription: "VIP-focused private transfers from Incheon Airport.",
      areaServedNames: ["Incheon International Airport", "Seoul", "South Korea"],
    },
  ),
  buildPage(
    "seoul-private-van-tour",
    "ソウル貸切市内ツアー｜プライベートバンで一日コース",
    "首尔市内包车游览｜私人包车一日行程",
    H2,
    {
      metaTitle: "서울 프라이빗 밴 시내 투어 | 맞춤 동선·외국어 일정",
      metaDescription:
        "서울 시내 주요 명소를 프라이빗 밴으로 연결하는 맞춤 투어. 외국어 일정 조율·장시간 대기 상담 가능.",
      keywords: ["서울 프라이빗 투어", "서울 밴 투어", "Seoul private van tour", "custom Seoul itinerary"],
      linkTitle: "서울 프라이빗 투어",
      h1: "서울 프라이빗 밴 맞춤 시내 투어",
      lede:
        "인사동·남산·한강 등 원하는 코스를 하루 일정으로 설계합니다. 서울 및 수도권 인근 일부 구간까지 확장 상담 가능합니다.",
      vehicleRecommendBlurb: "일정 길이에 따라 스타리아·쏠라티 등 차종과 대기 시간을 함께 산정합니다.",
      travelTraitsLine: "행사·혼잡 구간은 현장 동선에 따라 순서를 조정합니다.",
      sections: sec(
        [
          "원하는 관광 지점을 시간 순으로 배치합니다.",
          "식사·쇼핑 슬롯을 넣어 동선을 조정합니다.",
          "외국어 일정표를 바탕으로 운행 시간을 안내합니다.",
        ],
        [
          "Custom Seoul itineraries by private van—not a fixed bus tour.",
          "Flexible pacing with shopping or dining stops.",
          "Ideal for visitors who want privacy and comfort.",
        ],
      ).ko,
      faq: [
        { q: "시간당 요금?", a: "코스·대기에 따라 상담 후 안내합니다." },
        { q: "가이드 포함?", a: "차량 중심 안내이며 별도 가이드는 협의입니다." },
        { q: "영어 일정?", a: "WhatsApp으로 가능합니다." },
      ],
      localBusinessDescription: "서울 시내를 프라이빗 밴으로 연결하는 맞춤 투어 서비스.",
      areaServedNames: ["Seoul", "South Korea"],
    },
    {
      metaTitle: "Seoul Private Van City Tour | Custom Itinerary",
      metaDescription:
        "Private van tour across Seoul—custom stops, flexible timing, English itinerary support for international visitors.",
      keywords: ["Seoul private tour", "van tour Seoul", "custom itinerary Korea"],
      linkTitle: "Seoul Private Van Tour",
      h1: "Private Van City Tour in Seoul",
      lede:
        "Design your day across Seoul neighborhoods without sharing a bus—perfect for families and small groups.",
      vehicleRecommendBlurb: "Vehicle size tracks group count and total touring hours.",
      travelTraitsLine: "Traffic around hotspots may reshuffle stop order—your guide on timing is us.",
      sections: sec(
        [
          "원하는 관광 지점을 시간 순으로 배치합니다.",
          "식사·쇼핑 슬롯을 넣어 동선을 조정합니다.",
          "외국어 일정표를 바탕으로 운행 시간을 안내합니다.",
        ],
        [
          "Not a cookie-cutter itinerary—share must-see pins.",
          "Better with kids or seniors vs repetitive trains.",
          "Extend toward DMZ gateway cities when discussed.",
        ],
      ).en,
      faq: [
        { q: "Hourly pricing?", a: "Quoted after itinerary review." },
        { q: "Tour guide?", a: "Van-focused; guides optional separately." },
        { q: "English planning?", a: "Yes via WhatsApp." },
      ],
      localBusinessDescription: "Custom private van touring across Seoul.",
      areaServedNames: ["Seoul", "South Korea"],
    },
  ),
  buildPage(
    "gimpo-airport-to-gangnam",
    "金浦空港から江南へ｜国内線・近距離ピックアップ",
    "金浦机场至江南｜国内线接驳包车",
    H1,
    {
      metaTitle: "김포공항 강남 픽업 | 국내선·근거리 프라이빗 밴",
      metaDescription:
        "김포공항(GMP)에서 강남·테헤란로까지 프라이빗 밴. 국내선 연결·짧은 비행 후 빠른 비즈니스 이동에 적합합니다.",
      keywords: ["김포공항 강남", "GMP 강남", "Gimpo airport Gangnam", "김포 픽업"],
      linkTitle: "김포공항 → 강남",
      h1: "김포공항에서 강남까지 프라이빗 밴",
      lede:
        "국내선·일부 국제선 도착 후 강남 업무 지구까지 단번에 연결합니다. 서울 및 수도권 다른 목적지도 동선에 따라 상담합니다.",
      vehicleRecommendBlurb: "출장 짐·샘플 박스 동반 시 미니밴 이상을 권장합니다.",
      travelTraitsLine: "김포↔강남은 시간대별로 서울 시내 혼잡도 차이가 큽니다.",
      sections: sec(
        [
          "김포 공항 도착 게이트 기준 미팅을 안내합니다.",
          "강남 코어 호텔·오피스까지 목적지별 하차를 확정합니다.",
          "국내 출장 일정에 맞춘 시간 조정이 가능합니다.",
        ],
        [
          "Tailored for quick hops from Gimpo to Gangnam business towers.",
          "Ideal after domestic hops when every minute counts.",
          "English bookings supported.",
        ],
      ).ko,
      faq: [
        { q: "김포 국내선만 해당?", a: "국내선 중심이며 일정은 공항에 맞춰 조정합니다." },
        { q: "강남 호텔까지?", a: "주소 알려 주시면 됩니다." },
        { q: "영어?", a: "WhatsApp 가능합니다." },
      ],
      localBusinessDescription: "김포공항과 강남을 연결하는 프라이빗 밴 서비스.",
      areaServedNames: ["Gimpo International Airport", "Gangnam", "Seoul", "South Korea"],
    },
    {
      metaTitle: "Gimpo Airport to Gangnam | Quick Domestic Transfer",
      metaDescription:
        "Private van from Gimpo Airport (GMP) to Gangnam—ideal after domestic flights when you need fast access to Teheran-ro offices.",
      keywords: ["Gimpo to Gangnam", "GMP transfer", "Seoul domestic airport van"],
      linkTitle: "Gimpo Airport → Gangnam",
      h1: "Gimpo Airport to Gangnam Private Van Transfer",
      lede:
        "Short airport-to-business district ride—perfect for domestic connectors heading straight to meetings.",
      vehicleRecommendBlurb: "Travel light or heavy—we match van size.",
      travelTraitsLine: "City-center delays vary—share flight info for buffers.",
      sections: sec(
        [
          "김포 공항 도착 게이트 기준 미팅을 안내합니다.",
          "강남 코어 호텔·오피스까지 목적지별 하차를 확정합니다.",
          "국내 출장 일정에 맞춘 시간 조정이 가능합니다.",
        ],
        [
          "Fast lane from Gimpo domestic exits.",
          "Coverage for COEX vicinity when requested.",
          "English-friendly bookings.",
        ],
      ).en,
      faq: [
        { q: "Domestic flights only?", a: "Optimized for GMP domestic flows—ask for international arrivals separately." },
        { q: "Hotel drop?", a: "Share exact hotel info." },
        { q: "English?", a: "WhatsApp OK." },
      ],
      localBusinessDescription: "Private van transfers between Gimpo Airport and Gangnam.",
      areaServedNames: ["Gimpo International Airport", "Gangnam", "Seoul"],
    },
  ),
];
