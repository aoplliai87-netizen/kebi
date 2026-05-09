/**
 * SEO 랜딩 페이지 데이터 — slug만 추가하면 `app/[locale]/destinations/[slug]` 가 생성됩니다.
 */

import { refineLandingLocaleCopy } from "@/lib/landing-i18n-refine";

import type { LandingPageSeoPlaceHints } from "./destination-place-seo";
import { getPoiBundle } from "./destination-poi-bundles";
import { DESTINATION_LINK_GRAPH } from "./destination-link-graph";
import { EXTRA_AIRPORT_SEO_LANDINGS } from "./extra-airport-seo-landings";
import { MORE_DESTINATION_LANDINGS } from "./more-destination-landings";
import { TO_AIRPORT_LANDINGS } from "./to-airport-landings";

export type AppLocale = "ko" | "en" | "ja" | "zh";

export type LandingFaqItem = { q: string; a: string };

export type LandingPriceItem = { label: string; price: string; note?: string };

export type LandingPageCopy = {
  /** 메타 title (브랜드 접미사는 generateMetadata에서 붙일 수 있음) */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** 홈 등 내부 링크 앵커 텍스트 */
  linkTitle: string;
  h1: string;
  /** 리드 문단 (plain) */
  lede: string;
  /** 차량·인원 추천 블록 (선택) */
  vehicleRecommendBlurb?: string;
  /** 이동 구간·시간·혼잡 등 특성 (선택) */
  travelTraitsLine?: string;
  /** 서비스 설명 섹션 */
  sections: Array<{ id: string; heading: string; body: string }>;
  pricingIntro: string;
  pricingItems: LandingPriceItem[];
  faq: LandingFaqItem[];
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  whatsappCtaLabel: string;
  kakaoCtaLabel: string;
  homeLinkLabel: string;
  bookingPathLabel: string;
  hero: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** 페이지 전용 LocalBusiness JSON-LD 보조 설명 */
  localBusinessDescription: string;
  /** schema.org areaServed 이름 목록 */
  areaServedNames: string[];
  /** 실제 운영 관점 체크리스트 (미입력 시 enrichment에서 슬러그 유형별 보강) */
  operationalTips?: Array<{ label: string; body: string }>;
  /** 추천 이용 상황·사례형 안내 (샘플 문구 허용) */
  scenarioExamples?: Array<{ title: string; body: string }>;
  scenarioDisclaimer?: string;
  /** 히어로 이미지 신뢰 안내 (실차·브랜드 이미지 우선 등) */
  trustPhotoNote?: string;
  /** 목적지 클러스터 기준 호텔·랜드마크 컨텍스트 (`destination-poi-bundles` 병합) */
  destinationPoi?: {
    nearbyHotels: string[];
    nearbyLandmarks: string[];
    recommendedDropoff: string;
    popularDestinationTags: string[];
  };
};

export type { LandingPageSeoPlaceHints } from "./destination-place-seo";

