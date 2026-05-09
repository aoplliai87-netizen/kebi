/**
 * 랜딩별 운영 체크리스트·추천 상황(샘플) 자동 보강 — 데이터 파일에 비어 있을 때만 채움
 * 키워드 나열이 아니라 실제 배차·미팅 관점 문장 (locale별 분리, ja/zh는 en 기반)
 */
import type { LandingPageCopy } from "../../data/landing-pages";
import type { LandingPageSeoPlaceHints } from "../../data/destination-place-seo";
import { mergePlaceFaqForLocale } from "../../data/destination-place-seo";
import { classifyDestinationSlug, type DestinationBundleKey } from "@/lib/destination-slug-classify";
import { operationalScenariosFor, operationalTipsFor } from "@/lib/destination-operational-locale";
import type { LocaleKey } from "@/lib/site-settings-store";

export type OperationalTip = { label: string; body: string };
export type ScenarioExample = { title: string; body: string };

type Bundle = {
  tipsKo: OperationalTip[];
  tipsEn: OperationalTip[];
  scenariosKo: ScenarioExample[];
  scenariosEn: ScenarioExample[];
};

const PHOTO_NOTE_KO =
  "상단 이미지는 안내용입니다. 실제 배차는 예약 시 확인 가능한 차종·실내 사진 기준으로 안내드립니다.";
const PHOTO_NOTE_EN =
  "Hero imagery is illustrative; your booking confirms vehicle class and real interior/luggage fit.";

const DISCLAIMER_KO =
  "아래 상황은 예약 상담 시 자주 나오는 유형을 바탕으로 한 안내 예시이며, 실제 일정·차량·요금은 확정 전까지 다를 수 있습니다.";
const DISCLAIMER_EN =
  "These vignettes illustrate common booking patterns; timing, vehicle class, and fare are confirmed when you book.";
const DISCLAIMER_JA =
  "以下はよくあるご相談パターンの例です。実際の所要時間・車両クラス・料金はお見積り時に確定します。";
const DISCLAIMER_ZH =
  "以下为常见咨询场景示例；实际用时、车型与费用以确认订单时为准。";
const PHOTO_NOTE_JA =
  "写真はイメージです。実車・車内はご予約時にクラスと荷物適合を確認してご案内します。";
const PHOTO_NOTE_ZH =
  "配图仅供参考；预约时将确认车型等级与实际装载空间。";

