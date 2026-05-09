/**
 * 지역·출발지 → 인천/김포 공항 방향 랜딩 (한국인 검색·출국 동선)
 * 이미지는 기존 차량 히어로만 재사용 (텍스트·FAQ·내부링크 SEO 우선)
 */
import { H1, H2, H3, buildPage, sec } from "./airport-landing-builders";
import type { LandingPage } from "./landing-pages";

export const TO_AIRPORT_LANDINGS: LandingPage[] = [
  buildPage(
    "gangnam-to-incheon-airport",
    "江南から仁川空港へ｜出国送迎バン",
    "江南至仁川机场｜出国包车送机",
    H1,
    {
      metaTitle: "강남 인천공항 샌딩 | 테헤란로·역삼 출발 출국 프라이빗 밴",
      metaDescription:
        "강남·테헤란로·역삼에서 인천공항(ICN)까지 프라이빗 밴 샌딩. 출근 후 출국·회의 일정 맞춤 픽업. 체크인 시간 역산 안내.",
      keywords: ["강남 인천공항", "강남 공항 샌딩", "테헤란로 인천공항", "출국 픽업 강남", "강남 콜밴 공항"],
      linkTitle: "강남 → 인천공항",
      h1: "강남·테헤란로에서 인천공항까지 출국 샌딩",
      lede:
        "업무 일정 후 바로 출국하거나, 호텔·오피스에서 짐을 싣고 인천공항 출국장까지 연결합니다. 항공편 체크인 마감에 맞춰 출발 시간을 제안합니다.",
      vehicleRecommendBlurb: "직장인 출출국 동선에는 미니밴 이상으로 좌석·트렁크 여유를 두고 배정합니다.",
      travelTraitsLine: "평일 러시아워에는 강남 혼잡이 길어질 수 있어 공항 도착 버퍼를 넉넉히 잡습니다.",
      sections: sec(
        [
          "역삼·삼성·청담 등 상세 주소와 출발 가능 시각을 받습니다. 출근 후 출국 시 회의 종료 시각을 함께 알려 주세요.",
          "공항고속도로·경부축 혼잡을 고려해 테헤란로·영동대로 진입 루트를 선택합니다.",
          "출장 후 출국, 호텔 체크아웃 후 공항 이동을 한 번에 처리하고 싶은 분께 적합합니다.",
        ],
        [
          "Share building lobby rules around Teheran-ro blocks—we align curb pickup reality.",
          "Routing trades off Gangnam interior traffic versus highway entry ramps.",
          "Built for business travelers who want predictable ICN arrival after meetings.",
        ],
      ).ko,
      faq: [
        { q: "회의 몇 시에 끝나도 되나요?", a: "종료 예상 시각과 편명을 알려 주시면 출발 역산을 도와드립니다." },
        { q: "코엑스·삼성역 근처 픽업 가능?", a: "주소·출입구 기준으로 가능 여부를 안내합니다." },
        { q: "인천 말고 김포 출국은?", a: "별도 편명 기준으로 동선을 잡아 드립니다." },
      ],
      primaryCtaLabel: "강남 출발 출국 예약",
      localBusinessDescription: "강남 업무지구에서 인천공항 출국까지 연결하는 프라이빗 밴 샌딩.",
      areaServedNames: ["Gangnam", "Teheran-ro", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Gangnam to Incheon Airport | Private Van Drop-off & Pickup Timing",
      metaDescription:
        "Private van from Gangnam and Teheran-ro to Incheon Airport (ICN)—flight-aware pickup windows for Korean travelers heading outbound.",
      keywords: ["Gangnam to ICN", "Seoul airport drop-off", "private van Incheon", "Korea outbound transfer"],
      linkTitle: "Gangnam → Incheon Airport",
      h1: "Private Van from Gangnam to Incheon Airport",
      lede:
        "Door-to-door service from Gangnam offices and hotels to ICN departures—timing tuned to your check-in cutoff.",
      vehicleRecommendBlurb: "Minivans prioritized when rolling luggage follows a full workday.",
      travelTraitsLine: "Weekday peaks around Gangnam may require earlier departure—buffers discussed upfront.",
      sections: sec(
        [
          "픽업 주소와 비행 체크인 마감을 함께 받습니다.",
          "테헤란로 러시아워를 고려한 출발 시각을 제안합니다.",
          "출장 후 출국 고객에게 적합합니다.",
        ],
        [
          "Office-hotel pickups around Gangnam business towers.",
          "Highway-first routing toward ICN when traffic allows.",
          "Great for outbound travelers avoiding late-night trains with bags.",
        ],
      ).en,
      faq: [
        { q: "Can you align with my meeting end time?", a: "Yes—share ETA from your calendar plus flight details." },
        { q: "COEX / Samsung pickup?", a: "Possible—pin the lobby or curb rule." },
        { q: "GMP instead of ICN?", a: "Tell us the airport code when booking." },
      ],
      primaryCtaLabel: "Book Gangnam → ICN",
      localBusinessDescription: "Private van drop-offs from Gangnam to Incheon International Airport.",
    },
  ),
  buildPage(
    "jamsil-to-incheon-airport",
    "蚕室から仁川空港へ｜家族出国送迎",
    "蚕室至仁川机场｜家庭送机包车",
    H2,
    {
      metaTitle: "잠실 인천공항 샌딩 | 송파·석촌 출발 가족 출국 콜밴",
      metaDescription:
        "잠실·송파·석촌에서 인천공항까지 프라이빗 밴. 유모차·대형 캐리어 동반 가족 출국에 맞춘 픽업. 롯데월드·호텔 동선 반영.",
      keywords: ["잠실 인천공항", "송파 공항 샌딩", "석촌 인천", "가족 공항 이동 잠실", "잠실 콜밴 출국"],
      linkTitle: "잠실 → 인천공항",
      h1: "잠실·송파에서 인천공항까지 가족 출국 이동",
      lede:
        "테마파크·호텔 일정 후 귀국 비행까지 짐이 많은 가족을 우선 배려합니다. 유모차 접기·카시트 필요 여부를 예약 시 확인합니다.",
      vehicleRecommendBlurb: "유아 동반 시 카니발·스타리아급 미니밴으로 좌석 배치를 넉히 잡습니다.",
      travelTraitsLine: "주말 잠실·올림픽로 일대는 행사에 따라 지체될 수 있습니다.",
      sections: sec(
        [
          "석촌호수·잠실역·호텔 타워별 픽업 게이트를 안내합니다. 어린이 동반 시 승하차 시간을 여유 있게 잡습니다.",
          "송파·강동 방향에서 공항고속도로 진입 전 구간 혼잡을 고려합니다.",
          "귀국 전날 숙박 호텔에서 바로 공항으로 이동하는 가족에게 적합합니다.",
        ],
        [
          "Lobby-aware pickups near Jamsil hotels and stadium exits.",
          "Extra trunk planning for strollers and oversized suitcases.",
          "Ideal after Lotte World or family stays in Songpa.",
        ],
      ).ko,
      faq: [
        { q: "유모차 분해 필요할까요?", a: "차종에 따라 다릅니다. 사전에 알려 주시면 적합한 차량을 배정합니다." },
        { q: "새벽 출국도 되나요?", a: "네. 비행 시간을 알려 주세요." },
        { q: "롯데호텔 정문 픽업?", a: "건물 출입 규정에 맞는 지점으로 안내합니다." },
      ],
      primaryCtaLabel: "잠실 출발 출국 예약",
      localBusinessDescription: "잠실·송파 권역에서 인천공항 출국까지 가족 단위 프라이빗 밴 샌딩.",
      areaServedNames: ["Jamsil", "Songpa", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Jamsil to Incheon Airport | Family-Friendly Van Drop-off",
      metaDescription:
        "Private van from Jamsil and Songpa to ICN—focused on family luggage, strollers, and hotel pickups before outbound flights.",
      keywords: ["Jamsil to ICN", "Songpa airport transfer", "family van Seoul airport"],
      linkTitle: "Jamsil → Incheon Airport",
      h1: "Jamsil & Songpa to Incheon Airport",
      lede:
        "Comfort-focused rides for families leaving Seoul—great after theme parks or hotel stays around Seokchon.",
      vehicleRecommendBlurb: "Minivans when strollers and multiple suitcases are involved.",
      travelTraitsLine: "Weekend congestion near Sports Complex may shift pickup timing.",
      sections: sec(
        [
          "Hotel tower and lobby rules respected for pickups.",
          "Highway routing toward ICN with family luggage in mind.",
          "Suited for outbound trips after Lotte World itineraries.",
        ],
        [
          "Pin-level pickup near Jamsil station exits when allowed.",
          "Trunk planning for folded strollers.",
          "Designed for Korean travelers avoiding subway stairs with kids.",
        ],
      ).en,
      faq: [
        { q: "Car seats?", a: "Request in advance—we’ll match vehicle class." },
        { q: "Dawn flights?", a: "Yes—share departure time." },
        { q: "Hotel pickup?", a: "Provide tower/wing details." },
      ],
      primaryCtaLabel: "Book Jamsil → ICN",
      localBusinessDescription: "Family-oriented van drop-offs from Jamsil to Incheon Airport.",
    },
  ),
  buildPage(
    "pangyo-to-incheon-airport",
    "판교から仁川空港へ｜出張出国セダン",
    "板桥至仁川机场｜出差送机包车",
    H2,
    {
      metaTitle: "판교 인천공항 샌딩 | 분당·테크노밸리 출발 장거리 출국 밴",
      metaDescription:
        "판교·분당·테크노밸리에서 인천공항까지 장거리 프라이빗 밴. 출장 일정 종료 후 출국 동선, 장비·짐 동반 상담.",
      keywords: ["판교 인천공항", "분당 공항 샌딩", "판교 출국 콜밴", "테크노밸리 인천", "경기 출국 밴"],
      linkTitle: "판교 → 인천공항",
      h1: "판교·테크노밸리에서 인천공항까지 장거리 출국 샌딩",
      lede:
        "분당·판교 캠퍼스에서 회의·실증 일정을 마친 뒤 인천공항 출국편까지 연결합니다. 장거리 고속 구간 위주로 시간을 산출합니다.",
      vehicleRecommendBlurb: "샘플·장비 박스 동반 시 적재 높이가 있는 미니밴·대형밴을 검토합니다.",
      travelTraitsLine: "경부·영동축 교통량에 따라 소요 시간 편차가 큽니다.",
      sections: sec(
        [
          "사업장 주소·출발 가능 시각·항공편 정보를 받아 픽업 창을 제안합니다.",
          "판교에서 공항까지 고속 위주 동선으로 안내하며 휴게·유류 조건을 설명합니다.",
          "수도권 남동부 출장 후 출국이 잦은 기업 고객에게 적합합니다.",
        ],
        [
          "Campus pins inside Pangyo—manifest-friendly pickups.",
          "Long-haul highway pacing toward ICN.",
          "Ideal after tech-campus meetings when flights depart same evening.",
        ],
      ).ko,
      faq: [
        { q: "판교에서 인천까지 얼마나 걸리나요?", a: "교통에 따라 상이하며 예약 시 참고 구간을 안내합니다." },
        { q: "야간 출국 편도 가능?", a: "스케줄만 알려 주시면 조정합니다." },
        { q: "회사 여러 명 동시 배차?", a: "인원에 따라 대형 밴 분할을 상담합니다." },
      ],
      primaryCtaLabel: "판교 출발 출국 예약",
      localBusinessDescription: "판교 테크노밸리에서 인천공항 출국까지 장거리 프라이빗 밴 샌딩.",
      areaServedNames: ["Pangyo", "Bundang", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Pangyo to Incheon Airport | Long-Distance Corporate Drop-off",
      metaDescription:
        "Private van from Pangyo and Bundang to ICN—built for business travelers finishing campus visits before outbound flights.",
      keywords: ["Pangyo to ICN", "Bundang airport van", "tech campus transfer Korea"],
      linkTitle: "Pangyo → Incheon Airport",
      h1: "Pangyo Tech Valley to Incheon Airport",
      lede:
        "Highway-weighted routing from Pangyo campuses to ICN departures—ideal after full-day meetings.",
      vehicleRecommendBlurb: "Cargo-height vans when booth kits travel with you.",
      travelTraitsLine: "Big swings in ETA during peak highway hours.",
      sections: sec(
        [
          "Corporate manifests and campus pins welcomed.",
          "Long-distance ICN routing from southern Gyeonggi.",
          "Suited for outbound legs same night as site visits.",
        ],
        [
          "Timing buffers for Gyeonggi expressway variability.",
          "English schedules accepted for pickup planning.",
          "Better than trains with heavy equipment cases.",
        ],
      ).en,
      faq: [
        { q: "How long is the drive?", a: "Traffic-dependent—we quote realistic buffers." },
        { q: "Late-night flights?", a: "Yes—coordinate pickup windows." },
        { q: "Multiple passengers?", a: "We can split vans by headcount." },
      ],
      primaryCtaLabel: "Book Pangyo → ICN",
      localBusinessDescription: "Long-distance private transfers from Pangyo to Incheon Airport.",
    },
  ),
  buildPage(
    "suwon-to-incheon-airport",
    "水原から仁川空港へ｜首都圏南部出国送迎",
    "水原至仁川机场｜首都圈南部送机",
    H2,
    {
      metaTitle: "수원 인천공항 샌딩 | 영통·광교 출발 경기 남부 출국 밴",
      metaDescription:
        "수원·영통·광교에서 인천공항까지 프라이빗 밴. 경기 남부 장거리 출국 동선, 통행료·휴게 포함 상담.",
      keywords: ["수원 인천공항", "영통 공항 샌딩", "광교 인천공항", "경기 출국 콜밴", "수원 공항 픽업"],
      linkTitle: "수원 → 인천공항",
      h1: "수원·영통·광교에서 인천공항까지 경기 남부 출국 샌딩",
      lede:
        "경기 남부 주거·업무 지역에서 인천공항 출국까지 장거리 구간을 정찰제로 안내합니다. 고속도로 구간이 길어 도착 버퍼를 넉넉히 제안합니다.",
      vehicleRecommendBlurb: "대형 캐리어 다수 시 미니밴 이상을 권장합니다.",
      travelTraitsLine: "안개·사고 등 고속 상황에 따라 시간 차이가 큽니다.",
      sections: sec(
        [
          "수원 시내·영통·광교 등 세부 주소 기준으로 픽업 시간을 잡습니다.",
          "서해안·경부축 중 상황에 맞는 고속 루트를 선택합니다.",
          "수도권 외곽 거주자의 장거리 출국 이동에 적합합니다.",
        ],
        [
          "Pin-accurate pickups across Suwon hubs.",
          "Highway-first planning with toll-inclusive quotes.",
          "Ideal for southern Gyeonggi travelers avoiding rail transfers with bags.",
        ],
      ).ko,
      faq: [
        { q: "수원에서 인천까지 최소 몇 시간 전 출발?", a: "편명·요일에 따라 다릅니다. 예약 시 함께 산출합니다." },
        { q: "동탄 경유 가능?", a: "동선상 가능하면 협의합니다." },
        { q: "고속 통행료 포함?", a: "정찰제 안내 시 포함 기준을 설명드립니다." },
      ],
      primaryCtaLabel: "수원 출발 출국 예약",
      localBusinessDescription: "수원·경기 남부에서 인천공항 출국까지 연결하는 프라이빗 밴.",
      areaServedNames: ["Suwon", "Yeongtong", "Gwanggyo", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Suwon to Incheon Airport | Gyeonggi South Outbound Van",
      metaDescription:
        "Private van from Suwon, Yeongtong, and Gwanggyo to ICN—long-distance outbound routing with toll-aware quotes.",
      keywords: ["Suwon to ICN", "Gyeonggi airport transfer", "Yeongtong van"],
      linkTitle: "Suwon → Incheon Airport",
      h1: "Suwon to Incheon Airport Private Van",
      lede:
        "Door-to-door drops from southern Gyeonggi cities to ICN departures—buffers honest for highway variability.",
      vehicleRecommendBlurb: "Upsized vans when multiple large bags travel.",
      travelTraitsLine: "Weather and incidents on expressways can shift ETA sharply.",
      sections: sec(
        [
          "Pickup timing from Suwon-area pins.",
          "Expressway routing tuned for outbound flights.",
          "Built for travelers outside Seoul core.",
        ],
        [
          "Share flight numbers for conservative buffers.",
          "Toll-inclusive quoting explained upfront.",
          "Better than rail when hauling heavy suitcases.",
        ],
      ).en,
      faq: [
        { q: "How early to leave Suwon?", a: "We plan backwards from your airline cutoff." },
        { q: "Dongtan stop?", a: "Possible when routing allows." },
        { q: "Tolls included?", a: "Explained inside your fixed-rate quote basis." },
      ],
      primaryCtaLabel: "Book Suwon → ICN",
      localBusinessDescription: "Outbound van service from Suwon region to Incheon Airport.",
    },
  ),
  buildPage(
    "dongtan-to-incheon-airport",
    "東滩から仁川空港へ｜新都市出国送迎",
    "东滩至仁川机场｜新城送机",
    H2,
    {
      metaTitle: "동탄 인천공항 샌딩 | 신도시 출발 장거리 출국 프라이빗 밴",
      metaDescription:
        "동탄·화성 일대에서 인천공항까지 프라이빗 밴. 신도시 주거·직주근거 출국 동선, 가족 동반 장거리 이동 상담.",
      keywords: ["동탄 인천공항", "화성 공항 샌딩", "동탄 출국 콜밴", "신도시 인천공항"],
      linkTitle: "동탄 → 인천공항",
      h1: "동탄·화성에서 인천공항까지 신도시 출국 샌딩",
      lede:
        "동탄 신도시·인근 단지에서 인천공항 출국까지 장거리 이동을 정찰제로 안내합니다. 어린이집·학교 일정 후 출국 가족 동선도 조율합니다.",
      vehicleRecommendBlurb: "가족 단위·대형 캐리어 시 미니밴 이상 권장합니다.",
      travelTraitsLine: "서해안 고속 일대 교통에 따라 편차가 큽니다.",
      sections: sec(
        [
          "단지·동·상세 주소를 받아 차량 진입 가능 지점을 안내합니다.",
          "수원·안산 방향 연계 고속 루트를 비교합니다.",
          "신혼·영유아 가정의 장거리 출국 이동에 적합합니다.",
        ],
        [
          "Gated-community pickup guidance when addresses are precise.",
          "West-coast expressway variability factored into ETA.",
          "Designed for Dongtan residents avoiding rail transfers at rush hour.",
        ],
      ).ko,
      faq: [
        { q: "동탄역 픽업 가능?", a: "주변 도로 상황에 따라 가능 지점을 안내합니다." },
        { q: "새벽 출국?", a: "가능합니다." },
        { q: "수원 경유 요금?", a: "경유는 예약 시 동선에 포함해 상담합니다." },
      ],
      primaryCtaLabel: "동탄 출발 출국 예약",
      localBusinessDescription: "동탄·화성 일대에서 인천공항 출국까지 연결하는 프라이빗 밴 샌딩.",
      areaServedNames: ["Dongtan", "Hwaseong", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Dongtan to Incheon Airport | New Town Outbound Van",
      metaDescription:
        "Private van from Dongtan and Hwaseong to ICN—long-haul outbound routing for residents west of Seoul.",
      keywords: ["Dongtan to ICN", "Hwaseong airport van"],
      linkTitle: "Dongtan → Incheon Airport",
      h1: "Dongtan to Incheon Airport",
      lede:
        "Family-friendly highway routing from Dongtan new-town clusters to ICN departures.",
      vehicleRecommendBlurb: "Minivans when family luggage stacks up.",
      travelTraitsLine: "West-coast expressway delays possible—buffers advised.",
      sections: sec(
        [
          "Community-aware pickups around Dongtan complexes.",
          "Expressway planning toward ICN.",
          "Ideal for outbound flights after local routines.",
        ],
        [
          "Share tower/block notes for precise curb guidance.",
          "Toll-inclusive quotes explained.",
          "Better comfort on long hauls to ICN.",
        ],
      ).en,
      faq: [
        { q: "Station pickup?", a: "Depends on curb rules—we confirm pins." },
        { q: "Dawn departures?", a: "Yes." },
        { q: "Suwon detour?", a: "Quoted if routing requires it." },
      ],
      primaryCtaLabel: "Book Dongtan → ICN",
      localBusinessDescription: "Outbound transfers from Dongtan area to Incheon Airport.",
    },
  ),
  buildPage(
    "uijeongbu-to-incheon-airport",
    "議政府から仁川空港へ｜北部出国送迎",
    "议政府至仁川机场｜北部送机",
    H2,
    {
      metaTitle: "의정부 인천공항 샌딩 | 포천·동두천 방향 북부 출국 콜밴",
      metaDescription:
        "의정부·포천·동두천 일대에서 인천공항까지 프라이빗 밴. 경기 북부 장거리 출국, 군부대·관외 거주 동선 상담.",
      keywords: ["의정부 인천공항", "포천 공항 샌딩", "동두천 인천공항", "경기 북부 출국 밴"],
      linkTitle: "의정부 → 인천공항",
      h1: "의정부·경기 북부에서 인천공항까지 출국 샌딩",
      lede:
        "경기 북부에서 인천공항까지 내륙 구간이 길어 도착 시간 산출을 보수적으로 잡습니다. 의정부역·신도시 단지·외곽 주소까지 픽업 동선을 상담합니다.",
      vehicleRecommendBlurb: "장거리 운행 시 운전 시간·휴게 안내를 함께 드립니다.",
      travelTraitsLine: "북부 국도·고속 접속 구간 혼잡에 따라 편차가 있습니다.",
      sections: sec(
        [
          "의정부 중심가·신도시·외곽 읍면까지 주소 기준으로 픽업을 확정합니다.",
          "1순환·경춘축 등 북부 접근로 상황을 고려합니다.",
          "수도권 북쪽 거주자의 출국 동선에 적합합니다.",
        ],
        [
          "Northern Gyeonggi pickups with realistic ICN buffers.",
          "Routing trades off inland roads versus expressway entries.",
          "Built for travelers far from Gangnam-centric shuttle hubs.",
        ],
      ).ko,
      faq: [
        { q: "포천 출발도 가능?", a: "주소 알려 주시면 가능 여부와 시간을 상담합니다." },
        { q: "김포공항이 더 가까운데 인천만 가능?", a: "목적 공항을 알려 주시면 동선을 제안합니다." },
        { q: "새벽 출발?", a: "비행편 기준으로 조정합니다." },
      ],
      primaryCtaLabel: "의정부 출발 출국 예약",
      localBusinessDescription: "경기 북부에서 인천공항 출국까지 연결하는 프라이빗 밴 샌딩.",
      areaServedNames: ["Uijeongbu", "Pocheon", "Dongducheon", "Incheon International Airport", "South Korea"],
    },
    {
      metaTitle: "Uijeongbu to Incheon Airport | Northern Gyeonggi Outbound",
      metaDescription:
        "Private van from Uijeongbu and northern Gyeonggi to ICN—long inland legs planned with conservative buffers.",
      keywords: ["Uijeongbu to ICN", "northern Gyeonggi airport van"],
      linkTitle: "Uijeongbu → Incheon Airport",
      h1: "Uijeongbu to Incheon Airport",
      lede:
        "Outbound-focused routing for travelers starting north of Seoul—timing tuned for longer highway segments.",
      vehicleRecommendBlurb: "Comfort-oriented vans for long hauls.",
      travelTraitsLine: "Inland traffic variability requires honest ETAs.",
      sections: sec(
        [
          "Northern pickups with ICN buffers.",
          "Expressway entry strategy from Gyeonggi north.",
          "Ideal when ICN is chosen over GMP despite distance.",
        ],
        [
          "Share airline terminal preferences.",
          "Discuss GMP vs ICN when unsure.",
          "Late-night departures supported.",
        ],
      ).en,
      faq: [
        { q: "Pocheon pickup?", a: "Address-dependent—ask when booking." },
        { q: "GMP closer?", a: "Tell us ticket origin—we advise routing." },
        { q: "Dawn flights?", a: "Yes." },
      ],
      primaryCtaLabel: "Book Uijeongbu → ICN",
      localBusinessDescription: "Northern Gyeonggi to Incheon Airport outbound transfers.",
    },
  ),
  buildPage(
    "gimpo-airport-to-uijeongbu",
    "金浦空港から議政府へ｜北部アクセス送迎",
    "金浦机场至议政府｜北部接驳包车",
    H1,
    {
      metaTitle: "김포공항 의정부 이동 | 국내선·근거리 도착 후 북부 프라이빗 밴",
      metaDescription:
        "김포공항(GMP)에서 의정부·경기 북부까지 프라이빗 밴. 국내선 연결 후 거주지 이동, 짐·시간 맞춤 픽업.",
      keywords: ["김포공항 의정부", "GMP 의정부", "김포 픽업 의정부", "국내선 의정부 이동"],
      linkTitle: "김포공항 → 의정부",
      h1: "김포공항에서 의정부·경기 북부까지 프라이빗 밴",
      lede:
        "국내선 도착 후 의정부·동두천 방향 거주지까지 바로 연결합니다. 김포 도착 게이트와 수하물 상황을 알려 주시면 픽업 시간을 맞춥니다.",
      vehicleRecommendBlurb: "당일 도착 짐이 많으면 미니밴 이상을 권장합니다.",
      travelTraitsLine: "김포↔북부 구간은 시간대별 시내 병목이 달라집니다.",
      sections: sec(
        [
          "김포 국내선 도착 동선에 맞춰 미팅 지점을 안내합니다.",
          "강북·포천 방향 분기 전 교통을 고려해 의정부 접근로를 선택합니다.",
          "국내 출장 후 거주지 복귀 동선에 적합합니다.",
        ],
        [
          "Meet-and-greet aligned with GMP domestic arrivals.",
          "Routing north toward Uijeongbu clusters.",
          "Ideal after domestic hops when trains feel heavy with luggage.",
        ],
      ).ko,
      faq: [
        { q: "국제선 도착도 가능?", a: "동선은 비슷하나 도착 정보를 알려 주세요." },
        { q: "의정부 신도시까지?", a: "주소 기준으로 안내합니다." },
        { q: "연착 시?", a: "도착 시간 알림 후 픽업 재조정합니다." },
      ],
      primaryCtaLabel: "김포 도착 픽업 예약",
      localBusinessDescription: "김포공항에서 의정부 및 경기 북부로 연결하는 프라이빗 밴.",
      areaServedNames: ["Gimpo International Airport", "Uijeongbu", "South Korea"],
    },
    {
      metaTitle: "Gimpo Airport to Uijeongbu | Domestic Arrival Van",
      metaDescription:
        "Private van from Gimpo Airport (GMP) to Uijeongbu—great after domestic flights when you want door-to-door comfort north of Seoul.",
      keywords: ["GMP to Uijeongbu", "Gimpo domestic transfer", "northern Seoul van"],
      linkTitle: "Gimpo Airport → Uijeongbu",
      h1: "Gimpo Airport to Uijeongbu Private Van",
      lede:
        "Quick transition from GMP arrivals into northern Gyeonggi addresses—perfect when suitcases beat the subway.",
      vehicleRecommendBlurb: "Upsized vans when domestic hops leave you with heavy bags.",
      travelTraitsLine: "City-center delays vary by hour—we factor buffers.",
      sections: sec(
        [
          "Airside-aware pickup guidance at GMP.",
          "Routing northbound toward Uijeongbu districts.",
          "Suited for domestic connectors heading home.",
        ],
        [
          "Share arrival gates when possible.",
          "Better than transfers with oversized luggage.",
          "English bookings via WhatsApp.",
        ],
      ).en,
      faq: [
        { q: "International arrivals?", a: "Possible—share terminal details." },
        { q: "New town complexes?", a: "Provide exact pins." },
        { q: "Flight delayed?", a: "We reschedule pickup." },
      ],
      primaryCtaLabel: "Book GMP → Uijeongbu",
      localBusinessDescription: "Private transfers from Gimpo Airport toward Uijeongbu.",
    },
  ),
  buildPage(
    "dawn-airport-pickup",
    "早朝空港送迎｜深夜出国対応バン",
    "清晨机场接送｜深夜出国包车",
    H1,
    {
      metaTitle: "새벽 공항 픽업·샌딩 | 출국 시간 맞춤 심야 프라이빗 밴",
      metaDescription:
        "새벽·심야 출국 스케줄에 맞춘 프라이빗 밴. 인천·김포 출발 동선, 체크인 역산·픽업 시간 조정. 수도권 전역 상담.",
      keywords: ["새벽 공항 픽업", "심야 인천공항", "새벽 출국 밴", "야간 공항 콜밴", "출국 새벽 픽업"],
      linkTitle: "새벽 공항 픽업",
      h1: "새벽·심야 출국에 맞춘 공항 픽업·샌딩",
      lede:
        "첫 차 전 출발하는 항공편에 맞춰 집·호텔에서 미리 픽업합니다. 체크인 마감·보안 검색 시간을 고려해 출발 시각을 역산합니다.",
      vehicleRecommendBlurb: "야간 운행 시 운전 피로·안전 거리를 고려해 차량을 배정합니다.",
      travelTraitsLine: "심야에는 고속도로 차량이 적어도 피로 운전 방지를 위해 일정을 과밀하게 잡지 않습니다.",
      sections: sec(
        [
          "항공편명·예상 체크인 방식(모바일·카운터)을 받아 출발 역산을 돕습니다.",
          "새벽에는 시내 차량 감소와 공항 접근로 상황이 달라질 수 있습니다.",
          "장거리 출근 전 출국, 유학생 이른 비행 등 새벽 일정에 적합합니다.",
        ],
        [
          "Flight-number-driven pickup windows for ultra-early departures.",
          "Night-drive safety buffers—no unrealistic hero ETAs.",
          "Ideal when trains/buses don’t match your ICN/GMP timeline.",
        ],
      ).ko,
      faq: [
        { q: "몇 시 집에서 나와야 하나요?", a: "항공사·터미널 기준으로 다릅니다. 편명을 알려 주세요." },
        { q: "김포 새벽만 해당?", a: "인천·김포 모두 상담 가능합니다." },
        { q: "전날 미리 만나서 출발?", a: "일정에 따라 가능 여부를 조율합니다." },
      ],
      primaryCtaLabel: "새벽 출국 일정 상담",
      localBusinessDescription: "새벽·심야 출국 일정에 맞춘 수도권 공항 프라이빗 밴 픽업·샌딩.",
      areaServedNames: ["Seoul Metropolitan Area", "Incheon International Airport", "Gimpo International Airport", "South Korea"],
    },
    {
      metaTitle: "Dawn Airport Pickup Korea | Early ICN/GMP Private Van",
      metaDescription:
        "Early-morning private van pickups for outbound flights from Seoul—timing aligned to check-in cutoffs at ICN and GMP.",
      keywords: ["dawn airport pickup Korea", "early ICN transfer", "midnight van Seoul airport"],
      linkTitle: "Dawn airport pickup",
      h1: "Dawn & Late-Night Airport Pickup Planning",
      lede:
        "Built for travelers whose flights leave before transit is practical—we schedule realistic pickup windows.",
      vehicleRecommendBlurb: "Night-drive vans assigned with safety-first spacing.",
      travelTraitsLine: "We avoid over-tight ETAs on tired-driver routes.",
      sections: sec(
        [
          "Share flight numbers—we reverse-plan from check-in needs.",
          "ICN and GMP both supported.",
          "Great when public transit doesn’t align.",
        ],
        [
          "Honest buffers for security lines.",
          "Focus on sleep-deprived travelers needing reliability.",
          "WhatsApp-friendly booking.",
        ],
      ).en,
      faq: [
        { q: "How early can you pick up?", a: "As early as your itinerary requires—within safety norms." },
        { q: "GMP only?", a: "ICN supported too—specify airport." },
        { q: "International vs domestic?", a: "Tell us carrier and terminal." },
      ],
      primaryCtaLabel: "Plan a dawn run",
      localBusinessDescription: "Early-hour private van coordination for Korean outbound travelers.",
    },
  ),
  buildPage(
    "family-airport-transfer",
    "家族空港移動｜子連れ・大型行李バン",
    "家庭机场出行｜亲子与大件行李包车",
    H2,
    {
      metaTitle: "가족 공항 이동 프라이빗 밴 | 유아·대형 캐리어 동반 출국·입국",
      metaDescription:
        "유아·부모님 동반 가족의 인천·김포 공항 이동을 프라이빗 밴으로. 유모차·카시트·대형 캐리어 수납 상담. 수도권 전역.",
      keywords: ["가족 공항 이동", "유아 인천공항", "가족 공항 콜밴", "유모차 공항 픽업", "대형 캐리어 공항"],
      linkTitle: "가족 공항 이동",
      h1: "가족·유아 동반 공항 이동 프라이빗 밴",
      lede:
        "엘리베이터·에스컬레이터 환승 없이 집·호텔에서 공항까지 한 번에 이동합니다. 유모차 접이 크기·카시트 필요 여부를 예약 시 확인합니다.",
      vehicleRecommendBlurb: "가족 4인 이상·캐리어 다수 시 카니발·스타리아급 이상을 우선 검토합니다.",
      travelTraitsLine: "어린이 동승 시 안전을 위해 급한 일정은 지양하고 여유 있는 픽업을 권장합니다.",
      sections: sec(
        [
          "가족 구성·캐리어 개수·유모차 유무를 받아 좌석 배치를 제안합니다.",
          "공항 출국·입국 모두 동선 안내가 가능합니다.",
          "지하철 계단 대신 문 앞 픽업을 원하는 가족에게 적합합니다.",
        ],
        [
          "Stroller and seat-count planning upfront.",
          "Minivan-first mindset for multi-generation trips.",
          "Ideal when subway transfers aren’t realistic with kids and bags.",
        ],
      ).ko,
      faq: [
        { q: "카시트 있나요?", a: "사전 요청 시 가능 여부를 안내합니다." },
        { q: "입국 픽업도?", a: "도착 게이트 정보를 알려 주시면 상담합니다." },
        { q: "반려견 동반?", a: "가능 여부는 사전 협의입니다." },
      ],
      primaryCtaLabel: "가족 일정 상담하기",
      localBusinessDescription: "가족·유아 동반 고객을 위한 수도권 공항 프라이빗 밴 이동.",
      areaServedNames: ["Seoul Metropolitan Area", "Incheon International Airport", "Gimpo International Airport", "South Korea"],
    },
    {
      metaTitle: "Family Airport Transfer Korea | Minivan with Luggage Space",
      metaDescription:
        "Private van airport transfers for families—strollers, car seats, and heavy suitcases handled with spacious vehicles.",
      keywords: ["family airport transfer Seoul", "minivan ICN kids", "stroller airport Korea"],
      linkTitle: "Family airport transfer",
      h1: "Family Airport Transfers with Room for Everyone",
      lede:
        "Door-to-door comfort when traveling with kids and elders—skip stressful subway staircases.",
      vehicleRecommendBlurb: "High-roof minibuses when gear volume demands it.",
      travelTraitsLine: "We avoid reckless schedules with young passengers aboard.",
      sections: sec(
        [
          "Seat plans based on headcount and luggage.",
          "Arrival and departure legs supported.",
          "Designed for Korean households using private vans for ICN/GMP.",
        ],
        [
          "Ask about car seats in advance.",
          "Meet options after arrival—share flight info.",
          "Pets discussed case-by-case.",
        ],
      ).en,
      faq: [
        { q: "Car seats available?", a: "Request early—we’ll confirm vehicle fit." },
        { q: "Arrival pickup?", a: "Yes with gate/terminal details." },
        { q: "Pets?", a: "Ask during booking." },
      ],
      primaryCtaLabel: "Book family transfer",
      localBusinessDescription: "Family-focused private van transfers for Seoul-area airports.",
    },
  ),
  buildPage(
    "golf-bag-airport-transfer",
    "ゴルフバッグ空港移送｜大型荷物対応バン",
    "高尔夫球包机场运送｜大件行李包车",
    H3,
    {
      metaTitle: "골프백 공항 이동 프라이빗 밴 | 인천·김포 골프백·하드케이스 전용 적재",
      metaDescription:
        "골프백·하드케이스 동반 인천·김포 공항 이동을 프라이빗 밴으로. 적재 높이·미니밴 이상 배차 상담. 라운딩 후 출국 동선.",
      keywords: ["골프백 공항", "골프 인천공항", "골프백 콜밴", "골프 하드케이스 공항", "골프장 공항 이동"],
      linkTitle: "골프백 공항 이동",
      h1: "골프백·대형 수하물 동반 공항 이동",
      lede:
        "골프 여행 후 바로 공항으로 이동하거나, 입국 시 골프백을 함께 실어 나르는 동선을 상담합니다. 하드케이스 길이에 맞춰 트렁크 높이를 확보합니다.",
      vehicleRecommendBlurb: "스포츠 박스 2개 이상 시 대형 트렁크 차종으로 우선 배정합니다.",
      travelTraitsLine: "일반 세단 택시에 실리기 어려운 길이일수록 사전 고지가 중요합니다.",
      sections: sec(
        [
          "골프백 개수·하드케이스 여부를 받아 적재 계획을 세웁니다.",
          "라운딩 종료 후 인천 출국까지 연결 일정을 조율합니다.",
          "골프장→공항 직행 외에 숙소 경유도 상담 가능합니다.",
        ],
        [
          "Club bags measured against trunk height constraints.",
          "Post-round routes to ICN/GMP when timing is tight.",
          "Ideal when taxi trunks won’t close safely.",
        ],
      ).ko,
      faq: [
        { q: "하드케이스 2개 가능?", a: "차종과 적재 방식에 따라 다릅니다. 사진·치수를 알려 주세요." },
        { q: "골프장에서 바로 인천?", a: "일정과 거리에 따라 상담합니다." },
        { q: "입국 픽업 시 골프백?", a: "도착 정보와 짐 개수를 알려 주세요." },
      ],
      primaryCtaLabel: "골프백 동반 일정 상담",
      localBusinessDescription: "골프백·대형 스포츠 수하물 동반 공항 이동 전문 프라이빗 밴.",
      areaServedNames: ["Incheon International Airport", "Gimpo International Airport", "South Korea"],
    },
    {
      metaTitle: "Golf Bag Airport Transfer Korea | Tall-Trunk Private Van",
      metaDescription:
        "Private van transfers for golfers—hard cases and long bags to ICN/GMP with vehicles chosen for trunk height.",
      keywords: ["golf bag airport Korea", "ICN golf clubs van", "hard case airport transfer"],
      linkTitle: "Golf bag airport transfer",
      h1: "Golf Bags & Oversized Gear to the Airport",
      lede:
        "Protect clubs with vans that actually fit your cases—tell us dimensions before booking.",
      vehicleRecommendBlurb: "High-clearance cargo layouts when two hard cases travel.",
      travelTraitsLine: "Sedan taxis often fail here—measure first.",
      sections: sec(
        [
          "Dimension-aware loading plans.",
          "Post-round airport sprints when schedules are tight.",
          "Hotel detours possible when discussed.",
        ],
        [
          "Photo/dimension hints welcome.",
          "ICN/GMP both supported.",
          "Great after domestic golf trips across Korea.",
        ],
      ).en,
      faq: [
        { q: "Two hard cases?", a: "Depends on van class—share sizes." },
        { q: "From golf resort to ICN?", a: "Quote after pins and timing." },
        { q: "Arrival pickup with clubs?", a: "Share baggage details." },
      ],
      primaryCtaLabel: "Book golf-bag run",
      localBusinessDescription: "Golf club and oversized sports luggage transfers to Seoul-area airports.",
    },
  ),
];