export type LandingPage = {
  slug: string;
  /** 실검색 alias·키워드 보강 — `data/destination-place-seo.ts` 프로필과 병합 */
  seoPlaceHints?: LandingPageSeoPlaceHints;
  /** 개별 페이지에서 내부링크 오버라이드 시 (미설정이면 destination-link-graph 사용) */
  relatedSlugs?: string[];
  popularSlugs?: string[];
  recommendedSlugs?: string[];
  northGyeonggiSlugs?: string[];
  byLocale: Record<AppLocale, LandingPageCopy>;
};

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "incheon-airport-to-seoul",
    byLocale: {
      ko: {
        metaTitle: "인천공항 서울 픽업·샌딩 | 프라이빗 밴·콜밴 예약",
        metaDescription:
          "인천공항(ICN)에서 서울 시내·호텔까지 프라이빗 밴 픽업·샌딩. 수하물·가족 동반에 맞춘 넉넉한 차량, 24시간 예약. 고속도로 통행료 포함 정찰제 안내.",
        keywords: [
          "인천공항 서울",
          "인천공항 픽업",
          "인천공항 샌딩",
          "서울 공항 셔틀",
          "인천공항 콜밴",
          "프라이빗 밴",
          "공항 미팅",
          "미니밴 택시",
          "VIP 공항 이동",
        ],
        linkTitle: "인천공항 → 서울",
        h1: "인천공항에서 서울까지 프라이빗 밴 픽업·샌딩",
        lede:
          "장거리 비행 후에도 편안하게 이동할 수 있도록 인천국제공항에서 서울 시내·호텔·업무 지구까지 문 도어부터 목적지까지 안내합니다. 캐리어 다수·유아 동반에 맞춰 차량을 배정합니다.",
        sections: [
          {
            id: "service",
            heading: "이용 안내",
            body:
              "도착하신 터미널에 맞춰 만나는 장소를 안내해 드리며, 비행기가 늦어지면 일정을 함께 맞춥니다. 일행과 캐리어 분량에 맞는 차량을 제안합니다.",
          },
          {
            id: "coverage",
            heading: "이동 가능 구역",
            body:
              "서울 전역(강남·종로·마포·영등포·송파 등)과 주요 호텔·업무 지구까지 목적지에 맞춰 이동합니다. 정확한 주소는 예약 시 정해 주시면 됩니다.",
          },
          {
            id: "why",
            heading: "이런 분께 잘 맞습니다",
            body:
              "첫 방문이거나 메신저(WhatsApp·카카오톡)로 일정을 남기고 싶은 분, 견적 조건을 미리 알고 싶은 분께 편합니다. 요금은 정찰제 기준을 상담 시 설명해 드립니다.",
          },
        ],
        pricingIntro:
          "구간·시간대·수하물에 따라 달라집니다. 아래는 상담 시 참고용이며, 확정 금액은 예약 시 안내해 드립니다.",
        pricingItems: [
          { label: "인천공항 → 서울 시내(일반)", price: "상담 후 정찰제", note: "통행료 포함 기준" },
          { label: "심야·새벽 픽업", price: "시간대별 추가 가능", note: "항공 스케줄에 맞춤" },
          { label: "대형 수하물·골프백", price: "차량 타입 조정", note: "사전 고지 시 배차" },
        ],
        faq: [
          {
            q: "인천공항에서 어디서 만나나요?",
            a: "터미널·도착 게이트에 따라 미팅 포인트를 안내드립니다. 예약 시 항공편명과 예상 도착 시간을 알려 주세요.",
          },
          {
            q: "아이와 캐리어가 많은데 가능한가요?",
            a: "가능합니다. 유아 카시트·부스터 필요 여부와 캐리어 개수를 미리 알려 주시면 넉넉한 차량으로 배정합니다.",
          },
          {
            q: "비행기가 연착되면 어떻게 하나요?",
            a: "연착 내용을 메신저나 전화로 알려 주시면 도착 시간에 맞춰 재조정합니다.",
          },
        ],
        primaryCtaLabel: "온라인 예약·문의",
        secondaryCtaLabel: "요금·차량 안내",
        whatsappCtaLabel: "WhatsApp으로 문의",
        kakaoCtaLabel: "카카오톡 문의",
        homeLinkLabel: "홈으로",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/staria-hero.png",
          alt: "인천공항 픽업용 프라이빗 밴 스타리아 차량",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "인천국제공항과 서울 시내를 잇는 프라이빗 밴·콜밴 픽업·샌딩 전문 운행.",
        areaServedNames: [
          "Incheon International Airport",
          "Seoul",
          "South Korea",
        ],
      },
      en: {
        metaTitle: "Incheon Airport to Seoul | Private Van Pickup & Transfer",
        metaDescription:
          "Private van and call-van transfer from Incheon Airport (ICN) to Seoul city, hotels, and business districts. 24/7 booking, spacious luggage space, fixed-rate quotes including tolls.",
        keywords: [
          "Incheon airport to Seoul",
          "ICN airport transfer",
          "Seoul airport pickup",
          "Private Van Service",
          "private van Korea",
          "Incheon airport shuttle",
          "Airport Shuttle",
          "Airport Transfer",
          "Private Airport Pickup",
          "Incheon Airport Transfer",
          "Incheon to Seoul Private Van",
          "VIP Airport Transfer Korea",
          "Korea airport taxi van",
          "meet and greet Incheon",
        ],
        linkTitle: "Incheon Airport → Seoul",
        h1: "Incheon Airport to Seoul Private Van Transfer",
        lede:
          "Door-to-door private van service from Incheon International Airport to your hotel or address in Seoul. Ideal for travelers with heavy luggage, families, and business visitors who want a clear, upfront fare.",
        sections: [
          {
            id: "service",
            heading: "What you get",
            body:
              "Meet-and-greet coordination by terminal, vehicle matched to group size and bags, and scheduling adjusted for flight delays when you notify us.",
          },
          {
            id: "coverage",
            heading: "Areas we serve",
            body:
              "Seoul-wide coverage including Gangnam, Jongno, Mapo, Yeongdeungpo, Songpa, major hotels, and business hubs. Exact routing is confirmed when you book.",
          },
          {
            id: "why",
            heading: "Why tourists choose a private van",
            body:
              "Communicate in English via WhatsApp or KakaoTalk, know your fixed-rate range in advance, and avoid navigating trains with oversized luggage after a long flight.",
          },
        ],
        pricingIntro:
          "Fares depend on exact pickup/drop-off, time of day, and luggage. Below is a reference guide; final pricing is confirmed on booking.",
        pricingItems: [
          { label: "ICN → Seoul city (typical)", price: "Fixed-rate quote", note: "Tolls included basis" },
          { label: "Late-night / early-morning", price: "Time surcharge may apply", note: "Matched to flight time" },
          { label: "Extra bags / golf clubs", price: "Vehicle upgrade if needed", note: "Tell us in advance" },
        ],
        faq: [
          {
            q: "Where is the meeting point at Incheon Airport?",
            a: "We guide you based on your terminal and arrival gate. Share your flight number and ETA when you book.",
          },
          {
            q: "Can you handle multiple suitcases and a child seat?",
            a: "Yes. Let us know the number of bags and if you need a child or booster seat so we can assign the right van.",
          },
          {
            q: "What if my flight is delayed?",
            a: "Message us on WhatsApp or call; we adjust pickup to your new arrival time.",
          },
        ],
        primaryCtaLabel: "Book or inquire online",
        secondaryCtaLabel: "Vehicles & pricing",
        whatsappCtaLabel: "WhatsApp us",
        kakaoCtaLabel: "KakaoTalk chat",
        homeLinkLabel: "Back to home",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/staria-hero.png",
          alt: "Private Van Service vehicle for Incheon Airport Transfer and Private Airport Pickup to Seoul",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "Private van and jumbo taxi-style transfers between Incheon International Airport and Seoul.",
        areaServedNames: [
          "Incheon International Airport",
          "Seoul",
          "South Korea",
        ],
      },
      ja: {
        metaTitle: "仁川空港からソウルへ｜貸切バン・ジャンボタクシー送迎",
        metaDescription:
          "仁川国際空港(ICN)からソウル市内・ホテルまで貸切バンでピックアップ・送迎。24時間予約、大きな荷物やご家族向け。高速道路料金を含む明朗会計のご案内。",
        keywords: [
          "仁川空港 ソウル",
          "仁川空港 送迎",
          "韓国 空港 貸切",
          "ソウル ピックアップ",
          "仁川 ジャンボタクシー",
          "ICN 送迎",
          "ミニバンタクシー",
          "VIP 空港送迎 韓国",
        ],
        linkTitle: "仁川空港 → ソウル",
        h1: "仁川国際空港からソウルまで貸切バン送迎",
        lede:
          "長時間フライトの後もスムーズに移動できるよう、仁川国際空港からソウル市内・ホテル・ビジネスエリアまでドアツードアでご案内します。スーツケース多数・お子様同伴にも対応します。",
        sections: [
          {
            id: "service",
            heading: "サービス内容",
            body:
              "ターミナルに合わせた待ち合わせ案内、荷物と人数に合わせた車両手配、遅延連絡に応じたピックアップ調整が可能です。",
          },
          {
            id: "coverage",
            heading: "対応エリア",
            body:
              "江南・鍾路・麻浦・永登浦・松坡などソウル広域、主要ホテル・オフィスエリアまで対応。詳細は予約時に確定します。",
          },
          {
            id: "why",
            heading: "外国人観光客におすすめの理由",
            body:
              "WhatsApp・カカオトークで英語・日本語のご相談が可能。事前に料金の目安をお伝えし、電車移動の荷物負担を減らせます。",
          },
        ],
        pricingIntro:
          "区間・時間帯・荷物量により異なります。下記は目安で、確定金額は予約時にご案内します。",
        pricingItems: [
          { label: "仁川空港 → ソウル市内(一般的)", price: "ご相談後に均一料金", note: "高速料金込み基準" },
          { label: "深夜・早朝ピックアップ", price: "時間帯により追加の場合あり", note: "フライトに合わせて調整" },
          { label: "大型荷物・ゴルフバッグ", price: "車両タイプを調整", note: "事前連絡推奨" },
        ],
        faq: [
          {
            q: "仁川空港のどこで待ち合わせですか？",
            a: "ターミナル・到着ゲートに応じてご案内します。航空便名と到着予定をお知らせください。",
          },
          {
            q: "スーツケースが多くても大丈夫ですか？",
            a: "可能です。個数とチャイルドシートの要否を事前にお知らせください。",
          },
          {
            q: "フライトが遅延したら？",
            a: "WhatsAppまたはお電話でご連絡いただければ、新しい到着に合わせて調整します。",
          },
        ],
        primaryCtaLabel: "オンライン予約・問い合わせ",
        secondaryCtaLabel: "車両・料金ページ",
        whatsappCtaLabel: "WhatsAppで問い合わせ",
        kakaoCtaLabel: "カカオトークで問い合わせ",
        homeLinkLabel: "ホームへ",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/staria-hero.png",
          alt: "仁川空港からソウルへの送迎用バン",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "仁川国際空港とソウル市内を結ぶ貸切バン・ジャンボタクシー送迎。",
        areaServedNames: [
          "Incheon International Airport",
          "Seoul",
          "South Korea",
        ],
      },
      zh: {
        metaTitle: "仁川机场到首尔包车接送 | 私人面包车预约",
        metaDescription:
          "仁川机场(ICN)至首尔市区、酒店的私人包车接送。24小时预约，大件行李与家庭出行友好，含高速费的一口价报价说明。",
        keywords: [
          "仁川机场 首尔",
          "仁川机场 接机",
          "韩国 机场 包车",
          "首尔 接送",
          "仁川 面包车",
          "ICN 接机",
          "小型面包车出租",
          "韩国 VIP 机场接送",
        ],
        linkTitle: "仁川机场 → 首尔",
        h1: "仁川机场至首尔私人包车接机与送达",
        lede:
          "长途航班后无需换乘折腾，从仁川国际机场直达首尔市区、酒店或商务区。根据行李件数与同行人数安排宽敞车型，适合游客与商务出行。",
        sections: [
          {
            id: "service",
            heading: "服务说明",
            body:
              "按航站楼协调接机点，根据人数行李匹配车型，航班延误时提前告知可调整接机时间。",
          },
          {
            id: "coverage",
            heading: "服务范围",
            body:
              "覆盖首尔主要区域（江南、钟路、麻浦、永登浦、松坡等）及主流酒店与商务区，具体路线以预约确认为准。",
          },
          {
            id: "why",
            heading: "适合外国游客的原因",
            body:
              "可通过 WhatsApp、KakaoTalk 用中文/英文沟通，提前了解参考价，减少携带大件行李换乘地铁的不便。",
          },
        ],
        pricingIntro:
          "费用因路线、时段、行李而异，以下为参考，最终价格在确认预约时说明。",
        pricingItems: [
          { label: "仁川机场 → 首尔市区（常规）", price: "咨询后一口价", note: "含高速费基准" },
          { label: "深夜/清晨接机", price: "可能含时段附加", note: "按航班时间协调" },
          { label: "超大行李/高尔夫球包", price: "可升级车型", note: "建议提前预约说明" },
        ],
        faq: [
          {
            q: "仁川机场在哪里汇合？",
            a: "根据航站楼与到达口指引汇合点，预约时请提供航班号与预计到达时间。",
          },
          {
            q: "行李很多可以吗？",
            a: "可以，请提前告知行李箱数量及是否需要儿童座椅。",
          },
          {
            q: "航班延误怎么办？",
            a: "通过 WhatsApp 或电话告知新到达时间，我们会相应调整接机。",
          },
        ],
        primaryCtaLabel: "在线预约咨询",
        secondaryCtaLabel: "车型与价格",
        whatsappCtaLabel: "WhatsApp 咨询",
        kakaoCtaLabel: "KakaoTalk 咨询",
        homeLinkLabel: "返回首页",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/staria-hero.png",
          alt: "仁川机场到首尔包车",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "仁川国际机场与首尔之间的私人包车接送服务。",
        areaServedNames: [
          "Incheon International Airport",
          "Seoul",
          "South Korea",
        ],
      },
    },
  },
  {
    slug: "incheon-airport-to-gangnam",
    seoPlaceHints: {
      aliases: ["Apgujeong", "Cheongdam-dong"],
      searchKeywords: {
        ja: ["狎鴎亭 送迎", "清潭洞 ホテル"],
        zh: ["狎鸥亭接送", "清潭洞酒店"],
      },
    },
    byLocale: {
      ko: {
        metaTitle: "인천공항 강남 콜밴·프라이빗 밴 | 픽업·샌딩 예약",
        metaDescription:
          "인천공항에서 강남(테헤란로·역삼·삼성·코엑스 일대)까지 프라이빗 밴 픽업·샌딩. 출장·관광 동선에 맞춘 24시간 배차, 정찰제 요금 안내.",
        keywords: [
          "인천공항 강남",
          "인천공항 강남 콜밴",
          "강남 공항 픽업",
          "코엑스 인천공항",
          "테헤란로 픽업",
          "강남역 공항",
          "공항 셔틀",
          "미니밴 택시",
        ],
        linkTitle: "인천공항 → 강남",
        h1: "인천공항에서 강남까지 프라이빗 밴 픽업·샌딩",
        lede:
          "비즈니스 중심지 강남까지 한 번에 이동하세요. 테헤란로·역삼·삼성·코엑스·주요 호텔 등 목적지에 맞춰 최단 동선으로 안내합니다.",
        sections: [
          {
            id: "service",
            heading: "이용 안내",
            body:
              "회의나 박람회 일정에 맞춰 도착 시각을 조정할 수 있습니다. 캐리어가 많거나 골프백이 있으시면 예약 시 알려 주시면 차량을 맞춥니다.",
          },
          {
            id: "coverage",
            heading: "이동 가능 구역",
            body:
              "강남역·삼성역·선릉역 일대, 코엑스·무역센터, 논현·신논현 등 강남 핵심 지역까지 안내합니다.",
          },
          {
            id: "why",
            heading: "이런 분께 잘 맞습니다",
            body:
              "전시·행사 방문 후 호텔로 가시는 분, 가족 단위로 짐이 많으신 분, 늦은 시간 도착 후 편하게 이동하고 싶은 분께 부담 없이 맞춰 드립니다.",
          },
        ],
        pricingIntro: "강남 목적지 세부 주소·시간대에 따라 견적이 달라집니다. 상담 시 정찰제로 안내합니다.",
        pricingItems: [
          { label: "인천공항 → 강남 코어", price: "구간별 정찰제", note: "통행료 포함" },
          { label: "코엑스·무역센터", price: "동선 확정 후 안내", note: "이벤트 일정 연동" },
          { label: "피크 타임", price: "사전 협의", note: "교통 상황 반영" },
        ],
        faq: [
          {
            q: "강남 특정 호텔 앞까지 가능한가요?",
            a: "가능합니다. 호텔명과 주소를 알려 주시면 정문·연회장 동선에 맞춰 드립니다.",
          },
          {
            q: "코엑스 행사 일정에 맞출 수 있나요?",
            a: "행사 입장·종료 시간을 알려 주시면 맞춤 픽업·샌딩 일정을 제안드립니다.",
          },
          {
            q: "영어로 예약할 수 있나요?",
            a: "WhatsApp 등으로 영어 문의 가능합니다.",
          },
        ],
        primaryCtaLabel: "예약·문의하기",
        secondaryCtaLabel: "요금 안내 보기",
        whatsappCtaLabel: "WhatsApp 문의",
        kakaoCtaLabel: "카카오톡 문의",
        homeLinkLabel: "홈으로",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/solati-hero.png",
          alt: "인천공항에서 강남까지 이동하는 대형 밴",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "인천국제공항과 서울 강남 지역을 연결하는 프라이빗 밴 픽업·샌딩.",
        areaServedNames: [
          "Incheon International Airport",
          "Gangnam District",
          "Seoul",
          "South Korea",
        ],
      },
      en: {
        metaTitle: "Incheon Airport to Gangnam | Private Van Transfer Seoul",
        metaDescription:
          "Private van from Incheon Airport (ICN) to Gangnam—Teheran-ro, Yeoksam, Samsung, COEX area. Corporate travelers, events, and families. 24/7 booking with fixed-rate guidance.",
        keywords: [
          "Incheon to Gangnam",
          "ICN to Gangnam van",
          "Private Van Service",
          "Airport Shuttle",
          "Airport Transfer",
          "Private Airport Pickup",
          "Incheon Airport Transfer",
          "Seoul Gangnam airport transfer",
          "COEX airport pickup",
          "Teheran-ro transfer",
          "Korea Chauffeur Service",
          "VIP Airport Transfer Korea",
          "private van Gangnam",
        ],
        linkTitle: "Incheon Airport → Gangnam",
        h1: "Incheon Airport to Gangnam Private Van Transfer",
        lede:
          "Direct private van service from Incheon International Airport to Gangnam’s business core: Teheran-ro, Yeoksam, Samsung, COEX, and major hotels—ideal after long flights or before meetings.",
        sections: [
          {
            id: "service",
            heading: "Service overview",
            body:
              "Schedule around conferences, exhibitions, and hotel check-ins. We coordinate meeting points and adjust for delays when informed.",
          },
          {
            id: "coverage",
            heading: "Gangnam coverage",
            body:
              "Gangnam Station, Samsung Station, Seolleung area offices, COEX, Trade Tower, and nearby commercial addresses.",
          },
          {
            id: "why",
            heading: "Best for",
            body:
              "Trade show visitors, corporate travelers, and groups with heavy luggage who want a single ride into Gangnam without transfers.",
          },
        ],
        pricingIntro:
          "Pricing depends on the exact drop-off address and time. We provide a fixed-rate quote after you share your itinerary.",
        pricingItems: [
          { label: "ICN → Gangnam core", price: "Fixed-rate by route", note: "Tolls included basis" },
          { label: "COEX / convention venues", price: "Confirmed on booking", note: "Event timing aware" },
          { label: "Peak traffic hours", price: "Discussed upfront", note: "Realistic ETA shared" },
        ],
        faq: [
          {
            q: "Can you drop me at a specific hotel entrance?",
            a: "Yes. Share the hotel name and address; we align to the main entrance or event wing as needed.",
          },
          {
            q: "I’m visiting an event at COEX—can you match the schedule?",
            a: "Tell us hall entry or finish time; we propose pickup and return times accordingly.",
          },
          {
            q: "Do you support English booking?",
            a: "Yes, contact us via WhatsApp or the online form.",
          },
        ],
        primaryCtaLabel: "Book or inquire",
        secondaryCtaLabel: "See pricing",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "KakaoTalk",
        homeLinkLabel: "Home",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/solati-hero.png",
          alt: "Minivan Taxi and Airport Shuttle van from Incheon Airport to Gangnam Seoul",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "Private van transfers between Incheon International Airport and Gangnam, Seoul.",
        areaServedNames: [
          "Incheon International Airport",
          "Gangnam District",
          "Seoul",
          "South Korea",
        ],
      },
      ja: {
        metaTitle: "仁川空港から江南へ｜貸切バン送迎・ピックアップ",
        metaDescription:
          "仁川国際空港からソウル江南（テヘラン路・역삼・삼성・COEX周辺）まで貸切バン。出張・展示会・家族旅行向け。24時間予約。",
        keywords: [
          "仁川空港 江南",
          "ICN 江南 送迎",
          "COEX 空港",
          "テヘラン路 ピックアップ",
          "ソウル 江南 貸切",
          "空港シャトル",
          "韓国 チャーター送迎",
        ],
        linkTitle: "仁川空港 → 江南",
        h1: "仁川空港から江南まで貸切バン送迎",
        lede:
          "ビジネスエリア江南へ直行。テヘラン路・역삼・삼성・COEX・主要ホテルまで、長距離フライト後や会議前の移動に最適です。",
        sections: [
          {
            id: "service",
            heading: "サービス概要",
            body:
              "展示会・会議・ホテルチェックインに合わせてスケジュール調整。遅延連絡にも対応します。",
          },
          {
            id: "coverage",
            heading: "対応エリア",
            body:
              "江南駅・サムスン駅・ソルレンク周辺のオフィス、COEX、トレードタワーなど江南中心エリア。",
          },
          {
            id: "why",
            heading: "こんな方におすすめ",
            body:
              "展示会来場者、出張者、大きな荷物を持つご家族など、乗り換えなしで江南へ向かいたい方。",
          },
        ],
        pricingIntro: "降車地点・時間帯により料金が変わります。行程を伺ったうえで均一料金をご案内します。",
        pricingItems: [
          { label: "仁川空港 → 江南中心部", price: "区間別均一料金", note: "高速料金込み基準" },
          { label: "COEX・コンベンション", price: "予約時確定", note: "イベント時間連動" },
          { label: "ラッシュ時", price: "事前すり合わせ", note: "所要時間目安を共有" },
        ],
        faq: [
          {
            q: "ホテル玄関まで行けますか？",
            a: "可能です。ホテル名と住所をお知らせください。",
          },
          {
            q: "COEXのイベント時間に合わせられますか？",
            a: "入場・終了時間をお知らせいただければ提案します。",
          },
          {
            q: "英語で予約できますか？",
            a: "WhatsAppなどで英語対応可能です。",
          },
        ],
        primaryCtaLabel: "予約・問い合わせ",
        secondaryCtaLabel: "料金を見る",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "カカオトーク",
        homeLinkLabel: "ホーム",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/solati-hero.png",
          alt: "仁川空港から江南への貸切バン",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "仁川国際空港とソウル江南を結ぶ貸切バン送迎。",
        areaServedNames: [
          "Incheon International Airport",
          "Gangnam District",
          "Seoul",
          "South Korea",
        ],
      },
      zh: {
        metaTitle: "仁川机场到江南包车 | 私人接送 COEX·德黑兰路",
        metaDescription:
          "仁川机场至首尔江南（德黑兰路、驿三、三成、COEX）私人包车。商务、展会、家庭出行，24小时可预约。",
        keywords: [
          "仁川机场 江南",
          "江南 接机",
          "COEX 接机",
          "首尔 商务包车",
          "德黑兰路 接送",
          "机场穿梭巴士",
          "韩国 司机包车服务",
        ],
        linkTitle: "仁川机场 → 江南",
        h1: "仁川机场至江南私人包车接送",
        lede:
          "从仁川国际机场直达江南商务区：德黑兰路、驿三、三成、COEX 及主要酒店，适合展会访客与出差人士，减少换乘与搬运行李的负担。",
        sections: [
          {
            id: "service",
            heading: "服务概述",
            body:
              "可根据会议、展会、酒店入住时间排程，航班延误提前告知可协调接机。",
          },
          {
            id: "coverage",
            heading: "覆盖范围",
            body:
              "江南站、三成站、驿三一带写字楼、COEX、贸易中心及周边商业地址。",
          },
          {
            id: "why",
            heading: "适合人群",
            body:
              "展会观众、商务旅客、行李较多的家庭，希望一车直达江南的旅客。",
          },
        ],
        pricingIntro: "具体下车地址与时段会影响价格，提供行程后给予一口价说明。",
        pricingItems: [
          { label: "仁川机场 → 江南核心", price: "按路线一口价", note: "含高速费基准" },
          { label: "COEX / 会展场馆", price: "预约时确认", note: "可结合活动时段" },
          { label: "高峰时段", price: "事先沟通", note: "告知预估用时" },
        ],
        faq: [
          {
            q: "可以送到酒店门口吗？",
            a: "可以，请提供酒店名称与地址。",
          },
          {
            q: "COEX 活动行程能配合吗？",
            a: "请提供入场或结束时间，我们可建议接送时刻。",
          },
          {
            q: "能用英文预约吗？",
            a: "可以通过 WhatsApp 英文联系。",
          },
        ],
        primaryCtaLabel: "预约咨询",
        secondaryCtaLabel: "查看价格",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "KakaoTalk",
        homeLinkLabel: "首页",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/solati-hero.png",
          alt: "仁川机场到江南包车",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "仁川国际机场与首尔江南地区的私人包车接送。",
        areaServedNames: [
          "Incheon International Airport",
          "Gangnam District",
          "Seoul",
          "South Korea",
        ],
      },
    },
  },
  {
    slug: "korea-golf-tour",
    byLocale: {
      ko: {
        metaTitle: "한국 골프 투어 차량 | 필드 이동·공항 연계 프라이빗 밴",
        metaDescription:
          "한국 골프 여행을 위한 프라이빗 밴·콜밴. 골프백·동반자 수에 맞춘 배차, 인천공항 연계, 코스 간 이동까지 맞춤 동선. 다국어 문의 가능.",
        keywords: [
          "한국 골프 투어",
          "골프백 콜밴",
          "인천공항 골프",
          "서울 골프 이동",
          "골프장 셔틀",
          "한국 골프 여행 차량",
          "기사 포함 밴 서비스",
          "VIP 공항 이동",
        ],
        linkTitle: "한국 골프 투어",
        h1: "한국 골프 투어 전용 프라이빗 밴·장거리 이동",
        lede:
          "골프백과 캐리어를 안전하게 실을 수 있는 대형 밴으로 필드 간 이동과 공항 픽업·샌딩을 한 번에 계획하세요. 일정·코스에 맞춘 맞춤 견적을 드립니다.",
        sections: [
          {
            id: "service",
            heading: "골프 투어 맞춤 서비스",
            body:
              "골프백 수량·캐디백 포함 여부를 사전에 알려 주시면 적합한 차량을 배정합니다. 복수 라운드·이동 거리가 긴 일정도 상담 가능합니다.",
          },
          {
            id: "coverage",
            heading: "이동 범위",
            body:
              "수도권·지방 골프장으로의 이동, 호텔·공항·코스 간 연결 등 동선 전체를 설계해 드립니다. 미확정 코스는 상담 단계에서 조율합니다.",
          },
          {
            id: "why",
            heading: "해외 골프객에게 유리한 점",
            body:
              "언어 지원 채널(WhatsApp·카카오톡)로 일정을 정리할 수 있고, 장비 보관 공간을 확보한 차량으로 이동 피로를 줄입니다.",
          },
        ],
        pricingIntro:
          "이동 거리·일수·야간 운행 여부에 따라 견적이 달라집니다. 코스명·숙소·항공 일정을 알려 주시면 정찰제로 안내합니다.",
        pricingItems: [
          { label: "공항 ↔ 골프장·호텔", price: "구간별 견적", note: "골프백 사전 고지" },
          { label: "멀티 라운드·장거리", price: "일정 패키지 협의", note: "대기 시간 포함 가능" },
          { label: "단체·4인 이상", price: "차량 타입 조정", note: "넉넉한 적재 공간" },
        ],
        faq: [
          {
            q: "골프백이 두 개 이상인데 가능한가요?",
            a: "가능합니다. 백 개수와 하드케이스 여부를 알려 주시면 차량을 맞춥니다.",
          },
          {
            q: "코스만 정하고 숙소는 나중에 정해도 되나요?",
            a: "1차 상담에서 대략 동선만 잡아도 됩니다. 확정 시점에 업데이트해 주세요.",
          },
          {
            q: "영어로 일정 조율이 되나요?",
            a: "WhatsApp 등으로 영어 문의를 받습니다.",
          },
        ],
        primaryCtaLabel: "골프 일정 문의",
        secondaryCtaLabel: "차량 안내",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "카카오톡",
        homeLinkLabel: "홈으로",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/county-hero.png",
          alt: "골프 투어용 대형 밴과 골프백 수송",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "한국 골프 여행을 위한 프라이빗 밴·장거리 이동 및 공항 연계 서비스.",
        areaServedNames: ["South Korea", "Seoul Metropolitan Area", "Incheon International Airport"],
      },
      en: {
        metaTitle: "Korea Golf Tour Van | Airport Transfers & Course Runs",
        metaDescription:
          "Private van for Korea golf trips—golf bag friendly, airport meetups, hotel-to-course runs, and multi-day itineraries. English inquiries via WhatsApp.",
        keywords: [
          "Korea Golf Tour",
          "Korea golf tour transport",
          "golf bag van Korea",
          "Incheon airport golf transfer",
          "Private Van Service",
          "Airport Transfer",
          "Seoul golf shuttle",
          "private van golf Korea",
          "Korea Chauffeur Service",
          "VIP Airport Transfer Korea",
          "Korea golf travel car",
        ],
        linkTitle: "Korea golf tour",
        h1: "Korea Golf Tour Private Van & Long-Distance Transfers",
        lede:
          "Plan airport pickups, hotel stays, and course-to-course moves with vans built for golf travel. Share bag count, group size, and dates for a clear fixed-rate style quote.",
        sections: [
          {
            id: "service",
            heading: "Golf-focused service",
            body:
              "We assign vehicles with cargo room for multiple golf bags and luggage. Multi-round and longer highway legs are welcome—share your draft itinerary.",
          },
          {
            id: "coverage",
            heading: "Where we can take you",
            body:
              "Connections between Incheon Airport, Seoul-area hotels, and courses in the capital region or beyond, depending on your schedule.",
          },
          {
            id: "why",
            heading: "Why visitors book a private van",
            body:
              "Avoid squeezing clubs into standard taxis, keep the group together, and coordinate timing in English over WhatsApp or KakaoTalk.",
          },
        ],
        pricingIntro:
          "Pricing reflects distance, number of days, and night moves. Send course names, lodging, and flights for a tailored quote.",
        pricingItems: [
          { label: "Airport ↔ hotel / course", price: "Route-based quote", note: "Declare golf bags upfront" },
          { label: "Multi-day tour", price: "Package style", note: "Waiting time optional" },
          { label: "Groups of 4+", price: "Larger van if needed", note: "Extra storage" },
        ],
        faq: [
          {
            q: "Can you fit more than two golf bags?",
            a: "Yes—tell us how many bags and if any are hard cases so we pick the right van.",
          },
          {
            q: "I haven’t finalized hotels yet—is that OK?",
            a: "You can start with a rough plan and update addresses once confirmed.",
          },
          {
            q: "Can I arrange everything in English?",
            a: "Yes, reach out on WhatsApp with your itinerary questions.",
          },
        ],
        primaryCtaLabel: "Plan my golf trip",
        secondaryCtaLabel: "Fleet details",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "KakaoTalk",
        homeLinkLabel: "Home",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/county-hero.png",
          alt: "Korea Golf Tour private van with chauffeur service and luggage space for golf bags",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "Private van transport for golf travelers in Korea, including airport and inter-course transfers.",
        areaServedNames: ["South Korea", "Seoul Metropolitan Area", "Incheon International Airport"],
      },
      ja: {
        metaTitle: "韓国ゴルフツアー送迎｜空港・コース間 貸切バン",
        metaDescription:
          "韓国ゴルフ旅行向け貸切バン。ゴルフバッグ対応、仁川空港送迎、ホテルとコース間の移動、複数日行程。WhatsAppで英語・日本語のご相談可。",
        keywords: [
          "韓国 ゴルフ 送迎",
          "仁川空港 ゴルフ",
          "ソウル ゴルフ バン",
          "韓国 ゴルフツアー 車",
          "貸切 ゴルフバッグ",
          "チャーター送迎",
          "VIP 空港送迎 韓国",
        ],
        linkTitle: "韓国ゴルフツアー",
        h1: "韓国ゴルフツアー向け貸切バン・長距離移動",
        lede:
          "ゴルフバッグとスーツケースをまとめて積める大型バンで、空港送迎からホテル・コース間の移動まで計画できます。日程とバッグ本数をお知らせください。",
        sections: [
          {
            id: "service",
            heading: "ゴルフ特化サービス",
            body:
              "バッグの本数・ハードケースの有無を伺い、荷室の広い車両を手配します。複数ラウンドや長距離もご相談ください。",
          },
          {
            id: "coverage",
            heading: "移動範囲",
            body:
              "仁川空港、ソウル圏ホテル、首都圏およびその先のコースまで、スケジュールに応じてご案内します。",
          },
          {
            id: "why",
            heading: "選ばれる理由",
            body:
              "一般タクシーでは狭いゴルフバッグもまとめて運べ、グループ全員が同じ車で移動できます。WhatsApp・カカオで調整可能です。",
          },
        ],
        pricingIntro: "距離・日数・深夜早朝の有無で変動します。コース名・宿泊・航空便をお知らせください。",
        pricingItems: [
          { label: "空港 ↔ ホテル・コース", price: "区間ごとにご提案", note: "バッグ本数を事前に" },
          { label: "複数日パッケージ", price: "お打ち合わせ", note: "待機時間の設定可" },
          { label: "4名以上の団体", price: "大型車に変更可", note: "荷物スペース確保" },
        ],
        faq: [
          {
            q: "ゴルフバッグが2個以上でも大丈夫？",
            a: "大丈夫です。本数とケース種類を教えてください。",
          },
          {
            q: "ホテルが未確定でも相談できますか？",
            a: "大まかな行程から始められます。確定後に更新してください。",
          },
          {
            q: "英語で連絡できますか？",
            a: "WhatsAppで英語のお問い合わせが可能です。",
          },
        ],
        primaryCtaLabel: "ゴルフ行程を相談",
        secondaryCtaLabel: "車両紹介",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "カカオトーク",
        homeLinkLabel: "ホーム",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/county-hero.png",
          alt: "韓国ゴルフツアー向け貸切バン",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "韓国でのゴルフ旅行向け貸切バン、空港送迎およびコース間移動。",
        areaServedNames: ["South Korea", "Seoul Metropolitan Area", "Incheon International Airport"],
      },
      zh: {
        metaTitle: "韩国高尔夫旅游包车 | 机场接送·球场间移动",
        metaDescription:
          "韩国高尔夫行程专用包车，球包友好、仁川机场接送、酒店与球场间接驳，多日行程可定制。支持 WhatsApp 咨询。",
        keywords: [
          "韩国 高尔夫 包车",
          "仁川机场 高尔夫",
          "首尔 球场 接送",
          "韩国 高尔夫旅游 车",
          "球包 面包车",
          "韩国 高尔夫 旅游",
          "韩国 司机包车服务",
          "韩国 VIP 机场接送",
        ],
        linkTitle: "韩国高尔夫旅游",
        h1: "韩国高尔夫旅游包车与长途接驳",
        lede:
          "用空间充足的私人面包车安排机场接机、酒店入住与球场之间的移动。请提供球包数量、人数与日期，以便给出清晰报价。",
        sections: [
          {
            id: "service",
            heading: "高尔夫导向服务",
            body:
              "根据球包数量、是否硬壳箱匹配合适车型，支持多轮打球与较长高速路段，可先提供草案行程。",
          },
          {
            id: "coverage",
            heading: "服务范围",
            body:
              "仁川机场、首尔圈酒店与首都圈及更远球场的衔接，以您的日程为准。",
          },
          {
            id: "why",
            heading: "为何选择包车",
            body:
              "避免球杆挤不进普通出租车，团队同车移动，可用 WhatsApp、Kakao 沟通行程。",
          },
        ],
        pricingIntro: "费用随距离、天数、是否夜间行车变化，请提供球场、住宿与航班信息。",
        pricingItems: [
          { label: "机场 ↔ 酒店/球场", price: "按路线报价", note: "请提前说明球包" },
          { label: "多日行程", price: "套餐协商", note: "可含等候时间" },
          { label: "4 人以上", price: "可升级大车", note: "更大行李空间" },
        ],
        faq: [
          {
            q: "两个以上球包可以吗？",
            a: "可以，请告知数量与是否有硬壳箱。",
          },
          {
            q: "酒店还没定也能咨询吗？",
            a: "可以先给大致行程，确定后再更新地址。",
          },
          {
            q: "能用英文沟通吗？",
            a: "可以通过 WhatsApp 英文联系。",
          },
        ],
        primaryCtaLabel: "咨询高尔夫行程",
        secondaryCtaLabel: "车辆介绍",
        whatsappCtaLabel: "WhatsApp",
        kakaoCtaLabel: "KakaoTalk",
        homeLinkLabel: "首页",
        bookingPathLabel: "/booking",
        hero: {
          src: "/images/vehicles/county-hero.png",
          alt: "韩国高尔夫旅游包车",
          width: 1200,
          height: 750,
        },
        localBusinessDescription:
          "面向韩国高尔夫旅客的私人包车，含机场与球场间接驳。",
        areaServedNames: ["South Korea", "Seoul Metropolitan Area", "Incheon International Airport"],
      },
    },
  },
  ...MORE_DESTINATION_LANDINGS,
  ...TO_AIRPORT_LANDINGS,
  ...EXTRA_AIRPORT_SEO_LANDINGS,
];