const BUNDLES: Record<DestinationBundleKey, Bundle> = {
  toAirport: {
    tipsKo: [
      {
        label: "공항 도착 권장 시간",
        body: "국제선은 보통 체크인 마감 3시간 전 목표로 집 출발 시각을 잡습니다. 주말·연휴·새벽편은 보안 줄 변수가 커서 버퍼를 더 두는 편이 안전합니다.",
      },
      {
        label: "새벽 출발 시",
        body: "첫차 전 출발이면 전날 수면·짐 정리 시간까지 역산합니다. 단순히 ‘몇 시간 걸린다’보다 터미널·편명 기준으로 함께 맞춥니다.",
      },
      {
        label: "캐리어 적재",
        body: "대형 캐리어 개수와 높이를 숫자로 알려 주시면 트렁크 개폐 각도까지 고려해 차종을 제안합니다. 잠금·태그 상태도 적재 순서에 영향을 줍니다.",
      },
      {
        label: "골프백·길이 있는 짐",
        body: "하드케이스 길이·개수를 미리 알려 주시면 세단이 아닌 미니밴 이상으로 고정하는 경우가 많습니다. 라운드 직후 공항 일정은 건조·이동 시간까지 넣어 조율합니다.",
      },
      {
        label: "카시트·유아",
        body: "연령·체중과 좌석 배치를 받아 두면 승차 전 차량 교체를 줄일 수 있습니다. 유모차 접이 크기도 함께 적재 계획에 넣습니다.",
      },
      {
        label: "기사 미팅",
        body: "출발은 주소·건물 출입 기준으로 확정합니다. 공항 하차는 항공사·터미널을 알려 주시면 출국층 동선에 맞춰 안내합니다.",
      },
      {
        label: "톨게이트·장거리",
        body: "정찰제 안내 시 통행료 포함 기준을 설명드립니다. 경기 북부·동부처럼 고속 구간이 길면 편도 사고·공사 변수까지 여유를 두고 도착 목표를 잡습니다.",
      },
    ],
    tipsEn: [
      {
        label: "Target arrival at the terminal",
        body: "International flights usually back-plan from a ~3h buffer before check-in closes—plus extra padding on peak travel days.",
      },
      {
        label: "Pre–first-train departures",
        body: "When subways aren’t running yet, we align pickup time with packing sleep and bag readiness—not only highway ETA.",
      },
      {
        label: "Suitcase loading",
        body: "Share counts and dimensions early so we pick a van whose trunk actually closes safely—not a sedan guess.",
      },
      {
        label: "Golf bags / long cases",
        body: "Hard-case lengths often force a high-roof van; post-round airport runs include drying/changing time when needed.",
      },
      {
        label: "Car seats",
        body: "Age/weight helps pre-assign seating layouts and avoid last-minute vehicle swaps.",
      },
      {
        label: "Driver meet",
        body: "Pickup is pinned to your door rules; ICN drop-off references airline terminal and departure-level norms.",
      },
      {
        label: "Tolls & long hauls",
        body: "Quotes spell out toll-inclusive assumptions; northern/eastern Gyeonggi legs bake in realistic highway variability.",
      },
    ],
    scenariosKo: [
      {
        title: "강남 회의 후 당일 출국",
        body: "저녁 회의 종료 시각과 편명을 알려 주시면, 테헤란로 혼잡과 체크인 마감을 동시에 고려해 집·사무실 픽업 시각을 제안드린 상담 유형입니다.",
      },
      {
        title: "새벽 첫 비행 전 가족 이동",
        body: "유아 동반·캐리어 다수로 지하철 첫차가 불안한 경우, 도어 픽업부터 공항 하차까지 한 번에 맞춘 일정으로 조율했습니다.",
      },
      {
        title: "장거리·톨 포함 정찰제 확인",
        body: "출발지가 수도권 외곽일 때 통행료·유류 조건을 예약 단계에서 맞춰, 현장에서 설명이 어긋나지 않도록 했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "Post-meeting ICN departure",
        body: "We reconcile Gangnam traffic reality with airline cutoffs—common for business travelers finishing late meetings.",
      },
      {
        title: "Family dawn flight",
        body: "Door-to-door when strollers and bags make the first train risky—kids board once, bags stay controlled.",
      },
      {
        title: "Long-haul toll-inclusive quotes",
        body: "Northern routes priced with transparent toll assumptions so surprises stay off the curb.",
      },
    ],
  },
  fromAirport: {
    tipsKo: [
      {
        label: "입국 후 미팅",
        body: "도착 게이트·수하물 벨트 대기는 항공편·입국 심사 편차가 큽니다. 편명만으로 만남 시각을 고정하기보다 ‘벨트 이후 연락’ 흐름을 권장합니다.",
      },
      {
        label: "외국어 소통",
        body: "영문 일정 정리가 필요하면 WhatsApp 기준으로 터미널·호텔 주소를 함께 받습니다. 현장 변화는 메신저로 짧게 맞춥니다.",
      },
      {
        label: "심야 도착",
        body: "심야에는 공항 접근로 차량 밀도가 달라지고 졸음 관리가 중요합니다. 과도하게 빡빡한 후속 일정은 피하는 편이 안전합니다.",
      },
      {
        label: "대형 짐·골프",
        body: "입국 픽업도 트렁크 높이가 관건입니다. 벨트에서 나오는 순서·카트 사용 여부를 알려 주시면 적재 시간을 현실적으로 잡습니다.",
      },
      {
        label: "카시트",
        body: "장시간 비행 후 아이 상태를 고려해 차량 내 체류 시간을 최소화하려면 좌석 배치를 미리 고정합니다.",
      },
      {
        label: "단체·행사",
        body: "여러 대 열차처럼 도착하면 명단·수하물 순서를 나눠 승차합니다. 한 대에 무리하게 태우지 않는 것을 우선합니다.",
      },
      {
        label: "톨·거리",
        body: "호텔·실거주지까지 거리가 길면 통행료와 요금 구조를 예약 시점에 합의합니다.",
      },
    ],
    tipsEn: [
      {
        label: "After immigration meets",
        body: "Baggage belts and queues vary—we prefer belt-then-message flows over rigid clock times.",
      },
      {
        label: "English-first itineraries",
        body: "WhatsApp captures terminal + hotel pins so changes stay lightweight when flights drift.",
      },
      {
        label: "Late-night arrivals",
        body: "Night highway pacing favors rested drivers—avoid stacking fragile onward schedules.",
      },
      {
        label: "Oversized luggage",
        body: "Inbound clubs and trunks need height-aware vans; tell us belt timing when possible.",
      },
      {
        label: "Car seats",
        body: "Post-flight fatigue makes pre-planned seating swaps costly—lock layouts early.",
      },
      {
        label: "Groups",
        body: "Split vans before exceeding belts—manifest order beats one overstuffed vehicle.",
      },
      {
        label: "Tolls to Seoul/Gyeonggi",
        body: "Long post-arrival drives clarify toll-inclusive quotes during booking—not at the curb.",
      },
    ],
    scenariosKo: [
      {
        title: "인천 도착 후 강남 호텔",
        body: "수하물 대기가 길어져도 연락 타이밍만 맞추면 호텔 로비 기준 하차까지 한 번에 연결한 사례입니다.",
      },
      {
        title: "외국인 바이어 일행 픽업",
        body: "영문 미팅 문구·플라카드 필요 여부를 미리 받아 현장 혼선을 줄인 유형입니다.",
      },
      {
        title: "골프백 3개 입국 후 골프장 호텔",
        body: "적재 순서와 다음 날 일정을 함께 받아 트렁크 안전 여유를 우선했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "ICN to Gangnam hotel",
        body: "Belts ran long—WhatsApp timing kept the meet calm and hotel drop-offs precise.",
      },
      {
        title: "Buyer delegation pickup",
        body: "Placards + English summaries reduced curb chaos for inbound teams.",
      },
      {
        title: "Three golf bags inbound",
        body: "Height-first van choice before discussing next-day tee times.",
      },
    ],
  },
  north: {
    tipsKo: [
      {
        label: "장거리·북부 출발",
        body: "의정부·남양주·동두천 등에서는 공항까지 내륙 구간이 길어 ‘도착 시각’만 맞추기 어렵습니다. 체크인 마감을 기준으로 집 출발을 역산합니다.",
      },
      {
        label: "새벽·심야",
        body: "북부 도로는 시간대별로 병목 지점이 달라집니다. 졸음 운전 없이 일정을 잡기 위해 과밀 스케줄은 피합니다.",
      },
      {
        label: "캐리어·유모차",
        body: "단지 로터리·좁은 이면도로에서는 차량 회전 반경까지 확인 후 픽업 지점을 정합니다.",
      },
      {
        label: "골프백",
        body: "경기 동북부 라운드 후 공항까지 이어질 때는 라운드 종료 시각과 클럽 적재를 함께 받습니다.",
      },
      {
        label: "카시트",
        body: "장거리 이동에서 아이 동승 시간이 길어지므로 좌석 여유를 넉넉히 잡는 편이 좋습니다.",
      },
      {
        label: "미팅 방식",
        body: "주소·동·정문 기준으로 확정합니다. 여러 세대가 한 차에 탈 때는 승차 순서·짐 순서를 미리 나눕니다.",
      },
      {
        label: "톨게이트",
        body: "경기 북부에서 서해안 인근 공항으로 갈 때 고속 합류 구간이 길어 통행료 구조를 예약 시 설명드립니다.",
      },
    ],
    tipsEn: [
      {
        label: "Northern distance reality",
        body: "Uijeongbu/Namyangju/Dongducheon legs need conservative ICN buffers—home departure matters more than headline ETA.",
      },
      {
        label: "Night drives",
        body: "Northern arterials shift bottlenecks by hour—we avoid hero schedules that assume empty highways.",
      },
      {
        label: "Estates & strollers",
        body: "Rotaries and tight lanes force curb choices—pins beat generic station picks.",
      },
      {
        label: "Golf onward",
        body: "Post-round ICN pushes include club drying time when schedules are tight.",
      },
      {
        label: "Car seats",
        body: "Long rides favour spacious layouts—book ages early.",
      },
      {
        label: "Meet style",
        body: "Addresses include tower/block rules; multi-gen groups stage boarding order upfront.",
      },
      {
        label: "Tolls westbound",
        body: "Expressway merges toward ICN are priced transparently in quotes.",
      },
    ],
    scenariosKo: [
      {
        title: "노원 새벽 출국",
        body: "첫차 스케줄 대신 문 앞 픽업으로 체크인 마감을 맞춘 일정을 제안했습니다.",
      },
      {
        title: "남양주 신도시 가족 이동",
        body: "택지 로터리와 장거리 고속을 함께 고려해 도착 목표를 보수적으로 잡았습니다.",
      },
      {
        title: "의정부 경유 단체 분할",
        body: "정원을 넘기면 두 대로 나누고 출발 시각을 맞춰 공항에서 다시 합류하도록 조율했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "Nowon dawn outbound",
        body: "Skipped risky first-train math—door pickup aligned to cutoffs instead.",
      },
      {
        title: "Namyangju family haul",
        body: "New-town rotaries + long westbound drives forced honest buffers.",
      },
      {
        title: "Two-van group split",
        body: "Seat-belt safety beat cramming one van for Uijeongbu-origin delegates.",
      },
    ],
  },
  dawn: {
    tipsKo: [
      {
        label: "새벽 역산",
        body: "보안·셀프체크인 줄 길이를 가정해 집 출발을 앞당깁니다. ‘빨리 가면 되겠지’보다 편명·항공사 기준으로 맞춥니다.",
      },
      {
        label: "심야 운행",
        body: "야간에는 차량 밀도와 피로도가 낮아 보이지만 졸음·공사 구간은 여전히 변수입니다.",
      },
      {
        label: "짐·골프",
        body: "새벽에는 카트·엘리베이터 대기가 짧아 보여도 셀프 체크인 실패 시 시간이 증가합니다.",
      },
      {
        label: "카시트",
        body: "아이를 깨운 뒤 바로 승차할 수 있게 차량을 미리 대기시키는 방식을 권합니다.",
      },
      {
        label: "미팅",
        body: "건물 지하주차·정문 중 어디가 빠른지 주소 기준으로 안내합니다.",
      },
      {
        label: "외국어",
        body: "영문 편명이면 메신저에 그대로 남겨 두면 역산에 오해가 적습니다.",
      },
      {
        label: "톨",
        body: "새벽에도 통행료 구간은 동일합니다. 정찰제 설명에 포함 여부를 확인합니다.",
      },
    ],
    tipsEn: [
      {
        label: "Cutoff-first math",
        body: "We pad for security queues—not only driving minutes.",
      },
      {
        label: "Night pacing",
        body: "Sparse traffic doesn’t erase construction or fatigue risk.",
      },
      {
        label: "Bags & clubs",
        body: "Early mornings still blow up at bag-drop—plan buffers.",
      },
      {
        label: "Car seats",
        body: "Wake-and-board flows prefer staged vans ready at the curb.",
      },
      {
        label: "Meet points",
        body: "Lobby vs garage rules vary—pins matter.",
      },
      {
        label: "Language",
        body: "Paste flight codes as-is in WhatsApp to avoid transcription errors.",
      },
      {
        label: "Tolls",
        body: "Toll-inclusive quotes restate what’s bundled.",
      },
    ],
    scenariosKo: [
      {
        title: "4시 출발 편에 맞춘 픽업",
        body: "체크인 마감·터미널을 역산해 집 출발을 새벽 1시대로 제안한 상담입니다.",
      },
      {
        title: "회의 후 곧바로 공항",
        body: "저녁 일정과 새벽 편을 같은 날에 묶을 때 수면·이동 리스크를 솔직히 안내했습니다.",
      },
      {
        title: "골프백 + 대형 캐리어 동시",
        body: "새벽이라도 적재 높이 검증을 먼저 하고 차종을 고정했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "4am flight alignment",
        body: "Pickup aligned to security reality—not optimistic drive times.",
      },
      {
        title: "Meeting-to-red-eye",
        body: "Called out fatigue risk when stacking evening work before dawn departures.",
      },
      {
        title: "Clubs + suitcases",
        body: "Van class locked before discussing glam departure stories.",
      },
    ],
  },
  family: {
    tipsKo: [
      {
        label: "카시트·부스터",
        body: "연령·체중에 맞는 장착 방향을 예약 단계에서 확정합니다. 차량 교체는 아이 대기 시간을 늘립니다.",
      },
      {
        label: "유모차",
        body: "접이 두께·무게를 알려 주시면 적재 순서와 트렁크 레이아웃을 정합니다.",
      },
      {
        label: "공항 도착",
        body: "아이 동반 시 엘리베이터·엑스레이 대기를 고려해 공항 도착 목표를 앞당깁니다.",
      },
      {
        label: "대형 캐리어 다수",
        body: "가족 단위는 ‘인원’보다 ‘짐 부피’가 배차를 결정하는 경우가 많습니다.",
      },
      {
        label: "단체(가족 합류)",
        body: "친철 태우기·경유는 좌석벨트와 동선 길이를 기준으로 가능 여부를 나눕니다.",
      },
      {
        label: "미팅",
        body: "아파트 단지는 정문·지하 혼잡을 피해 시간대별 만남 장소를 조정합니다.",
      },
      {
        label: "심야·새벽",
        body: "아이 수면 리듬을 깨우는 순서를 최소화하려면 차량 대기 위치를 미리 고정합니다.",
      },
    ],
    tipsEn: [
      {
        label: "Car seats",
        body: "Age/weight locks seating plans—last-minute swaps hurt toddler wait times.",
      },
      {
        label: "Strollers",
        body: "Fold dimensions decide trunk stacking order.",
      },
      {
        label: "Airport timing",
        body: "Family security lanes deserve earlier terminal targets.",
      },
      {
        label: "Bag volume",
        body: "Headcount matters less than cubic meters of luggage.",
      },
      {
        label: "Extra relatives",
        body: "Detours only when belts and route time stay legal.",
      },
      {
        label: "Meetups",
        body: "Complex lobbies beat jammed gates when kids are sleepy.",
      },
      {
        label: "Night flights",
        body: "Staging vans curb-side reduces waking chaos.",
      },
    ],
    scenariosKo: [
      {
        title: "가족 5인·캐리어 5개",
        body: "미니밴 한 대 적재 한계를 숫자로 확인한 뒤 차종을 올린 상담입니다.",
      },
      {
        title: "유아 카시트 지창",
        body: "후방 좌석 배치를 미리 고정해 양육자 동승 동선을 짧게 가져갔습니다.",
      },
      {
        title: "입국 후 할머니까지 합류",
        body: "주소가 두 곳이면 경유 순서를 시간 순으로 나눠 과속 일정을 피했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "Five seats + five bags",
        body: "Validated trunk math before promising one van.",
      },
      {
        title: "Rear-facing seat plan",
        body: "Locked caregiver seating to shorten boarding drama.",
      },
      {
        title: "Two-home pickup",
        body: "Ordered stops by time—not ego—to keep elders comfortable.",
      },
    ],
  },
  golf: {
    tipsKo: [
      {
        label: "골프백 적재",
        body: "하드케이스 길이·개수를 사진·치수로 받으면 세단 배차 실패를 줄입니다.",
      },
      {
        label: "공항 도착",
        body: "라운드 직후 공항이면 샤워·건조 시간을 일정에 포함해야 합니다.",
      },
      {
        label: "단체 라운드",
        body: "백이 많을수록 차량 대수를 나누는 편이 안전합니다.",
      },
      {
        label: "톨·거리",
        body: "골프장 접근로가 길면 통행료와 회전 시간을 따로 설명합니다.",
      },
      {
        label: "심야·새벽",
        body: "이른 출국이면 클럽 적재 후 바로 이동할지 숙소 경유할지 먼저 정합니다.",
      },
      {
        label: "미팅",
        body: "클럽하우스 앞 vs 숙소 로비—어느 쪽이 빠른지 현장 규정을 확인합니다.",
      },
      {
        label: "외국어",
        body: "편명·터미널을 영문으로 고정해 두면 하차 안내가 빠릅니다.",
      },
    ],
    tipsEn: [
      {
        label: "Club loading",
        body: "Dimensions beat optimism—hard cases often kill sedan plans.",
      },
      {
        label: "Post-round ICN",
        body: "Showers/dry-time belong in the itinerary—not optimistic margins.",
      },
      {
        label: "Team trips",
        body: "Split vans before stacking six bags illegally.",
      },
      {
        label: "Tolls",
        body: "Remote courses add toll-heavy legs—priced upfront.",
      },
      {
        label: "Night flights",
        body: "Clubhouse vs hotel staging changes pickup clocks.",
      },
      {
        label: "Meet points",
        body: "Course gates vs lobby rules decide curb strategy.",
      },
      {
        label: "English slips",
        body: "Terminal codes pasted verbatim reduce drop-off confusion.",
      },
    ],
    scenariosKo: [
      {
        title: "골프백 4개·미니밴 2대",
        body: "적재 높이 한계로 분차했고 출발 시각을 맞춰 공항에서 재집결하도록 했습니다.",
      },
      {
        title: "라운드 후 인천 직행",
        body: "건조 시간을 줄이기 위해 물티슈·옷 갈아입기 시간을 일정에 넣었습니다.",
      },
      {
        title: "해외 대회 관람단",
        body: "영문 픽업 문구와 단체 명단을 받아 현장 혼선을 줄였습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "Four bags → two vans",
        body: "Height limits forced splits—meet again airside after check-in.",
      },
      {
        title: "Course to ICN tight",
        body: "Budgeted drying/changing—not fantasy tee-to-terminal sprints.",
      },
      {
        title: "Delegation golf trip",
        body: "English manifests kept curb meets orderly.",
      },
    ],
  },
  foreigner: {
    tipsKo: [
      {
        label: "언어·연락",
        body: "영문 일정은 WhatsApp 스레드 하나로 고정합니다. 전화보다 글로 남긴 편이 항공편 역산에 유리합니다.",
      },
      {
        label: "미팅",
        body: "입국장 플라카드·행사명 필요 여부를 미리 받습니다. 터미널별 만남 규정을 안내합니다.",
      },
      {
        label: "공항 도착",
        body: "입국 심사 변동이 크므로 ‘몇 시 정각 미팅’보다 벨트 이후 연락을 권합니다.",
      },
      {
        label: "심야",
        body: "시차·피로를 고려해 호텔까지 직행 동선을 단순하게 잡습니다.",
      },
      {
        label: "짐·골프",
        body: "해외에서 오는 긴 비행일수록 짐 분실 리스크를 상담 멘트에 포함합니다.",
      },
      {
        label: "단체",
        body: "바이어 일행은 좌석벨트 기준으로 차량을 나눕니다.",
      },
      {
        label: "톨",
        body: "호텔까지 장거리면 통행료 포함 여부를 예약 시 명확히 합니다.",
      },
    ],
    tipsEn: [
      {
        label: "Language",
        body: "WhatsApp threads beat phone ping-pong for flight codes.",
      },
      {
        label: "Meet & greet",
        body: "Placards and terminal policies confirmed before curb day.",
      },
      {
        label: "Immigration variability",
        body: "Belt-then-text beats fixed clocks after longhaul.",
      },
      {
        label: "Jet lag",
        body: "Hotel-direct routing respects fatigue—not sightseeing detours.",
      },
      {
        label: "Delayed bags",
        body: "Longhaul misroutes factor into realistic staging.",
      },
      {
        label: "Groups",
        body: "Belts dictate splits—luxury isn’t squeezing fourteen people.",
      },
      {
        label: "Tolls",
        body: "Capital-region toll inclusivity spelled in quotes.",
      },
    ],
    scenariosKo: [
      {
        title: "영문 일정만 있는 바이어",
        body: "편명·호텔 주소를 문자로 고정하고 현장 변경만 메신저로 맞췄습니다.",
      },
      {
        title: "VIP 플라카드 픽업",
        body: "행사 로고 유무를 미리 받아 현장 인지도를 높였습니다.",
      },
      {
        title: "연착 후 재스케줄",
        body: "도착 시간이 밀려도 벨트 이후 연락 규칙으로 대기 혼선을 줄였습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "English-only itinerary",
        body: "Pinned flight + hotel strings avoided telephone mistranscription.",
      },
      {
        title: "VIP placard",
        body: "Branding agreed upfront—no improvised sharpie chaos.",
      },
      {
        title: "Delayed arrival",
        body: "Belt-then-text rhythm absorbed immigration drift.",
      },
    ],
  },
  group: {
    tipsKo: [
      {
        label: "단체 배차",
        body: "좌석벨트 수를 먼저 세고, 초과 인원은 무조건 분차합니다.",
      },
      {
        label: "짐 차량",
        body: "짐만 많은 경우 짐차·승합 분리를 검토합니다.",
      },
      {
        label: "공항 도착",
        body: "단체는 하차 순서·수하물 카트 확보 시간을 따로 잡습니다.",
      },
      {
        label: "새벽·심야",
        body: "여러 대 동시 출발은 무전기·메신저 하나로 묶어 연락을 통일합니다.",
      },
      {
        label: "미팅",
        body: "대표 연락처 한 곳과 현장 인솔자 한 명을 고정합니다.",
      },
      {
        label: "외국어",
        body: "행사명·참가자 국적 분포를 알려 주시면 안내 문구를 나눕니다.",
      },
      {
        label: "톨",
        body: "다차량일 때 통행료 정산 방식을 예약 전 합의합니다.",
      },
    ],
    tipsEn: [
      {
        label: "Headcounts",
        body: "Belts first—overflow means another van, not squeezing.",
      },
      {
        label: "Bag trucks",
        body: "Gear-heavy tours sometimes split cargo vs people.",
      },
      {
        label: "Terminal ops",
        body: "Staging drop-off order prevents curb pile-ups.",
      },
      {
        label: "Night convoys",
        body: "One WhatsApp anchor thread for multi-van dawn departures.",
      },
      {
        label: "On-site lead",
        body: "Single marshal contact beats fifteen simultaneous calls.",
      },
      {
        label: "Languages",
        body: "Mixed delegations get bilingual snippets when needed.",
      },
      {
        label: "Tolls",
        body: "Fleet toll reconciliation clarified before wheels roll.",
      },
    ],
    scenariosKo: [
      {
        title: "학교 체험단 인천 출국",
        body: "인솔자 1명 기준으로 시간표를 고정하고 차량 두 대로 분승했습니다.",
      },
      {
        title: "기업 워크숍 후 단체 이동",
        body: "회사 주차장 넓이 제약으로 출발 순서를 차량별로 나눴습니다.",
      },
      {
        title: "기념품 박스 추가",
        body: "귀국 짐이 늘어난 경우 적재 재계산 후 야간 추가 차량을 편성했습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "School ICN departure",
        body: "Chaperone-led timeline—two vans rather than one overstuffed bus.",
      },
      {
        title: "Corporate yard constraints",
        body: "Staggered exits when campus gates can’t fit parallel boarding.",
      },
      {
        title: "Gift boxes inbound",
        body: "Reload math triggered a night extra van—planned before curbside panic.",
      },
    ],
  },
  heavy: {
    tipsKo: [
      {
        label: "캐리어 다수",
        body: "개수·치수를 숫자로 받아 적재 시뮬레이션을 먼저 합니다.",
      },
      {
        label: "골프 혼합",
        body: "캐리어와 골프백이 함께면 적재 순서가 바뀝니다.",
      },
      {
        label: "공항 도착",
        body: "짐이 많을수록 카트·엘리베이터 대기가 길어질 수 있어 도착 목표를 앞당깁니다.",
      },
      {
        label: "단체 짐",
        body: "여러 가구 짐이면 차량 대수를 나누는 것이 안전합니다.",
      },
      {
        label: "미팅",
        body: "엘리베이터 작은 단지는 지상 로터리에서 적재하는 편이 빠를 때가 있습니다.",
      },
      {
        label: "심야",
        body: "무거운 짐 상하차 시간을 일정에 명시적으로 넣습니다.",
      },
      {
        label: "톨",
        body: "장거리와 무게가 겹치면 요금 구조를 단순하게 유지하기 위해 경유를 제한합니다.",
      },
    ],
    tipsEn: [
      {
        label: "Volume truth",
        body: "Counts + dimensions before quoting—no sedan fantasies.",
      },
      {
        label: "Hybrid loads",
        body: "Clubs + suitcases change stacking order.",
      },
      {
        label: "Terminal time",
        body: "Heavy bags mean longer curb-to-counter walks—pad arrivals.",
      },
      {
        label: "Household moves",
        body: "Split vans before stacking to the roofline.",
      },
      {
        label: "Elevator meets",
        body: "Sometimes lobby beats basement loading when lifts are tiny.",
      },
      {
        label: "Night lifts",
        body: "Loading/unloading minutes become explicit line items.",
      },
      {
        label: "Tolls",
        body: "Fewer detours keep quotes understandable with heavy gear.",
      },
    ],
    scenariosKo: [
      {
        title: "유학생 가족 이삿짐 급",
        body: "박스 치수를 받아 미니밴 두 대로 분할 적재했습니다.",
      },
      {
        title: "29인치 4개 + 골프 2",
        body: "트렁크 높이 검증 후 대형 밴으로 고정했습니다.",
      },
      {
        title: "야간 조립 가구 포함",
        body: "상하차 인력·시간을 따로 잡아 운전 일정을 과밀하지 않았습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "Study-abroad family haul",
        body: "Box dimensions forced twin vans—not optimism.",
      },
      {
        title: "Four spinners + two clubs",
        body: "Height-aware van lock-in before quoting.",
      },
      {
        title: "Late-night bulky load",
        body: "Labor minutes explicitly scheduled—no silent overtime surprises.",
      },
    ],
  },
  balanced: {
    tipsKo: [
      {
        label: "일정 맞추기",
        body: "편명·주소·인원을 한 번에 받으면 역산이 빨라집니다.",
      },
      {
        label: "공항 도착",
        body: "국제선·국내선·항공사마다 체크인 창구 동선이 다릅니다.",
      },
      {
        label: "새벽·심야",
        body: "대중교통 공백 시간에는 문 앞 픽업이 종종 더 안정적입니다.",
      },
      {
        label: "짐",
        body: "큰 짐은 차종을 바꿉니다—숫자로 알려 주세요.",
      },
      {
        label: "카시트·단체",
        body: "좌석·벨트 기준을 먼저 확정합니다.",
      },
      {
        label: "미팅",
        body: "카카오·WhatsApp으로 위치를 고정하면 현장 혼선이 줄어듭니다.",
      },
      {
        label: "톨·거리",
        body: "정찰제 설명에 통행료 포함 여부를 분명히 드립니다.",
      },
    ],
    tipsEn: [
      {
        label: "One message bundle",
        body: "Flight + pins + headcounts together speed planning.",
      },
      {
        label: "Terminal variance",
        body: "Airlines change counter flows—share carriers.",
      },
      {
        label: "Transit gaps",
        body: "Early hours favor door pickups.",
      },
      {
        label: "Luggage",
        body: "Numbers drive vehicle class—not vibes.",
      },
      {
        label: "Seats & groups",
        body: "Belts before budgets.",
      },
      {
        label: "Messaging",
        body: "Kakao/WhatsApp pins reduce curb chaos.",
      },
      {
        label: "Tolls",
        body: "Quotes restate toll-inclusive assumptions clearly.",
      },
    ],
    scenariosKo: [
      {
        title: "처음 예약하는 고객",
        body: "주소와 편명만으로도 기본 역산을 도와드리고, 세부는 추가 메시지로 맞춘 상담입니다.",
      },
      {
        title: "일정 변경 두 차례",
        body: "항공편이 바뀔 때마다 픽업 시각만 조정하고 요금 구조는 예약 확정 시점으로 고정했습니다.",
      },
      {
        title: "임신·어르신 동승",
        body: "급한 일정보다 승하차 여유를 우선해 차량 내 대기 시간을 줄였습니다.",
      },
    ],
    scenariosEn: [
      {
        title: "First-time booker",
        body: "Flight + address unlocked baseline timing—details followed async.",
      },
      {
        title: "Two schedule shifts",
        body: "Pickup slid with ticket changes—pricing locked at confirmation.",
      },
      {
        title: "Elder / mobility care",
        body: "Prioritized gentle boarding over aggressive ETAs.",
      },
    ],
  },
};

