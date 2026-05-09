/**
 * 목적지 랜딩용 안내 팁·이용 상황 자동 보강 — 데이터 파일에 비어 있을 때만 채움
 * SEO 키워드 나열이 아니라 예약 고객이 읽기 쉬운 문장 (locale별 분리, ja/zh는 en 기반)
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
  "아래 내용은 실제 예약 고객에게 자주 안내드리는 이동 패턴입니다. 실제 소요 시간, 차량, 요금은 예약 확정 시 최종 안내됩니다.";
const DISCLAIMER_EN =
  "These vignettes illustrate common booking patterns; timing, vehicle class, and fare are confirmed when you book.";
const DISCLAIMER_JA =
  "以下はお問い合わせの多い空港送迎パターンです。実際の所要時間・車両クラス・料金はご予約確定時にご案内します。";
const DISCLAIMER_ZH =
  "以下为常见机场接送场景；实际用时、车型与费用以确认订单时为准。";
const PHOTO_NOTE_JA =
  "写真はイメージです。実車・車内はご予約時にクラスと荷物適合を確認してご案内します。";
const PHOTO_NOTE_ZH =
  "配图仅供参考；预约时将确认车型等级与实际装载空间。";

const BUNDLES: Record<DestinationBundleKey, Bundle> = {
  toAirport: {
    tipsKo: [
      {
        label: "공항 도착 시간",
        body: "국제선은 보통 체크인 마감 약 3시간 전에 공항에 도착하는 편이 여유롭습니다. 주말·연휴·새벽편은 보안 검색 대기가 길어질 수 있어, 출발 시각을 조금 더 넉넉히 잡는 것을 권해 드립니다.",
      },
      {
        label: "새벽·첫차 이전 출발",
        body: "지하철 첫차보다 일찍 나가야 할 때는 숙소에서 나오는 시간과 짐 챙기는 시간까지 함께 고려해 주시면 좋습니다. 도로 시간만이 아니라 터미널과 편명에 맞춰 픽업 시각을 맞춰 드립니다.",
      },
      {
        label: "캐리어와 짐",
        body: "캐리어 개수와 대략적인 크기를 알려 주시면, 짐을 안전하게 실을 수 있는 차량을 함께 고를 수 있습니다. 잠금·이름표 상태도 알려 주시면 상하차 순서를 정할 때 도움이 됩니다.",
      },
      {
        label: "골프백·긴 짐",
        body: "하드 케이스 길이와 개수를 미리 알려 주시면 세단보다 높은 차량이 필요한지 바로 판단할 수 있습니다. 라운드 직후 공항으로 가실 때는 샤워·건조·이동 시간을 일정에 넉넉히 두시는 편이 좋습니다.",
      },
      {
        label: "카시트·아이 동반",
        body: "아이 연령·체중과 카시트 필요 여부를 알려 주시면 좌석 배치를 미리 맞춰 드립니다. 유모차 접었을 때 크기도 함께 알려 주시면 트렁크 안내가 수월합니다.",
      },
      {
        label: "픽업·하차 위치",
        body: "픽업은 상세 주소와 건물 출입 방식에 맞춰 안내드립니다. 공항 하차 시 항공사와 터미널을 알려 주시면 출국층 동선에 맞춰 모셔 드립니다.",
      },
      {
        label: "통행료·장거리",
        body: "요금 안내 시 통행료 포함 여부를 함께 말씀드립니다. 경기 북부·동부처럼 고속도로 구간이 길면, 도로 상황에 따른 여유를 두고 도착 목표를 잡는 것이 좋습니다.",
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
        body: "저녁 회의가 끝나는 시각과 편명을 알려 주시면, 강남권 이동과 체크인 마감을 함께 고려해 집·사무실 픽업 시각을 제안해 드립니다.",
      },
      {
        title: "새벽 첫 비행 전 가족 이동",
        body: "아이와 캐리어가 많아 첫차가 부담될 때는, 숙소에서 공항까지 문 앞에서 한 번에 이동하는 일정으로 맞추시는 경우가 많습니다.",
      },
      {
        title: "수도권 외곽에서 장거리 이동",
        body: "출발지가 멀 때는 통행료와 요금 조건을 예약 단계에서 함께 정리해 두면, 이동 당일 안내가 더 명확합니다.",
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
        label: "입국 후 만남",
        body: "게이트에서 나오는 시간과 수하물을 찾는 시간은 항공편·입국 심사에 따라 달라집니다. 정해진 시각보다는 수하물을 받으신 뒤 연락 주시는 방식이 여유롭고 정확합니다.",
      },
      {
        label: "영문 일정·연락",
        body: "영어로 일정을 정리해 주셔도 됩니다. WhatsApp 등으로 터미널과 호텔 주소를 남겨 주시면, 현장에서 바뀌는 부분만 짧게 맞추기 쉽습니다.",
      },
      {
        label: "심야 도착",
        body: "밤늦게 도착하실 때는 시차와 피로를 고려해 호텔까지 이동 일정을 단순하게 잡는 것을 권해 드립니다. 바로 이어지는 빡빡한 일정은 피하시는 편이 좋습니다.",
      },
      {
        label: "큰 짐·골프백",
        body: "입국 후 픽업에서도 골프백이나 큰 캐리어가 있으면 트렁크 높이와 여유 공간을 미리 맞추는 것이 좋습니다. 수하물을 찾는 순서나 카트 사용 여부를 알려 주시면 픽업 시각 안내에 도움이 됩니다.",
      },
      {
        label: "카시트",
        body: "장시간 비행 후에는 아이가 차 안에서 쉴 수 있도록 좌석 배치를 미리 정해 두면 승차가 한결 수월합니다.",
      },
      {
        label: "단체·행사",
        body: "인원이 많을 때는 명단과 짐 순서를 나눠 두 대 이상으로 나누어 탑승하는 경우가 많습니다. 안전과 승차 편의를 위해 정원을 넘기지 않는 것을 권해 드립니다.",
      },
      {
        label: "통행료·거리",
        body: "호텔이나 숙소까지 거리가 길 때는 통행료 포함 여부와 요금 구조를 예약 시 함께 확인해 두시면 좋습니다.",
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
        body: "수하물을 찾는 데 시간이 걸려도, 도착 후 연락만 맞추시면 호텔 로비까지 한 번에 모셔 드릴 수 있습니다.",
      },
      {
        title: "해외에서 오신 일행 픽업",
        body: "영문 안내 문구나 플라카드가 필요하시면 미리 말씀해 주시면, 만남 장소에서 더 수월하게 뵐 수 있습니다.",
      },
      {
        title: "골프백 여러 개·골프장 호텔",
        body: "골프백 개수와 다음 날 일정을 함께 알려 주시면, 트렁크에 여유를 두고 차량을 맞춰 드립니다.",
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
        label: "북부·장거리 출발",
        body: "의정부·남양주·동두천 등에서는 공항까지 육로가 길어집니다. 체크인 마감 시각을 기준으로 집에서 나오는 시간을 여유 있게 잡는 것이 좋습니다.",
      },
      {
        label: "새벽·밤 이동",
        body: "시간대에 따라 정체 구간이 달라질 수 있습니다. 운전 기사님도 안전하게 이동할 수 있도록 일정을 무리하지 않는 편을 권해 드립니다.",
      },
      {
        label: "캐리어·유모차",
        body: "아파트 단지 로터리나 좁은 도로에서는 차가 돌아설 공간까지 고려해 픽업 장소를 정하는 것이 좋습니다.",
      },
      {
        label: "골프 일정",
        body: "경기 동북부에서 라운드 후 공항으로 가실 때는 라운드 종료 시각과 골프백 적재를 함께 알려 주시면 일정 맞추기가 수월합니다.",
      },
      {
        label: "카시트",
        body: "이동 시간이 길어질수록 아이 좌석 여유를 넉넉히 두시는 편이 편안합니다.",
      },
      {
        label: "픽업 장소",
        body: "동·정문 등 상세 주소를 알려 주시면 그에 맞춰 뵙습니다. 여러 가족이 함께 타실 때는 승차 순서와 짐 순서를 미리 나누시면 좋습니다.",
      },
      {
        label: "통행료",
        body: "북부에서 공항 방향으로 갈 때 고속도로 구간이 길면 통행료가 요금 안내에 어떻게 반영되는지 예약 시 함께 말씀드립니다.",
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
        title: "노원에서 새벽 출국",
        body: "첫차에 맞추기 어려우면 숙소 앞 픽업으로 체크인 마감에 맞춰 나가시는 선택을 많이 하십니다.",
      },
      {
        title: "남양주 가족 이동",
        body: "단지 로터리와 장거리 고속 구간을 함께 고려해, 공항 도착 목표를 여유 있게 잡으시는 편이 좋습니다.",
      },
      {
        title: "의정부 출발 단체",
        body: "정원을 넘으면 차를 두 대로 나누고, 출발 시각을 맞춰 공항에서 다시 합류하는 방식으로 진행하실 수 있습니다.",
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
        label: "새벽 출발 시간",
        body: "보안 검색·체크인 대기를 감안해 집에서 나오는 시각을 앞당기는 편이 안전합니다. 편명과 항공사에 맞춰 픽업 시각을 함께 정리해 드립니다.",
      },
      {
        label: "밤·새벽 도로",
        body: "차가 적어 보여도 공사 구간이나 기사님 피로 관리는 여전히 고려할 부분입니다.",
      },
      {
        label: "짐·골프",
        body: "새벽이라도 수하물 맡기기나 키오스크에서 시간이 걸리면 일정이 밀릴 수 있어, 여유를 두시는 것이 좋습니다.",
      },
      {
        label: "카시트",
        body: "아이를 깨운 뒤 바로 탈 수 있도록 차량을 미리 대기시키는 방식을 많이 선택하십니다.",
      },
      {
        label: "픽업 장소",
        body: "지하주차장과 정문 중 이동이 수월한 쪽을 주소와 함께 알려 주시면 그에 맞춰 안내드립니다.",
      },
      {
        label: "편명 표기",
        body: "영문 편명은 메신저에 그대로 적어 주시면 번호를 잘못 읽는 일이 줄어듭니다.",
      },
      {
        label: "통행료",
        body: "새벽에도 통행료 구간은 동일합니다. 요금 안내에 통행료가 포함되는지 예약 시 확인해 주세요.",
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
        title: "이른 아침 편",
        body: "체크인 마감과 터미널을 기준으로 집에서 나오는 시각을 새벽으로 맞추실 때가 많습니다.",
      },
      {
        title: "회의 후 새벽 편",
        body: "저녁 일정 직후 새벽 비행은 수면과 이동 부담이 클 수 있어, 일정을 넉넉히 잡으시길 권해 드립니다.",
      },
      {
        title: "골프백과 큰 캐리어",
        body: "새벽이라도 짐 높이와 개수를 먼저 알려 주시면, 세단이 아닌 차량이 필요한지 바로 맞출 수 있습니다.",
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
        body: "아이 연령·체중에 맞는 카시트 방향을 예약 시 알려 주시면 좌석을 미리 맞춰 드립니다. 현장에서 차량을 바꾸면 아이가 기다리는 시간이 늘어날 수 있습니다.",
      },
      {
        label: "유모차",
        body: "접었을 때 두께와 무게를 알려 주시면 트렁크에 싣는 순서를 정하는 데 도움이 됩니다.",
      },
      {
        label: "공항 도착",
        body: "아이와 함께이면 엘리베이터·보안 검색 대기를 감안해 공항에 조금 일찍 도착하시는 편이 여유롭습니다.",
      },
      {
        label: "캐리어가 많을 때",
        body: "가족 여행에서는 인원수만큼이 아니라 짐 양에 따라 차량 크기가 달라지는 경우가 많습니다.",
      },
      {
        label: "경유·합승",
        body: "친지를 태우거나 경유하실 때는 좌석벨트와 이동 시간을 기준으로 가능 여부를 함께 봐 주세요.",
      },
      {
        label: "픽업 장소",
        body: "아파트 단지는 정문과 지하주차장 중 혼잡한 시간대를 피해 만나는 장소를 정하시면 수월합니다.",
      },
      {
        label: "밤·새벽",
        body: "아이가 덜 깨도록 차량 대기 위치를 미리 정해 두시면 승차가 한결 편합니다.",
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
        title: "가족 5인·캐리어 다수",
        body: "미니밴 한 대에 실을 수 있는 짐인지 숫자로 확인한 뒤, 필요하면 더 큰 차량으로 맞추시는 경우가 많습니다.",
      },
      {
        title: "유아 카시트",
        body: "후방 좌석 배치를 미리 정해 두면 보호자 동승 동선이 짧아져 승차가 편합니다.",
      },
      {
        title: "픽업 장소가 두 곳",
        body: "주소가 두 곳이면 경유 순서를 시간 순으로 나누시면 일정이 무리하지 않습니다.",
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
        label: "골프백",
        body: "하드 케이스 길이와 개수를 사진이나 치수로 알려 주시면, 세단으로는 부족한지 미리 판단할 수 있습니다.",
      },
      {
        label: "라운드 후 공항",
        body: "라운드 직후 공항으로 가실 때는 샤워·건조·옷 갈아입는 시간을 일정에 넣어 주세요.",
      },
      {
        label: "단체 라운드",
        body: "골프백이 많을수록 차를 나누어 타시는 편이 안전하고 편합니다.",
      },
      {
        label: "통행료·거리",
        body: "골프장까지 접근로가 길면 통행료와 이동 시간을 요금 안내와 함께 말씀드립니다.",
      },
      {
        label: "이른 출국",
        body: "클럽을 싣고 바로 공항으로 갈지, 숙소에 들렀다 갈지 먼저 정하시면 픽업 시각 맞추기가 쉽습니다.",
      },
      {
        label: "픽업 장소",
        body: "클럽하우스 앞과 숙소 로비 중 어디서 만나기 편한지 알려 주시면 그에 맞춰 뵙습니다.",
      },
      {
        label: "편명·터미널",
        body: "편명과 터미널을 영문으로 남겨 두시면 공항 하차 안내가 정확합니다.",
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
        title: "골프백이 많을 때",
        body: "한 대에 다 실기 어려우면 차를 두 대로 나누고, 출발 시각을 맞춰 공항에서 다시 합류하실 수 있습니다.",
      },
      {
        title: "라운드 후 인천행",
        body: "건조와 옷 갈아입기 시간을 일정에 넣어 두시면 여유 있게 공항에 도착하실 수 있습니다.",
      },
      {
        title: "해외에서 오신 단체",
        body: "영문 픽업 문구와 명단을 미리 주시면 만남이 한결 수월합니다.",
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
        label: "연락 방법",
        body: "영문 일정은 WhatsApp 등으로 한 스레드에 모아 두시면 편합니다. 편명과 시간은 글로 남겨 두는 편이 정확합니다.",
      },
      {
        label: "만남·플라카드",
        body: "입국장에서 플라카드나 행사명 표기가 필요하시면 미리 말씀해 주세요. 터미널별 만남 위치도 함께 안내드립니다.",
      },
      {
        label: "도착 시간",
        body: "입국 심사 시간은 들쭉날쭉합니다. 정해진 시각보다 수하물을 받으신 뒤 연락 주시는 방식을 권해 드립니다.",
      },
      {
        label: "심야 도착",
        body: "시차와 피로를 고려해 호텔까지 바로 가는 동선을 단순하게 잡으시는 편이 좋습니다.",
      },
      {
        label: "짐·골프",
        body: "장거리 비행 후에는 수하물이 늦게 나오거나 누락될 수 있어, 일정에 여유를 두시길 권해 드립니다.",
      },
      {
        label: "단체",
        body: "인원이 많을 때는 좌석벨트 수에 맞춰 차량을 나누는 것이 안전합니다.",
      },
      {
        label: "통행료",
        body: "호텔까지 거리가 길면 통행료 포함 여부를 예약 시 함께 확인해 주세요.",
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
        title: "영문 일정만 있을 때",
        body: "편명과 호텔 주소를 메신저에 남겨 두시고, 바뀌는 부분만 짧게 맞추시면 됩니다.",
      },
      {
        title: "플라카드 픽업",
        body: "행사 로고나 문구가 필요하시면 미리 요청해 주시면 만남이 쉽습니다.",
      },
      {
        title: "연착",
        body: "도착이 늦어져도 수하물을 받으신 뒤 연락 주시는 방식이 대기 혼선을 줄입니다.",
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
        label: "인원·차량",
        body: "좌석벨트 수를 기준으로 인원을 맞추시고, 넘치면 반드시 차를 나누어 타시는 것을 권해 드립니다.",
      },
      {
        label: "짐이 매우 많을 때",
        body: "짐만 많으면 승객용 차와 짐 공간이 넉넉한 차를 나누는 방안을 검토할 수 있습니다.",
      },
      {
        label: "공항 하차",
        body: "단체일 때는 하차 순서와 수하물 카트를 준비하는 시간을 조금 더 두시는 편이 좋습니다.",
      },
      {
        label: "여러 대 동시 이동",
        body: "차가 여러 대일 때는 연락 창구를 하나로 정해 두시면 소통이 수월합니다.",
      },
      {
        label: "연락 담당",
        body: "대표 연락처 한 곳과 현장 인솔자 한 분을 정해 두시면 현장 혼선이 줄어듭니다.",
      },
      {
        label: "행사·언어",
        body: "행사명과 참가자 구성을 알려 주시면 안내 문구를 맞춰 드리기 쉽습니다.",
      },
      {
        label: "통행료",
        body: "차량이 여러 대일 때 통행료 정산 방식을 예약 전에 함께 정하시면 좋습니다.",
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
        title: "학교·체험단 출국",
        body: "인솔자 한 분 기준으로 시간표를 정하고, 차를 두 대로 나누어 타시는 경우가 많습니다.",
      },
      {
        title: "기업 일정 후 단체 이동",
        body: "주차장 공간이 좁으면 차량별로 출발 순서를 나누시는 편이 수월합니다.",
      },
      {
        title: "귀국 짐 증가",
        body: "기념품 등으로 짐이 늘면 적재를 다시 보고, 필요하면 차량을 추가하실 수 있습니다.",
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
        body: "개수와 대략적인 치수를 숫자로 알려 주시면, 한 차에 실을 수 있는지 먼저 맞춰 드립니다.",
      },
      {
        label: "캐리어와 골프백",
        body: "둘 다 있으면 싣는 순서가 달라질 수 있어, 미리 알려 주시면 좋습니다.",
      },
      {
        label: "공항 도착",
        body: "짐이 많을수록 카트와 엘리베이터 대기가 길어질 수 있어, 공항 도착 목표를 조금 앞당기시는 편이 좋습니다.",
      },
      {
        label: "가구별 짐",
        body: "여러 가구 짐이 한꺼번이면 차량을 나누는 것이 안전합니다.",
      },
      {
        label: "픽업 장소",
        body: "엘리베이터가 작은 단지는 지상 로터리에서 만나 싣는 편이 빠를 때가 있습니다.",
      },
      {
        label: "밤 이동",
        body: "무거운 짐을 옮기는 시간을 일정에 넉넉히 넣어 주세요.",
      },
      {
        label: "통행료·경유",
        body: "장거리에 짐까지 많으면 요금을 단순하게 유지하기 위해 불필요한 경유는 줄이는 편이 좋습니다.",
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
        title: "짐이 많은 가족 이동",
        body: "박스 크기를 알려 주시면 미니밴 두 대로 나누어 실을지 함께 정할 수 있습니다.",
      },
      {
        title: "큰 캐리어와 골프백",
        body: "트렁크 공간을 확인한 뒤 높은 차량으로 맞추시는 경우가 많습니다.",
      },
      {
        title: "무거운 짐·가구",
        body: "상하차에 걸리는 시간을 일정에 넣어 두시면 운전 일정이 무리하지 않습니다.",
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
        label: "예약 시 알려 주실 정보",
        body: "편명, 주소, 인원을 한 번에 알려 주시면 픽업 시각을 맞추기가 빠릅니다.",
      },
      {
        label: "공항 동선",
        body: "국제선·국내선·항공사마다 체크인 위치와 동선이 다릅니다.",
      },
      {
        label: "새벽·밤",
        body: "대중교통이 끊긴 시간에는 숙소 앞 픽업이 더 편한 경우가 많습니다.",
      },
      {
        label: "짐",
        body: "큰 짐이 있으면 차종이 달라질 수 있으니 개수와 크기를 알려 주세요.",
      },
      {
        label: "카시트·단체",
        body: "좌석벨트 수와 카시트 필요 여부를 먼저 정해 주시면 좋습니다.",
      },
      {
        label: "위치 공유",
        body: "카카오맵·WhatsApp 등으로 위치를 남겨 두시면 만남이 수월합니다.",
      },
      {
        label: "통행료·거리",
        body: "요금 안내 시 통행료 포함 여부를 분명히 말씀드립니다.",
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
        title: "처음 이용하실 때",
        body: "주소와 편명만으로도 기본 픽업 시각을 제안해 드리고, 세부는 메시지로 이어서 맞추시면 됩니다.",
      },
      {
        title: "항공편 변경",
        body: "편명이 바뀌면 픽업 시각만 조정하시면 되고, 요금은 예약 확정 시점 기준으로 정리됩니다.",
      },
      {
        title: "임신·어르신 동승",
        body: "빠른 일정보다 승하차 여유를 두시면 차 안에서 기다리는 시간을 줄이실 수 있습니다.",
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