/** 목적지 랜딩 내부링크 슬러그 (그래프 + 페이지 오버라이드 병합) */
export function getDestinationLinkSlugsForPage(page: LandingPage): {
  relatedSlugs: string[];
  popularSlugs: string[];
  recommendedSlugs: string[];
  northGyeonggiSlugs: string[];
} {
  const g = DESTINATION_LINK_GRAPH[page.slug];
  const related = [...(page.relatedSlugs ?? []), ...(g?.relatedSlugs ?? [])];
  const popular = [...(page.popularSlugs ?? []), ...(g?.popularSlugs ?? [])];
  const poiExtras = getPoiBundle(page.slug)?.relatedSlugs ?? [];
  const recommended = [
    ...(page.recommendedSlugs ?? []),
    ...(g?.recommendedSlugs ?? []),
    ...poiExtras,
  ];
  const northGyeonggi = [...(page.northGyeonggiSlugs ?? []), ...(g?.northGyeonggiSlugs ?? [])];
  const uniq = (xs: string[]) => Array.from(new Set(xs.map((s) => s.trim()).filter(Boolean)));
  return {
    relatedSlugs: uniq(related),
    popularSlugs: uniq(popular),
    recommendedSlugs: uniq(recommended),
    northGyeonggiSlugs: uniq(northGyeonggi),
  };
}