function localizeTips(
  tipsKo: OperationalTip[],
  tipsEn: OperationalTip[],
  loc: LocaleKey,
  slug: string,
): OperationalTip[] {
  if (loc === "ko") return tipsKo;
  if (loc === "ja" || loc === "zh") {
    const key = classifyDestinationSlug(slug);
    return operationalTipsFor(key, loc);
  }
  return tipsEn;
}

function localizeScenarios(
  sk: ScenarioExample[],
  se: ScenarioExample[],
  loc: LocaleKey,
  slug: string,
): ScenarioExample[] {
  if (loc === "ko") return sk;
  if (loc === "ja" || loc === "zh") {
    const key = classifyDestinationSlug(slug);
    return operationalScenariosFor(key, loc);
  }
  return se.map((item, i) => ({
    title: item.title || sk[i]?.title || "",
    body: item.body || sk[i]?.body || "",
  }));
}

function disclaimer(loc: LocaleKey): string {
  if (loc === "ko") return DISCLAIMER_KO;
  if (loc === "ja") return DISCLAIMER_JA;
  if (loc === "zh") return DISCLAIMER_ZH;
  return DISCLAIMER_EN;
}

function photoNote(loc: LocaleKey): string | undefined {
  if (loc === "ko") return PHOTO_NOTE_KO;
  if (loc === "ja") return PHOTO_NOTE_JA;
  if (loc === "zh") return PHOTO_NOTE_ZH;
  return PHOTO_NOTE_EN;
}

export function enrichDestinationCopy(
  copy: LandingPageCopy,
  slug: string,
  locale: string,
  seoPlaceHints?: LandingPageSeoPlaceHints,
): LandingPageCopy {
  const loc = locale as LocaleKey;
  const key = classifyDestinationSlug(slug);
  const bundle = BUNDLES[key] ?? BUNDLES.balanced;

  const faqMerged = mergePlaceFaqForLocale(copy.faq, slug, locale, seoPlaceHints);

  const tips =
    copy.operationalTips && copy.operationalTips.length > 0
      ? copy.operationalTips
      : localizeTips(bundle.tipsKo, bundle.tipsEn, loc, slug);

  const scenarios =
    copy.scenarioExamples && copy.scenarioExamples.length > 0
      ? copy.scenarioExamples
      : localizeScenarios(bundle.scenariosKo, bundle.scenariosEn, loc, slug);

  return {
    ...copy,
    faq: faqMerged,
    operationalTips: tips,
    scenarioExamples: scenarios,
    scenarioDisclaimer: copy.scenarioDisclaimer ?? disclaimer(loc),
    trustPhotoNote: copy.trustPhotoNote ?? photoNote(loc),
  };
}
