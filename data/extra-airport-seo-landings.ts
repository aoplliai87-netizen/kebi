/**
 * 강북·노원권·경기북부(남양주·구리·양주·동두천·별내) → 인천공항
 * + 목적형(새벽/가족픽업/짐/외국인/단체) — 본문·FAQ·메타는 슬러그별로 별도 구성
 */
import { H1, H2, H3, buildPage, sec } from "./airport-landing-builders";
import type { LandingPage } from "./landing-pages";

export const EXTRA_AIRPORT_SEO_LANDINGS: LandingPage[] = [
  buildPage(
    "nowon-to-incheon-airport",
    "芦原から仁川空港へ｜北部出国送迎",
    "芦原至仁川机场｜北部送机包车",
    H1,
    {
      metaTitle: "노원 인천공항 샌딩 | 상계·중계·공릉 출발 강북권 출국 밴",
      metaDescription:
        "노원구 상계·중계·공릉·월계에서 인천공항(ICN)까지 프라이빗 밴 샌딩. 새벽 출국·의정부 방향 연계 동선, 카시트·대형 캐리어 상담.",
      keywords: ["노원 인천공항", "상계 공항 샌딩", "중계 인천공항", "공릉 출국 밴", "노원 콜밴 인천"],
      linkTitle: "노원 → 인천공항",
      h1: "노원·상계·중계에서 인천공항까지 강북권 출국 샌딩",
      lede:
        "노원 전철권·아파트 단지에서 직접 인천공항 출국장까지 연결합니다. 북부 지역은 공항고속도로까지 접속 거리가 있어 체크인 마감에 맞춰 보수적으로 출발 시간을 잡습니다.",
      vehicleRecommendBlurb:
        "가족 단위나 유모차 동반 시 카니발·스타리아급 미니밴으로 좌석과 트렁크를 확보합니다.",
      travelTraitsLine:
        "의정부·동두천 방향과 합류하기 전 구간에서 새벽 시간대 교통 패턴이 달라질 수 있습니다.",
      sections: sec(
        [
          "상계·중계·공릉 동·단지명까지 받아 픽업 게이트와 차량 진입 동선을 안내합니다.",
          "경춘·중부내륙 방향에서 공항고속도로로 붙는 루트를 비교해 안내합니다.",
          "강북·노원 거주자가 김포 대신 인천 출국편을 이용할 때 장거리 버퍼를 함께 산출합니다.",
        ],
        [
          "Pin-level pickups around Nowon station exits and complex lobbies when rules allow.",
          "Highway entry strategy from northern Seoul toward ICN check-in cutoffs.",
          "For travelers who choose ICN over GMP despite the longer run from Nowon.",
        ],
      ).ko,
      faq: [
        {
          q: "노원에서 인천공항까지 대략 얼마나 잡으면 되나요?",
          a: "요일·시간·편명에 따라 다릅니다. 체크인 방식(모바일/카운터)을 알려 주시면 역산해 드립니다.",
        },
        { q: "새벽 첫 비행에 맞출 수 있나요?", a: "가능합니다. 집·주차장에서 만나는 시각을 미리 조율합니다." },
        { q: "의정부 경유가 더 빠를 때도 있나요?", a: "일부 동선에서 비교해 볼 수 있습니다. 주소를 알려 주시면 제안드립니다." },
      ],
      primaryCtaLabel: "노원 출발 인천 샌딩 상담",
      localBusinessDescription: "노원·강북 북서권에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Nowon", "Sanggye", "Junggye", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Nowon to Incheon Airport | Northern Seoul Van Drop-off",
      metaDescription:
        "Private van from Nowon, Sanggye, and Junggye to ICN—dawn flight buffers and family luggage planning for northern Seoul departures.",
      keywords: ["Nowon to ICN", "Sanggye airport van", "northern Seoul airport transfer"],
      linkTitle: "Nowon → Incheon Airport",
      h1: "Nowon to Incheon Airport Private Van",
      lede:
        "Direct ICN drop-offs for residents around Nowon—realistic timing for the long run west to the airport.",
      vehicleRecommendBlurb: "Minivans when strollers or multiple large bags are in play.",
      travelTraitsLine: "Northbound merge traffic before expressway access can shift ETAs at night.",
      sections: sec(
        [
          "Complex-level pickup notes for Nowon high-rises.",
          "ICN routing with honest buffers for long urban legs.",
          "Useful when GMP doesn’t match your international ticket.",
        ],
        [
          "Share child seat needs in advance.",
          "Dawn departures coordinated with your household schedule.",
          "WhatsApp and Kakao supported for route questions.",
        ],
      ).en,
      faq: [
        { q: "How long from Nowon to ICN?", a: "We quote a window based on your flight and day of week." },
        { q: "5am flight?", a: "Yes—pickup times set the night before." },
        { q: "GMP might be closer?", a: "Tell us your ticket—we’ll compare if useful." },
      ],
      primaryCtaLabel: "Book Nowon → ICN",
      localBusinessDescription: "Outbound private van from Nowon district toward Incheon International Airport.",
    },
  ),
  buildPage(
    "gangbuk-to-incheon-airport",
    "江北から仁川空港へ｜城北区送迎",
    "江北至仁川机场｜城北区送机",
    H2,
    {
      metaTitle: "강북 인천공항 샌딩 | 수유·미아·삼각지 방향 강북구 출국 콜밴",
      metaDescription:
        "강북구 수유·미아·삼각지 일대에서 인천공항까지 프라이빗 밴. 강북·노원·의정부 이동 수요와 맞닿는 북서권 출국 동선.",
      keywords: ["강북 인천공항", "수유 공항 샌딩", "미아 인천공항", "강북구 출국 밴", "삼각지 인천"],
      linkTitle: "강북 → 인천공항",
      h1: "강북·수유·미아에서 인천공항까지 북서권 출국 이동",
      lede:
        "강북 핵심 주거·상권에서 인천공항 국제선 출국까지 직행합니다. 짐이 많은 가족·새벽 비행은 지하철 대신 집 앞 픽업을 권장하는 편이 안전합니다.",
      vehicleRecommendBlurb: "3열 시트·높은 개방감이 있는 미니밴으로 어린이·어른 동승 시 착좌를 여유 있게 잡습니다.",
      travelTraitsLine: "퇴근·퇴원 시간대 스쿨존·지선도로가 느려질 수 있어 공항 도착 여유를 넉넉히 둡니다.",
      sections: sec(
        [
          "수유·미아·인수 쪽 상세 주소를 받아 승하차 위치를 정합니다. 어린이·어르신 동승 시 승차 시간을 넉넉히 잡습니다.",
          "강북·성북·도봉 구간을 지나 북서 수도권 고속망으로 연결하는 동선을 설명합니다.",
          "강남·잠실만큼 셔틀 밀도가 높지 않은 북서권에서도 인천 국제선을 쓰는 가정에 맞춥니다.",
        ],
        [
          "Household pickups when stairs and transfers are a burden.",
          "Highway-first planning from Gangbuk toward ICN T1/T2.",
          "Great for early-morning long-haul departures with kids and elder riders.",
        ],
      ).ko,
      faq: [
        { q: "수유역 인근 아파트 단지 픽업되나요?", a: "주소·정문·지하주차 기준을 알려 주시면 안내합니다." },
        { q: "어린이 카시트는?", a: "사전에 연령·체형을 알려 주시면 가능 여부를 말씀드립니다." },
        { q: "의정부에서 합류하는 가족도 태울 수 있나요?", a: "경로가 맞으면 사전에 정차·요금을 협의합니다." },
      ],
      primaryCtaLabel: "강북 출발 인천 샌딩 문의",
      localBusinessDescription: "강북구·수유권에서 인천공항 국제선 출국까지 이어주는 프라이빗 밴.",
      areaServedNames: ["Gangbuk", "Suyu", "Mia", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Gangbuk to Incheon Airport | Suyu & Mia Van Service",
      metaDescription:
        "Private van from Gangbuk—Suyu, Mia, and Samgakji area—to ICN for international departures, with child-seat and luggage planning.",
      keywords: ["Gangbuk to ICN", "Suyu airport van", "Mia Incheon transfer"],
      linkTitle: "Gangbuk → Incheon Airport",
      h1: "Gangbuk to Incheon International Airport",
      lede:
        "Northwest Seoul residents heading to ICN for long-haul flights—door-to-door with realistic timing across the metro westward.",
      vehicleRecommendBlurb: "Spacious minivans for multi-generation families.",
      travelTraitsLine: "School zones and local arterials can slow late-afternoon runs—buffers included.",
      sections: sec(
        [
          "Apartment-tower and lobby rules respected for Gangbuk pickups.",
          "ICN routing with emphasis on check-in stress reduction.",
          "Helpful when subway stairs aren’t viable with heavy bags.",
        ],
        [
          "Car-seat requests handled when booked ahead.",
          "Optional brief meet points along the northern arc.",
          "English messaging via WhatsApp for itinerary tweaks.",
        ],
      ).en,
      faq: [
        { q: "Hotel near Suyu?", a: "Share tower name and lobby policy." },
        { q: "Car seats?", a: "Age/weight details help us match vehicles." },
        { q: "Extra stop in Uijeongbu?", a: "Possible when routing aligns—ask when booking." },
      ],
      primaryCtaLabel: "Book Gangbuk → ICN",
      localBusinessDescription: "Private airport drops from Gangbuk district toward Incheon International Airport.",
    },
  ),
  buildPage(
    "suyu-to-incheon-airport",
    "水逾から仁川空港へ｜北部出国送迎",
    "水逾至仁川机场｜北部送机",
    H1,
    {
      metaTitle: "수유 인천공항 샌딩 | 강북 중심 출발 도봉산·미아 연계 출국",
      metaDescription:
        "수유역·강북구 일대에서 인천공항까지 프라이빗 밴. 도봉산·4호선 연계 거주자 출국, 새벽 편·대형 캐리어 동반 상담.",
      keywords: ["수유 인천공항", "수유역 공항 샌딩", "강북 수유 출국", "도봉산 인천공항", "수유 콜밴"],
      linkTitle: "수유 → 인천공항",
      h1: "수유·강북 중심에서 인천공항까지 출국 샌딩",
      lede:
        "수유역 권역 아파트·오피스텔에서 출발해 인천공항까지 한 번에 연결합니다. 역 주변 도보 거리가 긴 경우 차량 접근 가능 지점을 미리 정합니다.",
      vehicleRecommendBlurb: "역 인근 혼잡 시간대에는 픽업 장소를 역 전면이 아닌 인근 로터리로 조정할 수 있습니다.",
      travelTraitsLine: "수유에서 서쪽으로 빠질 때 도봉·강북 구간 지선 체증이 출발 시각에 영향을 줄 수 있습니다.",
      sections: sec(
        [
          "수유·미아 삼거리·인수 방향 등 세부 출발지를 받아 만남 위치를 확정합니다.",
          "북서쪽 고속 접속 후 공항 하차층 동선을 안내합니다.",
          "도봉산 일대와 연계 생활권에서 인천 국제선을 이용하는 출국객에게 적합합니다.",
        ],
        [
          "Station-adjacent pickups when curb rules permit.",
          "ICN drop-off aligned with airline terminals.",
          "Useful for travelers avoiding Line 4 stairs with heavy suitcases.",
        ],
      ).ko,
      faq: [
        { q: "수유역 몇 번 출구에서 만나나요?", a: "날짜·건물에 따라 다릅니다. 예약 시 도보 동선을 알려 주세요." },
        { q: "골프백과 캐리어를 같이 실을 수 있나요?", a: "개수를 알려 주시면 트렁크 높이가 맞는 차종을 제안합니다." },
        { q: "새벽 4시 픽업 가능?", a: "스케줄만 확정되면 조율합니다." },
      ],
      primaryCtaLabel: "수유 출발 인천 예약",
      localBusinessDescription: "수유·강북 중심에서 인천공항 출국 동선을 이어주는 프라이빗 밴.",
      areaServedNames: ["Suyu", "Gangbuk", "Dobongsan", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Suyu to Incheon Airport | Line 4 Corridor Van",
      metaDescription:
        "Private van pickups near Suyu Station toward ICN—early flights, golf bags, and oversized luggage quotes.",
      keywords: ["Suyu to ICN", "Line 4 airport van", "Gangbuk transfer"],
      linkTitle: "Suyu → Incheon Airport",
      h1: "Suyu Area to Incheon Airport",
      lede:
        "Short walks from Suyu Station clusters to a waiting van—then straight to ICN departures.",
      vehicleRecommendBlurb: "Tall-load vans when clubs plus suitcases travel together.",
      travelTraitsLine: "Side-street congestion near stations may shift meet points.",
      sections: sec(
        [
          "Meet-point strategy around Suyu commercial strips.",
          "Expressway merge toward ICN with flight-aware buffers.",
          "Built for northern Seoul riders on international tickets.",
        ],
        [
          "Golf cases welcomed with dimensions up front.",
          "Dawn pickups scheduled against your household clock.",
          "Kakao-friendly for Korean travelers.",
        ],
      ).en,
      faq: [
        { q: "Which exit at Suyu?", a: "We confirm based on your building and date." },
        { q: "Golf bag + two suitcases?", a: "Share counts—we’ll size the van." },
        { q: "4am pickup?", a: "Yes when confirmed." },
      ],
      primaryCtaLabel: "Book Suyu → ICN",
      localBusinessDescription: "Suyu corridor private transfers toward Incheon Airport.",
    },
  ),
  buildPage(
    "changdong-to-incheon-airport",
    "倉洞から仁川空港へ｜北部送迎",
    "仓洞至仁川机场｜北部送机",
    H2,
    {
      metaTitle: "창동 인천공항 샌딩 | 도봉·노원 연계 1·4호선 권역 출국",
      metaDescription:
        "창동역·도봉구 일대에서 인천공항까지 프라이빗 밴. 노원·의정부 방향 환승 거주자 출국, 가족·새벽 일정 상담.",
      keywords: ["창동 인천공항", "창동역 공항 샌딩", "도봉 인천공항", "1호선 창동 출국", "창동 콜밴"],
      linkTitle: "창동 → 인천공항",
      h1: "창동·도봉에서 인천공항까지 북부 출국 샌딩",
      lede:
        "창동 상권·주거 밀집 지역에서 인천공항 국제선까지 연결합니다. 1·4호선 환승으로 멀리 나오지 않고 집 근처에서 탑승할 수 있습니다.",
      vehicleRecommendBlurb: "단지 내 도로 폭·회전 반경을 고려해 승합 위주로 배정하는 경우가 많습니다.",
      travelTraitsLine: "북부 고속 접근 전 지선 구간이 혼잡하면 공항 도착 시각에 영향을 줍니다.",
      sections: sec(
        [
          "창동역 인근·단지 주소를 받아 차량 진입 가능 지점을 안내합니다.",
          "도봉·노원·의정부 방향에서 온 가족 동반 출국 일정을 조율합니다.",
          "새벽 첫차 전 출발 비행에 맞춘 픽업 창을 제안합니다.",
        ],
        [
          "Complex-friendly pickups around Chang-dong retail strips.",
          "Highway pacing toward ICN with family luggage in mind.",
          "Great when train-first-mile timing feels risky.",
        ],
      ).ko,
      faq: [
        { q: "창동에서 의정부 들렀다 인천 가능?", a: "동선이 길어지므로 편명과 함께 상담합니다." },
        { q: "새벽에 단지 정문 막히나요?", a: "관리실 규정에 따라 만남 위치를 조정합니다." },
        { q: "유모차 분해 없이 가능?", a: "차급에 따라 다릅니다. 미리 알려 주세요." },
      ],
      primaryCtaLabel: "창동 출발 인천 문의",
      localBusinessDescription: "창동·도봉 권역에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Chang-dong", "Dobong", "Nowon", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Chang-dong to Incheon Airport | Dobong Corridor Van",
      metaDescription:
        "Private van from Chang-dong and Dobong-gu to ICN—family dawn departures and Line 1 / Line 4 transfers avoided.",
      keywords: ["Chang-dong ICN", "Dobong airport van"],
      linkTitle: "Chang-dong → Incheon Airport",
      h1: "Chang-dong to Incheon Airport",
      lede:
        "Start near Chang-dong Station clusters—skip risky first-mile trains when luggage is heavy.",
      vehicleRecommendBlurb: "High-roof vans when apartment ramps are tight.",
      travelTraitsLine: "Local arterials north of Seoul can bunch before expressway access.",
      sections: sec(
        [
          "Gate-level guidance for Chang-dong apartment zones.",
          "ICN drop aligned with your airline’s terminal.",
          "Supports family groups leaving before subway hours.",
        ],
        [
          "Stops toward Uijeongbu discussed when routing fits.",
          "Stroller dimensions welcomed in advance.",
          "Honest ETAs for northern-to-west ICN legs.",
        ],
      ).en,
      faq: [
        { q: "Detour to Uijeongbu?", a: "Possible—quote with flight time." },
        { q: "Estate gate closures?", a: "We adjust meet points accordingly." },
        { q: "Stroller without breakdown?", a: "Depends on van class—tell us the model." },
      ],
      primaryCtaLabel: "Book Chang-dong → ICN",
      localBusinessDescription: "Chang-dong area private transfers to Incheon Airport.",
    },
  ),
  buildPage(
    "dobong-to-incheon-airport",
    "道峰から仁川空港へ｜北部出国送迎",
    "道峰至仁川机场｜北部送机",
    H3,
    {
      metaTitle: "도봉 인천공항 샌딩 | 쌍문동·방학동 출발 강북·노원 연계 출국",
      metaDescription:
        "도봉구 쌍문·방학·창동 일대에서 인천공항까지 프라이빗 밴. 강북·노원 인접 생활권, 짐 많은 가족·심야 출국.",
      keywords: ["도봉 인천공항", "쌍문동 공항 샌딩", "방학동 인천공항", "도봉구 출국 밴"],
      linkTitle: "도봉 → 인천공항",
      h1: "도봉·쌍문·방학에서 인천공항까지 출국 이동",
      lede:
        "도봉구 동네 도로와 단지 구조를 감안해 승하차 지점을 정합니다. 노원·강북과 인접해 북서권 출국 동선을 함께 상담합니다.",
      vehicleRecommendBlurb: "경사·좁은 이면도로가 많은 구간은 미니밴 이상에서 회전과 적재를 검토합니다.",
      travelTraitsLine: "쌍문역 일대 상업지 혼잡이 픽업 시각에 영향을 줄 수 있습니다.",
      sections: sec(
        [
          "쌍문·방학·도봉산역 권역 등 세부 출발지를 받아 만남 장소를 확정합니다.",
          "북쪽에서 서해안 쪽으로 빠지며 공항 고속 구간을 택합니다.",
          "가족 동반·대형 캐리어 동선을 지하철 대신 문 앞으로 모으고 싶은 분께 적합합니다.",
        ],
        [
          "Hilly pocket roads factored into pickup instructions.",
          "ICN international departures with luggage-forward mindset.",
          "Good fit when Dobong residents fly long-haul from ICN.",
        ],
      ).ko,
      faq: [
        { q: "도봉산 등산 후 바로 공항도 가능?", a: "짐 보관·샤워 일정이 있으면 알려 주세요. 동선에 넣어 상담합니다." },
        { q: "김포와 인천 중 어디로?", a: "항공권 목적지와 짐 양을 알려 주시면 비교해 드립니다." },
        { q: "단체·가족 합승 요금?", a: "인원·차종 기준으로 정찰제 상담합니다." },
      ],
      primaryCtaLabel: "도봉 출발 인천 예약",
      localBusinessDescription: "도봉구에서 인천공항 국제선 출국까지 이어주는 프라이빗 밴.",
      areaServedNames: ["Dobong", "Ssangmun", "Banghak", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Dobong to Incheon Airport | Northern Neighborhood Van",
      metaDescription:
        "Private van from Dobong-gu—Ssangmun, Banghak—to ICN with hillside-road-aware pickups and luggage-focused vehicles.",
      keywords: ["Dobong to ICN", "Ssangmun airport van"],
      linkTitle: "Dobong → Incheon Airport",
      h1: "Dobong to Incheon Airport",
      lede:
        "Local Dobong pickups tuned for narrow streets and heavier bags heading to international departures.",
      vehicleRecommendBlurb: "Minibuses when spinning vans need more mirror clearance.",
      travelTraitsLine: "Commercial strips near Ssangmun can slow curb meets.",
      sections: sec(
        [
          "Pickup pins around Dobong residential pockets.",
          "Westbound highway strategy toward ICN.",
          "Built for families skipping stair-heavy subway paths.",
        ],
        [
          "Hiking-to-airport combos quoted case-by-case.",
          "GMP vs ICN guidance when tickets allow choice.",
          "Group seating discussed with headcounts.",
        ],
      ).en,
      faq: [
        { q: "Hike then airport?", a: "Share timing—we’ll see if realistic." },
        { q: "GMP vs ICN?", a: "Airline and bags decide." },
        { q: "Large family?", a: "Headcount drives van class." },
      ],
      primaryCtaLabel: "Book Dobong → ICN",
      localBusinessDescription: "Dobong-gu private transfers toward Incheon Airport.",
    },
  ),
  buildPage(
    "byeolnae-to-incheon-airport",
    "別内から仁川空港へ｜新都市送迎",
    "别内至仁川机场｜新城送机",
    H1,
    {
      metaTitle: "별내 인천공항 샌딩 | 남양주 신도시 출발 구리·의정부 연계 출국",
      metaDescription:
        "남양주 별내신도시·택지에서 인천공항까지 프라이빗 밴. 경기 동북부 장거리 출국, 가족·새벽 일정, 통행료 포함 상담.",
      keywords: ["별내 인천공항", "별내신도시 공항 샌딩", "남양주 인천공항", "별내 출국 밴"],
      linkTitle: "별내 → 인천공항",
      h1: "별내신도시·남양주에서 인천공항까지 장거리 출국",
      lede:
        "별내·다산 등 신도시 광역거주 지역은 공항까지 내륙 구간이 길어 도착 시간을 보수적으로 산출합니다. 단지 로터리·상가 옆 만남 위치를 세부적으로 잡습니다.",
      vehicleRecommendBlurb: "신도시 왕복도로 이후 장거리 고속 구간이 이어지므로 트렁크가 넉넉한 차종을 우선합니다.",
      travelTraitsLine: "남양주에서 의정부·구리 방향과 합류하는 교통량에 따라 소요 시간 변동이 큽니다.",
      sections: sec(
        [
          "별내·다산· 호평 등 동·단지 정보를 받아 픽업 동선을 확정합니다.",
          "동북부에서 서쪽 공항으로 가는 고속 루트를 비교합니다.",
          "경기 동부 거주·서울 북부 직주근교 출국객에게 적합합니다.",
        ],
        [
          "New-town curb rules respected at Byeolnae complexes.",
          "Long inland legs priced with toll-inclusive transparency.",
          "Great for dual-career households flying ICN from Namyangju clusters.",
        ],
      ).ko,
      faq: [
        { q: "별내에서 인천까지 최소 몇 시간 전 출발?", a: "편명·요일에 따라 다릅니다. 역산 상담을 드립니다." },
        { q: "구리·남양주 다른 동네 친철 태우기?", a: "경유지와 시간을 알려 주시면 가능 여부를 말씀드립니다." },
        { q: "새벽 비행 시 피곤한 운전 걱정", a: "전문 기사 배차와 일정 여유를 함께 조율합니다." },
      ],
      primaryCtaLabel: "별내 출발 인천 상담",
      localBusinessDescription: "별내·남양주 신도시에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Byeolnae", "Namyangju", "Guri", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Byeolnae to Incheon Airport | Namyangju New Town Van",
      metaDescription:
        "Private van from Byeolnae new town to ICN—long inland drives priced clearly for eastern Gyeonggi households.",
      keywords: ["Byeolnae ICN", "Namyangju airport van"],
      linkTitle: "Byeolnae → Incheon Airport",
      h1: "Byeolnae to Incheon Airport",
      lede:
        "New-town pickups with highway-heavy routing—honest buffers for the distance west to ICN.",
      vehicleRecommendBlurb: "Large trunks for families relocating bags after long tours.",
      travelTraitsLine: "Merge traffic near Uijeongbu/Guri can shift ETA windows.",
      sections: sec(
        [
          "Precise pins inside Namyangju developments.",
          "Toll-inclusive quotes explained during booking.",
          "Supports commuters flying internationally from ICN.",
        ],
        [
          "Relative pickups along the route when time allows.",
          "Driver-managed fatigue spacing on overnight flights.",
          "WhatsApp for itinerary edits.",
        ],
      ).en,
      faq: [
        { q: "How early from Byeolnae?", a: "Back-planned from your airline cutoff." },
        { q: "Extra stop in Guri?", a: "Ask with addresses." },
        { q: "Red-eye assistance?", a: "We pace pickups for tired travelers." },
      ],
      primaryCtaLabel: "Book Byeolnae → ICN",
      localBusinessDescription: "Byeolnae new-town transfers toward Incheon Airport.",
    },
  ),
  buildPage(
    "namyangju-to-incheon-airport",
    "南楊州から仁川空港へ｜東部送迎",
    "南杨州至仁川机场｜东部送机",
    H2,
    {
      metaTitle: "남양주 인천공항 샌딩 | 와부·진접·호평 출발 경기 동북부 출국",
      metaDescription:
        "남양주 와부·진접·호평·도농에서 인천공항까지 프라이빗 밴. 구리·별내와 연계되는 장거리 출국, 단체·가족 동반 상담.",
      keywords: ["남양주 인천공항", "와부 인천공항", "진접 공항 샌딩", "호평 인천", "남양주 출국 밴"],
      linkTitle: "남양주 → 인천공항",
      h1: "남양주·와부·진접에서 인천공항까지 동북부 출국",
      lede:
        "경기 동북부 외곽에서 인천공항까지 장거리 이동을 정찰제로 안내합니다. 와부·진접 등 산세와 신도시가 섞인 도로 특성을 반영해 출발 시각을 제안합니다.",
      vehicleRecommendBlurb: "지역 행사·주말 나들이 차량이 몰리는 시간대에는 버퍼를 넉넉히 둡니다.",
      travelTraitsLine: "동부 내륙에서 서해안 쪽 공항으로 가는 동선은 날씨·사고에 따라 편차가 큽니다.",
      sections: sec(
        [
          "와부·진접·호평 등 읍면동 단위 주소를 받아 픽업을 확정합니다.",
          "구리·남양주 연결 도로와 고속 접속을 비교합니다.",
          "가족·지인 동승이 많은 출국 일정에 맞춰 차량 크기를 조정합니다.",
        ],
        [
          "Rural-urban mix routing from Namyangju toward ICN.",
          "Weekend leisure traffic factored for eastern Gyeonggi.",
          "Helpful when trains plus taxis feel slower than one van.",
        ],
      ).ko,
      faq: [
        { q: "진접에서 출발하면 의정부보다 오래 걸리나요?", a: "출발 지점마다 다릅니다. 주소 기준으로 산출합니다." },
        { q: "남양주에서 단체 인원 나눠 태우기?", a: "인원·짐에 따라 밴 2대 분할도 상담합니다." },
        { q: "골프 일정 후 바로 인천 출국?", a: "라운드 종료 시각과 클럽 적재를 알려 주세요." },
      ],
      primaryCtaLabel: "남양주 출발 인천 예약",
      localBusinessDescription: "남양주 일대에서 인천공항 출국까지 이어주는 동북부 프라이빗 밴.",
      areaServedNames: ["Namyangju", "Wabu", "Jinjeop", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Namyangju to Incheon Airport | Eastern Gyeonggi Van",
      metaDescription:
        "Private van from Namyangju—Wabu, Jinjeop, Hopo—to ICN for long outbound legs across northern Gyeonggi.",
      keywords: ["Namyangju to ICN", "Wabu airport transfer"],
      linkTitle: "Namyangju → Incheon Airport",
      h1: "Namyangju to Incheon Airport",
      lede:
        "Eastern belt households flying internationally—long drives priced with toll-aware honesty.",
      vehicleRecommendBlurb: "Dual vans for split groups when headcounts exceed seat belts.",
      travelTraitsLine: "Weather and incidents on cross-metro highways can swing ETA sharply.",
      sections: sec(
        [
          "Township-accurate pins across Namyangju.",
          "Group sizing with golf gear possible when disclosed.",
          "Highway contingencies explained before you commit.",
        ],
        [
          "Compare vs Uijeongbu routing when helpful.",
          "Driver coordination for tired red-eye travelers.",
          "English WhatsApp for inbound tourists staying eastward.",
        ],
      ).en,
      faq: [
        { q: "Jinjeop vs Uijeongbu timing?", a: "Address-first comparison." },
        { q: "Two vans for groups?", a: "Yes when safer than one overloaded van." },
        { q: "Golf then ICN?", a: "Share end time and bag counts." },
      ],
      primaryCtaLabel: "Book Namyangju → ICN",
      localBusinessDescription: "Namyangju to Incheon Airport private transfers.",
    },
  ),
  buildPage(
    "guri-to-incheon-airport",
    "九里から仁川空港へ｜京畿北部送迎",
    "九里至仁川机场｜京畿北部送机",
    H3,
    {
      metaTitle: "구리 인천공항 샌딩 | 강변·아차산 권역 한강 북쪽 출국 밴",
      metaDescription:
        "구리·강변·토평동 일대에서 인천공항까지 프라이빗 밴. 남양주·별내·노원과 맞닿는 한강 이북 출국 동선, 새벽·가족 상담.",
      keywords: ["구리 인천공항", "구리 공항 샌딩", "강변구리 인천", "구리 출국 콜밴", "아차산 인천공항"],
      linkTitle: "구리 → 인천공항",
      h1: "구리·한강 이북에서 인천공항까지 출국 샌딩",
      lede:
        "구리시 생활권에서 서쪽 인천공항까지 고속 위주로 연결합니다. 아차산·강변 연계 노원·남양주 방문 일정과 묶인 출국도 상담합니다.",
      vehicleRecommendBlurb: "강변도로·교량 구간 혼잡을 고려해 출발역을 이른 시간으로 당기는 경우가 있습니다.",
      travelTraitsLine: "한강 북쪽에서 공항으로 빠질 때 내부순환·외곽 고속 합류 지점이 병목이 될 수 있습니다.",
      sections: sec(
        [
          "구리·교문·인창 등 세부 동네 주소를 받아 픽업 위치를 정합니다.",
          "한강 이북에서 서해안 공항으로 가는 최단 고속 조합을 안내합니다.",
          "수도권 동북부 거주자의 인천 국제선 출국에 적합합니다.",
        ],
        [
          "Han River north pickups with bridge-crossing delays modeled.",
          "ICN-bound routing tuned for international departures.",
          "Pairs well with Namyangju/Uijeongbu combined itineraries.",
        ],
      ).ko,
      faq: [
        { q: "구리에서 김포가 더 가까운데 인천만 가능?", a: "항공편과 짐 양을 알려 주시면 동선을 비교합니다." },
        { q: "아차산역 근처 픽업?", a: "도보·차량 접근 가능 지점을 함께 정합니다." },
        { q: "어린이·카시트", a: "연령과 좌석 요청을 예약 시 남겨 주세요." },
      ],
      primaryCtaLabel: "구리 출발 인천 문의",
      localBusinessDescription: "구리·한강 이북 권역에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Guri", "Achasan", "Han River North", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Guri to Incheon Airport | Han River North Van",
      metaDescription:
        "Private van from Guri toward ICN—bridge-crossing delays modeled for northern riverside departures.",
      keywords: ["Guri to ICN", "Guri airport van"],
      linkTitle: "Guri → Incheon Airport",
      h1: "Guri to Incheon Airport",
      lede:
        "North-of-the-river households heading west to ICN—routing that respects rush bottlenecks near inner loops.",
      vehicleRecommendBlurb: "Child-seat requests welcomed with advance notice.",
      travelTraitsLine: "Inner-ring merges can sting during peaks—we pad ETAs.",
      sections: sec(
        [
          "Neighborhood pins across Guri districts.",
          "International-departure focus toward ICN terminals.",
          "Works alongside Namyangju/Uijeongbu trip combos.",
        ],
        [
          "GMP vs ICN counseling when flights permit.",
          "Achasan-area meets when curb rules fit.",
          "Family-forward scheduling language in Korean and English.",
        ],
      ).en,
      faq: [
        { q: "ICN even if GMP is closer?", a: "Airline driven—we’ll advise." },
        { q: "Achasan pickup?", a: "Share walking distance constraints." },
        { q: "Car seats?", a: "Age + booking lead time help." },
      ],
      primaryCtaLabel: "Book Guri → ICN",
      localBusinessDescription: "Guri to Incheon Airport private transfer service.",
    },
  ),
  buildPage(
    "yangju-to-incheon-airport",
    "楊州から仁川空港へ｜北部送迎",
    "杨州至仁川机场｜北部送机",
    H1,
    {
      metaTitle: "양주 인천공항 샌딩 | 옥정·덕정·회천 출발 경기 북서부 출국",
      metaDescription:
        "양주 옥정·덕정·회천 등 북서 경기에서 인천공항까지 프라이빗 밴. 의정부·동두천과 연계되는 장거리 출국, 새벽·단체 상담.",
      keywords: ["양주 인천공항", "옥정 공항 샌딩", "덕정 인천공항", "회천 출국 밴", "양주 콜밴"],
      linkTitle: "양주 → 인천공항",
      h1: "양주·옥정·덕정에서 인천공항까지 북서 경기 출국",
      lede:
        "양주 택지·신도시에서 인천공항까지 내륙 장거리 이동을 상담합니다. 의정부·포천 방향과 연결되는 도로 특성을 반영해 공항 도착 시각을 산출합니다.",
      vehicleRecommendBlurb: "신도시 왕복로 이후 고속 합류까지 시간을 넉넉히 잡고, 대형 캐리어는 트렁크 높이를 미리 확보합니다.",
      travelTraitsLine: "북서 경기에서 서쪽 공항으로 가는 동선은 포천·고양 방향 교통에 따라 변동이 큽니다.",
      sections: sec(
        [
          "옥정·덕정·회천 등 읍·동 주소를 받아 픽업을 확정합니다.",
          "경기 북서부에서 인천 방향 고속 접속 루트를 비교합니다.",
          "의정부·동두천 인근 가족과 합승하는 출국 일정도 조율합니다.",
        ],
        [
          "Yangju new-town pins with long-haul ICN planning.",
          "Group-friendly vans when extended families share one departure.",
          "Dawn departures for flights westbound via ICN.",
        ],
      ).ko,
      faq: [
        { q: "양주에서 인천이 김포보다 나은 경우는?", a: "항공권·편명 기준으로 안내합니다." },
        { q: "회천에서 단체 승차?", a: "승차 순서와 짐 적재를 미리 정하면 원활합니다." },
        { q: "새벽 운행 추가 요금?", a: "시간대는 예약 시 정찰제에 포함해 설명드립니다." },
      ],
      primaryCtaLabel: "양주 출발 인천 예약",
      localBusinessDescription: "양주·경기 북서부에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Yangju", "Okjeong", "Deokjeong", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Yangju to Incheon Airport | Northwest Gyeonggi Van",
      metaDescription:
        "Private van from Yangju—Okjeong, Deokjeong, Hoecheon—to ICN for long northwest-to-airport runs.",
      keywords: ["Yangju to ICN", "Okjeong airport van"],
      linkTitle: "Yangju → Incheon Airport",
      h1: "Yangju to Incheon Airport",
      lede:
        "Northwest Gyeonggi pickups with expressway-weighted timing toward ICN international departures.",
      vehicleRecommendBlurb: "Tall-load vans for stacked suitcases after long home leaves.",
      travelTraitsLine: "Pocheon/Goyang corridor traffic can reshape ETAs—buffers discussed upfront.",
      sections: sec(
        [
          "Township-level addresses across Yangju.",
          "Merge strategies onto westbound expressways.",
          "Group pickups when relatives share airport timing.",
        ],
        [
          "ICN vs GMP counseling with ticket facts.",
          "Night-rate transparency during booking.",
          "English-friendly WhatsApp for mixed households.",
        ],
      ).en,
      faq: [
        { q: "ICN vs GMP from Yangju?", a: "Ticket-first guidance." },
        { q: "Group boarding in Hoecheon?", a: "Order and luggage plan matters." },
        { q: "Night surcharge?", a: "Bundled into quoted windows when booked." },
      ],
      primaryCtaLabel: "Book Yangju → ICN",
      localBusinessDescription: "Yangju to Incheon Airport private transfers.",
    },
  ),
  buildPage(
    "dongducheon-to-incheon-airport",
    "東豆川から仁川空港へ｜最北部送迎",
    "东豆川至仁川机场｜最北部送机",
    H2,
    {
      metaTitle: "동두천 인천공항 샌딩 | 의정부·포천 방향 최북부 출국 장거리 밴",
      metaDescription:
        "동두천·보산·연천 접경 권역에서 인천공항까지 프라이빗 밴. 수도권 최북단 출발 장거리 출국, 군·관외 거주 동선, 새벽 편 상담.",
      keywords: ["동두천 인천공항", "동두천 공항 샌딩", "보산 인천공항", "경기 최북부 출국", "동두천 콜밴"],
      linkTitle: "동두천 → 인천공항",
      h1: "동두천·최북부 생활권에서 인천공항까지 장거리 출국",
      lede:
        "동두천·보산 등 경기 최북단에서 인천공항까지 이동 거리가 매우 깁니다. 체크인 마감에 맞추어 과도하게 빡빡한 일정보다 안전한 도착을 우선합니다.",
      vehicleRecommendBlurb: "장시간 고속 운행이 예상되어 승합·대형 밴으로 피로와 적재를 동시에 고려합니다.",
      travelTraitsLine: "의정부·포천 방향 국도·고속 합류 구간 사고·공사에 따라 시간이 크게 늘어날 수 있습니다.",
      sections: sec(
        [
          "동두천 시내·보산·연계 읍면 주소를 받아 현실적인 픽업 시각을 제안합니다.",
          "최북부에서 서해안 공항으로 가는 장거리 고속 동선을 설명합니다.",
          "포천·의정부 일대와 동선이 비슷한 출국객에게도 참고가 됩니다.",
        ],
        [
          "Northernmost Gyeonggi pickups with conservative ICN ETAs.",
          "Highway incident contingencies communicated early.",
          "Ideal when ICN is chosen despite extreme distance.",
        ],
      ).ko,
      faq: [
        { q: "동두천에서 인천이 너무 멀면 김포를 써야 하나요?", a: "항공 스케줄과 수하물을 알려 주시면 현실적인 선택을 도와드립니다." },
        { q: "군 관련 일정 후 출국?", a: "보안·시간 제약이 있으면 미리 알려 주세요." },
        { q: "단체 인원 분할?", a: "대형 밴·2대 분할 등 옵션을 상담합니다." },
      ],
      primaryCtaLabel: "동두천 출발 인천 상담",
      localBusinessDescription: "동두천·경기 최북부에서 인천공항 출국까지 연결하는 장거리 프라이빗 밴.",
      areaServedNames: ["Dongducheon", "Bosan", "Northern Gyeonggi", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Dongducheon to Incheon Airport | Northernmost Gyeonggi Van",
      metaDescription:
        "Private van from Dongducheon to ICN—very long inland legs with conservative buffers for northernmost metro travelers.",
      keywords: ["Dongducheon to ICN", "northern Gyeonggi airport van"],
      linkTitle: "Dongducheon → Incheon Airport",
      h1: "Dongducheon to Incheon Airport",
      lede:
        "Far-north pickups where honesty about drive time matters more than marketing shortcuts.",
      vehicleRecommendBlurb: "Spacious vans for road-weary groups hauling heavy luggage.",
      travelTraitsLine: "Incidents near Uijeongbu/Pocheon merges can add unpredictable delay.",
      sections: sec(
        [
          "Ultra-north pins with realistic ICN arrival targets.",
          "Long-haul pricing explained with tolls.",
          "Group splits when seat belts are at risk.",
        ],
        [
          "GMP vs ICN counseling with facts, not guesses.",
          "Military-adjacent timing constraints respected privately.",
          "English WhatsApp for foreign residents up north.",
        ],
      ).en,
      faq: [
        { q: "Too far for ICN?", a: "We compare ticket needs vs drive reality." },
        { q: "Post-duty travel?", a: "Share timing constraints quietly." },
        { q: "Two vans?", a: "When one van can’t seat everyone safely." },
      ],
      primaryCtaLabel: "Book Dongducheon → ICN",
      localBusinessDescription: "Dongducheon to Incheon Airport long-distance transfers.",
    },
  ),
  /* --- 목적형 (기존 일반 랜딩과 각도 분리) --- */
  buildPage(
    "dawn-incheon-transfer",
    "早朝仁川空港移動｜出国前泊なしバン",
    "清晨仁川机场出行｜赶早班包车",
    H1,
    {
      metaTitle: "새벽 인천공항 이동 | 첫차 전 출국역산·심야 픽업 프라이빗 밴",
      metaDescription:
        "첫 지하철·버스 전에 맞추는 새벽 인천공항(ICN) 이동. 의정부·노원·남양주 등 북부 거주자 출국, 체크인 역산·카시트·대형 캐리어 상담.",
      keywords: ["새벽 인천공항", "새벽 인천 이동", "첫차 전 공항", "심야 인천공항 밴", "새벽 출국 픽업"],
      linkTitle: "새벽 인천공항 이동",
      h1: "새벽·첫차 전 인천공항 출국 이동",
      lede:
        "새벽 출발 국제선에 맞춰 집·호텔에서 바로 인천공항으로 연결합니다. ‘첫차로 공항 가면 되겠지’보다 안전하게, 체크인·보안 대기까지 역산합니다.",
      vehicleRecommendBlurb: "야간 운행은 운전 집중도와 휴식 간격을 고려해 일정을 과밀하게 잡지 않습니다.",
      travelTraitsLine: "의정부·강북·노원 등 북부 거주자는 첫차 환승보다 직행이 종종 더 안정적입니다.",
      sections: sec(
        [
          "편명·체크인 방식·터미널을 받아 집에서 나와야 할 시각을 계산합니다.",
          "새벽에는 고속도로 차량 밀도가 달라지지만 졸음·야간 공사 변수도 함께 봅니다.",
          "유아 동반·카시트·유모차가 있으면 승하차·안전 거리를 더 넉넉히 잡습니다.",
        ],
        [
          "Flight-number-first planning for ultra-early ICN departures.",
          "Night-drive safety spacing—no fantasy ETAs.",
          "Northern Seoul / Gyeonggi households avoiding risky first trains.",
        ],
      ).ko,
      faq: [
        { q: "몇 시에 문 앞에서 만나야 하나요?", a: "항공사 마감과 터미널을 알려 주시면 역산합니다." },
        { q: "노원·의정부처럼 멀면 더 일찍?", a: "네. 거주 지역까지 포함해 출발 시각을 잡습니다." },
        { q: "김포 새벽편도 같은 방식?", a: "목적 공항을 알려 주시면 동선을 나눕니다." },
      ],
      primaryCtaLabel: "새벽 인천 일정 상담",
      localBusinessDescription: "새벽 인천공항 출국을 위한 심야·새벽 픽업 전문 프라이빗 밴.",
      areaServedNames: ["Incheon International Airport", "Seoul Metropolitan Area", "Gyeonggi-do", "South Korea"],
    },
    {
      metaTitle: "Dawn Incheon Airport Transfer | Before First Train",
      metaDescription:
        "Pre-dawn private vans to ICN when first subway trains are too late—reverse-planned from check-in with northern Seoul buffers.",
      keywords: ["dawn ICN transfer", "early Incheon van", "before first train airport Korea"],
      linkTitle: "Dawn ICN transfer",
      h1: "Dawn Runs to Incheon Airport",
      lede:
        "Built for flights that leave before transit is sane—pickups tuned to airline cutoffs, not marketing clichés.",
      vehicleRecommendBlurb: "Night-shift spacing for safer highway pacing.",
      travelTraitsLine: "Northern belts often beat risky Line transfers with one direct van.",
      sections: sec(
        [
          "Reverse timing from security lines—not vibes.",
          "ICN-specific focus within Korea airport choices.",
          "Family gear (car seats) lengthens boarding windows.",
        ],
        [
          "Compare against dawn-airport-pickup pages for tone differences.",
          "English WhatsApp for inbound tourists with early ICN legs.",
          "Honest night surcharges bundled transparently.",
        ],
      ).en,
      faq: [
        { q: "How is this different from generic dawn pickup?", a: "This page centers ICN timing math vs mixed-airport pages." },
        { q: "Nowon resident?", a: "We add northern distance honestly." },
        { q: "GMP instead?", a: "Say so—we’ll route accordingly." },
      ],
      primaryCtaLabel: "Plan dawn ICN run",
      localBusinessDescription: "Dawn-focused Incheon International Airport private transfers.",
    },
  ),
  buildPage(
    "dawn-airport-sanding-korea",
    "早朝空港シャンディング｜出国ドロップオフ",
    "清晨机场送机｜出国送达",
    H2,
    {
      metaTitle: "새벽 공항 샌딩 | 출국층 하차·체크인 동선 맞춤 프라이빗 밴",
      metaDescription:
        "새벽 출발편에 맞춰 집에서 공항 출국층까지 샌딩. 인천·김포 모두 상담. 가족·짐 많은 분은 카시트·대형 캐리어 전제로 시간을 잡습니다.",
      keywords: ["새벽 공항 샌딩", "출국 새벽 하차", "새벽 출국 밴", "공항 출국층 샌딩", "심야 공항 이동"],
      linkTitle: "새벽 공항 샌딩",
      h1: "새벽 출국편 맞춤 공항 샌딩·하차",
      lede:
        "‘픽업’이 아니라 출국장 앞 하차·동선에 초점을 맞춘 페이지입니다. 새벽에는 보안 줄·셀프 체크인 줄 길이가 변수라 출발 시각을 더 보수적으로 잡습니다.",
      vehicleRecommendBlurb: "출국층 하차 위치(T1/T2, 국적사별 구역)를 미리 알려 주시면 현관 동선까지 설명하기 쉽습니다.",
      travelTraitsLine: "경기북부·남양주처럼 거리가 길수록 샌딩(하차) 시각이 아니라 집 출발 시각이 더 중요합니다.",
      sections: sec(
        [
          "출국 편명과 선호 체크인 방식을 받아 ‘언제 문을 나설지’를 계산합니다.",
          "인천·김포 중 목적 공항과 터미널을 확정합니다.",
          "가족·단체는 하차 후 이동 시간(엘리베이터·유모차)까지 버퍼를 남깁니다.",
        ],
        [
          "Drop-off mindset: curb rules and terminal doors.",
          "Works for Korean residents and inbound tourists alike.",
          "Pairs logically with family or heavy-luggage pages.",
        ],
      ).ko,
      faq: [
        { q: "새벽 공항 픽업 페이지와 차이가 있나요?", a: "이 페이지는 출국 ‘샌딩·하차’ 역산에 더 초점을 둡니다." },
        { q: "셀프 체크인만 하는데도 일찍?", a: "보안·출국 심사 줄을 포함해 상담합니다." },
        { q: "남양주에서 인천 새벽 샌딩 비용?", a: "거리·시간대 반영 정찰제로 안내합니다." },
      ],
      primaryCtaLabel: "새벽 샌딩 시간 역산",
      localBusinessDescription: "새벽 출국편에 맞춘 공항 샌딩·출국층 하차 중심 프라이빗 밴.",
      areaServedNames: ["Incheon International Airport", "Gimpo International Airport", "South Korea"],
    },
    {
      metaTitle: "Dawn Airport Drop-off Korea | Terminal Curbs",
      metaDescription:
        "Early-morning airport drop-offs focused on departure-level curb timing—not just pickup branding—for ICN/GMP travelers.",
      keywords: ["dawn airport drop-off Korea", "early ICN curb", "departure level van"],
      linkTitle: "Dawn airport drop-off",
      h1: "Dawn Airport Drop-off Planning",
      lede:
        "Terminology matters: this page optimizes when you leave home to reach departures—not arrival pickups.",
      vehicleRecommendBlurb: "Terminal-aware instructions reduce curb panic.",
      travelTraitsLine: "Long northern drives mean door departure time beats drop-off time.",
      sections: sec(
        [
          "Curbside behaviors at ICN/GMP explained plainly.",
          "Security-line uncertainty baked into buffers.",
          "Cross-links from northern city pages intentionally.",
        ],
        [
          "Differentiator vs dawn-incheon-transfer.",
          "English explanations for foreign carriers.",
          "Group drop-offs staged safely.",
        ],
      ).en,
      faq: [
        { q: "Pickup vs drop-off?", a: "This URL emphasizes outbound curb timing." },
        { q: "Self bag-drop only?", a: "We still pad for security queues." },
        { q: "Namyangju timing?", a: "Distance adds home-lead time." },
      ],
      primaryCtaLabel: "Schedule dawn drop-off",
      localBusinessDescription: "Dawn airport drop-off oriented private van service in Korea.",
    },
  ),
  buildPage(
    "family-airport-pickup-korea",
    "家族空港ピックアップ｜到着ロビー送迎",
    "家庭机场接机｜到达大厅接送",
    H2,
    {
      metaTitle: "가족 공항 픽업 | 입국장·게이트 동선 맞춤 프라이빗 밴 (인천·김포)",
      metaDescription:
        "유아·부모님 동반 가족의 인천·김포 입국 픽업. 카시트·유모차·대형 캐리어. 의정부·노원·남양주 등 경기북부 귀가 동선 상담.",
      keywords: ["가족 공항 픽업", "가족 입국 픽업", "유아 인천 픽업", "카시트 공항", "가족 인천 입국"],
      linkTitle: "가족 공항 픽업",
      h1: "가족·유아 동반 공항 입국 픽업",
      lede:
        "도착 게이트·수하물 벨트 이후 만나는 흐름을 기준으로 설명합니다. 가족 공항 이동(출국) 페이지와 달리 귀가·입국 후 연결에 맞춘 카피입니다.",
      vehicleRecommendBlurb: "카시트·부스터는 연령·체중을 알려 주시면 차량과 조합을 제안합니다.",
      travelTraitsLine: "경기북부·강북 자택까지 가려면 입국 후 피로·아이 동선을 고려해 차량을 넉넉히 잡습니다.",
      sections: sec(
        [
          "항공편 도착 시간·터미널·입국 심사 예상을 받아 만남 장소를 정합니다.",
          "수하물이 많으면 벨트 대기·카트 동선까지 포함해 체류 시간을 추정합니다.",
          "의정부·구리·남양주 등 실거주지까지 한 번에 연결합니다.",
        ],
        [
          "Arrival-focused storytelling vs outbound pages.",
          "Car-seat logistics after long flights.",
          "Northern Gyeonggi home rides after ICN immigration.",
        ],
      ).ko,
      faq: [
        { q: "입국장 어디서 만나나요?", a: "미팅 포인트를 도착 정보에 맞춰 안내합니다." },
        { q: "가족 공항 이동 페이지와 중복 아닌가요?", a: "출국 샌딩이 아니라 입국 픽업·귀가 중심입니다." },
        { q: "유모차 실을 공간은?", a: "접이 크기를 알려 주시면 적재 가능 차종을 제안합니다." },
      ],
      primaryCtaLabel: "가족 입국 픽업 문의",
      localBusinessDescription: "가족·유아 동반 인천·김포 입국 픽업 및 경기북부 귀가 연결.",
      areaServedNames: ["Incheon International Airport", "Gimpo International Airport", "Seoul Metropolitan Area", "South Korea"],
    },
    {
      metaTitle: "Family Airport Pickup Korea | ICN/GMP Arrivals",
      metaDescription:
        "Private van airport pickups for families—car seats, strollers, and luggage after immigration at ICN/GMP.",
      keywords: ["family airport pickup Korea", "ICN arrival van kids", "car seat airport pickup"],
      linkTitle: "Family airport pickup",
      h1: "Family Airport Pickup After Immigration",
      lede:
        "Inbound-focused: meet flows after baggage, not outbound drop-offs.",
      vehicleRecommendBlurb: "Seat planning for jet-lagged kids and elders.",
      travelTraitsLine: "Northern Gyeonggi home rides need realistic immigration buffers.",
      sections: sec(
        [
          "Meet-point clarity after belts.",
          "Immigration variability acknowledged.",
          "Works for tourists and Korean families alike.",
        ],
        [
          "Differentiator vs family-airport-transfer outbound tone.",
          "English WhatsApp for visitors.",
          "Uijeongbu/Namyangju drop-offs welcomed.",
        ],
      ).en,
      faq: [
        { q: "Meet inside?", a: "We explain carrier-specific rules." },
        { q: "Different from family transfer page?", a: "That mix includes outbound—this is arrival-first." },
        { q: "Stroller volume?", a: "Dimensions help van selection." },
      ],
      primaryCtaLabel: "Book family pickup",
      localBusinessDescription: "Family-focused arrival pickups at Korean airports.",
    },
  ),
  buildPage(
    "heavy-luggage-incheon-transfer",
    "大型行李仁川移送｜キャリア多バン",
    "大件行李仁川接送｜多件行李包车",
    H3,
    {
      metaTitle: "캐리어 많은 인천공항 이동 | 대형 수하물·박스 동반 프라이빗 밴",
      metaDescription:
        "대형 캐리어·박스 다수 동반 인천공항 이동. 엘리베이터 없이 문 앞 픽업, 의정부·노원·남양주 등 경기북부 장거리 적재 상담.",
      keywords: ["캐리어 많은 공항 이동", "대형 캐리어 인천", "짐 많은 인천공항", "박스 공항 이사 밴", "수하물 많은 출국"],
      linkTitle: "캐리어 많은 인천 이동",
      h1: "대형 캐리어·짐 많은 인천공항 이동",
      lede:
        "29인치 캐리어 여러 개·박스 이사급 짐을 전제로 차량을 고릅니다. 지하철 계단 대신 문 앞에서 싣고, 출국 동선까지 한 번에 맞춥니다.",
      vehicleRecommendBlurb: "적재 높이와 개폐 각도가 중요해 세단이 아닌 미니밴 이상을 기본 전제로 상담합니다.",
      travelTraitsLine: "경기북부 장거리에서는 짐 무게와 고정(슬라이딩 여부)까지 확인하는 편이 안전합니다.",
      sections: sec(
        [
          "캐리어 개수·박스 치수를 숫자로 받아 트렁크 적재 시뮬레이션을 합니다.",
          "인천공항 출국 시 카트 사용 전 차량 적재가 더 편한 경우를 안내합니다.",
          "단체·유학생 가족처럼 짐이 한 번에 많이 나오는 경우에 적합합니다.",
        ],
        [
          "Dimension-first booking—not guesswork.",
          "Minivan-first mindset vs sedans that fail trunk tests.",
          "Pairs with northern long drives where bags dominate fatigue.",
        ],
      ).ko,
      faq: [
        { q: "캐리어 4개도 가능?", a: "차종과 적재 순서에 따라 다릅니다. 치수를 알려 주세요." },
        { q: "골프백도 같이?", a: "골프 전용 페이지와 연계해 적재 검토합니다." },
        { q: "의정부에서 짐 많이 실고 인천?", a: "장거리·무게를 함께 반영해 안내합니다." },
      ],
      primaryCtaLabel: "짐 사진·치수 상담",
      localBusinessDescription: "대형 캐리어·다수 수하물 동반 인천공항 이동 프라이빗 밴.",
      areaServedNames: ["Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Heavy Luggage to Incheon Airport | Tall Trunk Van",
      metaDescription:
        "Private vans sized for multiple oversized suitcases—dimension-aware booking for ICN departures from northern Gyeonggi.",
      keywords: ["heavy luggage ICN", "many suitcases airport van Korea"],
      linkTitle: "Heavy luggage ICN transfer",
      h1: "Heavy Luggage Runs to Incheon Airport",
      lede:
        "Trunk math beats slogans—tell us counts and sizes before we quote.",
      vehicleRecommendBlurb: "Minivans default when sedans fail closure tests.",
      travelTraitsLine: "Long northern drives plus heavy bags equals conservative staging.",
      sections: sec(
        [
          "Numeric luggage manifests.",
          "ICN-focused outbound framing.",
          "Student relocation loads welcomed.",
        ],
        [
          "Cross-link golf clubs when hybrid loads.",
          "English sizing messages accepted.",
          "Elevator-free curb loads emphasized.",
        ],
      ).en,
      faq: [
        { q: "Four suitcases?", a: "Depends on dimensions—photos help." },
        { q: "Plus golf?", a: "See hybrid booking notes." },
        { q: "Uijeongbu long haul?", a: "Weight + distance quoted together." },
      ],
      primaryCtaLabel: "Book heavy ICN load",
      localBusinessDescription: "Heavy luggage oriented transfers to Incheon Airport.",
    },
  ),
  buildPage(
    "foreigner-incheon-airport-meet",
    "外国人仁川空港ピックアップ｜英語ミート",
    "外国人仁川机场接机｜英语汇合",
    H1,
    {
      metaTitle: "외국인 인천공항 픽업 | 영어 미팅·관광·출장 VIP 프라이빗 밴",
      metaDescription:
        "외국인 관광객·출장객 인천공항 도착 후 픽업. 영어 일정 조율, 호텔·의정부·강남 등 연계 이동. 짐·단체 동반 상담.",
      keywords: ["외국인 인천 픽업", "영어 공항 픽업", "foreigner ICN pickup", "인천공항 미팅 서비스", "tourist van ICN"],
      linkTitle: "외국인 인천 픽업",
      h1: "외국인 관광·출장 인천공항 픽업·미팅",
      lede:
        "영어 메신저로 도착 편명·터미널을 맞춘 뒤 미팅 포인트를 안내합니다. 한국인 일반 공항 이동 페이지와 달리 언어·입국 동선·호텔 연계를 전제로 씁니다.",
      vehicleRecommendBlurb: "단체·대형 캐리어 시 미니밴 이상을 권장하고, 호텔 드롭 순서를 미리 받습니다.",
      travelTraitsLine: "관광 목적이면 강남·명동, 거주 목적이면 의정부·남양주까지 동선을 나눠 안내합니다.",
      sections: sec(
        [
          "항공편·국적·도착 예상 시간을 받아 미팅 문구를 영어로 정리해 드립니다.",
          "입국 심사 대기 변동을 고려해 운전 기사 대기·회전 픽업을 조율합니다.",
          "외국인 바이어·참가자 단체 행사도 인원 수에 맞춰 차량을 분할합니다.",
        ],
        [
          "English-first coordination via WhatsApp.",
          "Tourist vs business itineraries routed differently.",
          "Designed for inbound travelers reading Korea-focused SEO pages.",
        ],
      ).ko,
      faq: [
        { q: "영어만 가능한 손님도 되나요?", a: "네. WhatsApp 기준으로 일정을 맞춥니다." },
        { q: "호텔이 의정부인데 인천 도착이면?", a: "거리와 요금을 함께 안내합니다." },
        { q: "단체 미팅 간판?", a: "행사명·로고 유무를 알려 주시면 준비를 안내합니다." },
      ],
      primaryCtaLabel: "외국인 픽업 일정 보내기",
      localBusinessDescription: "외국인 관광·출장객 인천공항 도착 픽업 및 수도권 연계 이동.",
      areaServedNames: ["Incheon International Airport", "Seoul", "South Korea"],
    },
    {
      metaTitle: "Foreigner Incheon Airport Pickup | English Meet & Greet Van",
      metaDescription:
        "English-coordinated private pickups at ICN for tourists and business visitors—WhatsApp-first scheduling with hotel drops across metro Seoul.",
      keywords: ["foreigner ICN pickup", "English airport pickup Korea", "tourist van Incheon"],
      linkTitle: "Foreigner ICN pickup",
      h1: "Foreign Visitor Pickups at Incheon Airport",
      lede:
        "Inbound storytelling: meet flows, immigration variability, and hotel routing in plain English.",
      vehicleRecommendBlurb: "Group splits when meet-and-greet parties exceed seat belts.",
      travelTraitsLine: "Tourists to Gangbuk vs corporate hops differ—tell us your hotel pin.",
      sections: sec(
        [
          "Terminal-aware English instructions.",
          "Immigration buffer honesty.",
          "Event signage options for groups.",
        ],
        [
          "SEO distinction vs Korean resident pages.",
          "Supports conference delegates and family visitors.",
          "Works with family-airport-pickup for hybrid trips.",
        ],
      ).en,
      faq: [
        { q: "English only?", a: "Yes—WhatsApp scheduling preferred." },
        { q: "Hotel in Uijeongbu?", a: "Quoted with distance realism." },
        { q: "Group placards?", a: "Share branding needs early." },
      ],
      primaryCtaLabel: "Book foreign pickup",
      localBusinessDescription: "English-friendly Incheon Airport pickup service for foreign visitors.",
    },
  ),
  buildPage(
    "incheon-airport-group-van",
    "仁川空港団体移動｜マイクロバスチャーター",
    "仁川机场团体出行｜中巴包车",
    H2,
    {
      metaTitle: "인천공항 단체 이동 | 행사·학교·기업 프라이빗 밴·승합 차량",
      metaDescription:
        "인천공항 단체 출국·입국 이동. 의정부·노원·남양주 등 경기북부 대표단·유학 단체. 인원 분할·짐 적재·새벽 일정 상담.",
      keywords: ["인천공항 단체 이동", "단체 공항 셔틀", "단체 인천 픽업", "학교 공항 이동", "기업 인천 공항"],
      linkTitle: "인천공항 단체 이동",
      h1: "인천공항 단체·그룹 이동 프라이빗 밴",
      lede:
        "인원 수에 따라 미니밴 분할·승합 연계를 상담합니다. 새벽 출국·짐이 많은 유학단체는 출발 시각과 하차 순서를 미리 짭니다.",
      vehicleRecommendBlurb: "정원 초과 방지를 위해 좌석벨트 기준 인원을 확정하고, 짐차 분리가 필요하면 2대 편성도 검토합니다.",
      travelTraitsLine: "경기북부 전역에서 인천으로 모일 때 지역별 픽업 분산 vs 한 곳 집결을 비교합니다.",
      sections: sec(
        [
          "대표자 연락처·편명·단체 명단 형태를 받아 동선을 고정합니다.",
          "출국 시 터미널 앞 하차 순서, 입국 시 수하물 벨트 후 집결 장소를 나눕니다.",
          "학교·기업·행사 주최 측과 요금·대기 시간을 사전에 합의합니다.",
        ],
        [
          "Headcount-first safety—no overloaded vans.",
          "Northern Gyeonggi dispersed pickups vs single rally points.",
          "Dawn flight batches coordinated as a group timeline.",
        ],
      ).ko,
      faq: [
        { q: "몇 명부터 단체로 보나요?", a: "차종과 좌석 배치에 따라 다릅니다. 명단을 주시면 나눕니다." },
        { q: "의정부·구리에서 각각 픽업?", a: "동선이 길어질 수 있어 일정을 함께 조정합니다." },
        { q: "짐이 많은 스키·골프 단체?", a: "적재별로 차량 타입을 나눕니다." },
      ],
      primaryCtaLabel: "단체 일정·명단 보내기",
      localBusinessDescription: "인천공항 단체 출국·입국 및 경기북부 대표단 이동 프라이빗 밴.",
      areaServedNames: ["Incheon International Airport", "Seoul Metropolitan Area", "Gyeonggi-do", "South Korea"],
    },
    {
      metaTitle: "Incheon Airport Group Transfer | Charter Van Fleet",
      metaDescription:
        "Group-sized private vans for ICN arrivals and departures—split vehicles when headcounts exceed safe belts, popular with schools and corporate teams.",
      keywords: ["group transfer ICN", "charter van Incheon", "school airport shuttle Korea"],
      linkTitle: "Group transfer ICN",
      h1: "Group Transfers via Incheon Airport",
      lede:
        "Fleet mindset: multiple vans when one isn’t safe—especially with northern Gyeonggi dispersed pickups.",
      vehicleRecommendBlurb: "Belts-first culture—no cramming.",
      travelTraitsLine: "Event planners love staged drop-off orders at terminals.",
      sections: sec(
        [
          "Manifest handling for organizers.",
          "Immigration-delay contingencies for inbound groups.",
          "Sports gear clusters quoted separately.",
        ],
        [
          "SEO complement to foreigner and family pages.",
          "English contacts for international delegations.",
          "Works with golf-bag volumes when disclosed.",
        ],
      ).en,
      faq: [
        { q: "Minimum group size?", a: "We split vehicles by legal seating—not marketing tiers." },
        { q: "Split pickups Uijeongbu/Guri?", a: "Yes—timeline coordination required." },
        { q: "Golf team?", a: "Cargo planning may require two vans." },
      ],
      primaryCtaLabel: "Book group ICN run",
      localBusinessDescription: "Group charter transfers centered on Incheon Airport.",
    },
  ),
];