/** 내비게이션용 내부링크 — 존재하는 슬러그만, 현재 페이지 제외, 아래 단계별 중복 제거 */
export function buildDestinationNavLinksForPage(
  page: LandingPage,
  locale: string,
): {
  relatedLinks: Array<{ href: string; label: string }>;
  popularLinks: Array<{ href: string; label: string }>;
  recommendedLinks: Array<{ href: string; label: string }>;
  northGyeonggiLinks: Array<{ href: string; label: string }>;
} {
  const currentSlug = page.slug;
  const { relatedSlugs, popularSlugs, recommendedSlugs, northGyeonggiSlugs } =
    getDestinationLinkSlugsForPage(page);

  const toLinks = (slugs: string[]): Array<{ href: string; label: string }> => {
    const out: Array<{ href: string; label: string }> = [];
    const seen = new Set<string>();
    for (const s of slugs) {
      if (s === currentSlug) continue;
      if (seen.has(s)) continue;
      const entry = getLandingPageBySlug(s);
      if (!entry) continue;
      seen.add(s);
      out.push({
        href: `/destinations/${s}`,
        label: getCopyForLocale(entry, locale).linkTitle,
      });
    }
    return out;
  };

  const used = new Set<string>();

  const relatedLinks = toLinks(relatedSlugs);
  relatedLinks.forEach((l) => used.add(l.href.replace(/^\/destinations\//, "")));

  const popularLinks = toLinks(popularSlugs.filter((s) => !used.has(s)));
  popularLinks.forEach((l) => used.add(l.href.replace(/^\/destinations\//, "")));

  const recommendedLinks = toLinks(recommendedSlugs.filter((s) => !used.has(s)));
  recommendedLinks.forEach((l) => used.add(l.href.replace(/^\/destinations\//, "")));

  const northGyeonggiLinks = toLinks(northGyeonggiSlugs.filter((s) => !used.has(s)));

  return { relatedLinks, popularLinks, recommendedLinks, northGyeonggiLinks };
}

export function getLandingPageBySlug(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}

/** 홈 대표 3개 버튼의 기본 라벨·링크 (관리자 저장값 없을 때) */
export function getFeaturedDestinationButtonDefaults(
  locale: string,
  featuredSlugs: readonly [string, string, string],
): { label: string; href: string }[] {
  return featuredSlugs.map((slug) => {
    const page = getLandingPageBySlug(slug);
    const copy = page ? getCopyForLocale(page, locale) : null;
    return {
      label: copy?.linkTitle ?? slug,
      href: `/destinations/${slug}`,
    };
  });
}

export function getAllDestinationSlugs(): string[] {
  return LANDING_PAGES.map((p) => p.slug);
}

export function getCopyForLocale(
  page: LandingPage,
  locale: string,
): LandingPageCopy {
  const loc = locale as AppLocale;
  const base =
    loc in page.byLocale ? page.byLocale[loc] : page.byLocale.en;
  if (loc === "ja" || loc === "zh") {
    return refineLandingLocaleCopy(base, page.slug, loc, page.seoPlaceHints);
  }
  return base;
}
