export type PricingRow = {
  name: string;
  nameEn: string;
  gimpo: number;
  incheon: number;
  distanceKm: number | null;
};

/** 시·군 단위 묶음 — 상단 행 클릭 시 세부 구간 표시 */
export type PricingRegionGroup = {
  group: true;
  id: string;
  name: string;
  nameEn: string;
  rows: PricingRow[];
};

export type PricingTableEntry = PricingRow | PricingRegionGroup;

export function isPricingRegionGroup(entry: PricingTableEntry): entry is PricingRegionGroup {
  return "group" in entry && entry.group === true;
}

export type PricingRegion = {
  id: string;
  name: string;
  nameEn: string;
  rows: PricingTableEntry[];
};

const sortKo = (a: PricingRow, b: PricingRow) =>
  a.name.localeCompare(b.name, "ko");

const row = (
  name: string,
  nameEn: string,
  gimpo: number,
  incheon: number,
): PricingRow => ({
  name,
  nameEn,
  gimpo,
  incheon,
  distanceKm: null,
});

const regionGroup = (
  id: string,
  name: string,
  nameEn: string,
  rows: PricingRow[],
): PricingRegionGroup => ({
  group: true,
  id,
  name,
  nameEn,
  rows,
});

/**
 * 서울 구간 — 표시 순서 고정.
 * (기본은 가나다이나, 동일 권역 내 금액이 다른 항목은 바로 아래에 둠. 예: 강남구 → 개포동 → 일원·세곡·자곡)
 */
const seoulRows: PricingRow[] = [
  { name: "김포공항", nameEn: "Gimpo Airport", gimpo: 0, incheon: 70000, distanceKm: null },
  { name: "강남구", nameEn: "Gangnam-gu", gimpo: 55000, incheon: 90000, distanceKm: null },
  { name: "개포동", nameEn: "Gaepo-dong", gimpo: 60000, incheon: 90000, distanceKm: null },
  { name: "일원, 세곡, 자곡", nameEn: "Irwon, Segok, Jagok", gimpo: 65000, incheon: 95000, distanceKm: null },
  { name: "강동구", nameEn: "Gangdong-gu", gimpo: 60000, incheon: 90000, distanceKm: null },
  { name: "상일, 명일동", nameEn: "Sangil, Myeongil-dong", gimpo: 60000, incheon: 95000, distanceKm: null },
  { name: "강북구", nameEn: "Gangbuk-gu", gimpo: 60000, incheon: 90000, distanceKm: null },
  { name: "강서구", nameEn: "Gangseo-gu", gimpo: 40000, incheon: 75000, distanceKm: null },
  { name: "관악구", nameEn: "Gwanak-gu", gimpo: 50000, incheon: 80000, distanceKm: null },
  { name: "광진구", nameEn: "Gwangjin-gu", gimpo: 60000, incheon: 90000, distanceKm: null },
  { name: "구로구", nameEn: "Guro-gu", gimpo: 45000, incheon: 75000, distanceKm: null },
  { name: "금천구", nameEn: "Geumcheon-gu", gimpo: 45000, incheon: 75000, distanceKm: null },
  { name: "노원구", nameEn: "Nowon-gu", gimpo: 65000, incheon: 100000, distanceKm: null },
  { name: "도봉구", nameEn: "Dobong-gu", gimpo: 65000, incheon: 100000, distanceKm: null },
  { name: "동대문구", nameEn: "Dongdaemun-gu", gimpo: 55000, incheon: 90000, distanceKm: null },
  { name: "동작구", nameEn: "Dongjak-gu", gimpo: 50000, incheon: 80000, distanceKm: null },
  { name: "마포구", nameEn: "Mapo-gu", gimpo: 45000, incheon: 75000, distanceKm: null },
  { name: "서대문구", nameEn: "Seodaemun-gu", gimpo: 50000, incheon: 80000, distanceKm: null },
  { name: "서초구", nameEn: "Seocho-gu", gimpo: 55000, incheon: 90000, distanceKm: null },
  { name: "성동구", nameEn: "Seongdong-gu", gimpo: 55000, incheon: 85000, distanceKm: null },
  { name: "성북구", nameEn: "Seongbuk-gu", gimpo: 55000, incheon: 85000, distanceKm: null },
  { name: "송파구", nameEn: "Songpa-gu", gimpo: 60000, incheon: 90000, distanceKm: null },
  { name: "양천구", nameEn: "Yangcheon-gu", gimpo: 40000, incheon: 75000, distanceKm: null },
  { name: "영등포구", nameEn: "Yeongdeungpo-gu", gimpo: 45000, incheon: 75000, distanceKm: null },
  { name: "용산구", nameEn: "Yongsan-gu", gimpo: 55000, incheon: 85000, distanceKm: null },
  { name: "은평구", nameEn: "Eunpyeong-gu", gimpo: 50000, incheon: 80000, distanceKm: null },
  { name: "종로구", nameEn: "Jongno-gu", gimpo: 55000, incheon: 85000, distanceKm: null },
  { name: "중구", nameEn: "Jung-gu", gimpo: 55000, incheon: 85000, distanceKm: null },
  { name: "중랑구", nameEn: "Jungnang-gu", gimpo: 65000, incheon: 90000, distanceKm: null },
];

/**
 * 경기/수도권 — 표시 순서 고정. 시·군 단위 그룹은 `regionGroup`, 나머지는 단일 행.
 */
const gyeonggiRows: PricingTableEntry[] = [
  row("가평역", "Gapyeong Station area", 130000, 160000),
  row("고양시 (일산, 덕양 포함)", "Goyang-si (Ilsan, Deogyang)", 45000, 75000),
  row("고양 벽제", "Goyang Byeokje", 60000, 85000),
  row("과천시", "Gwacheon-si", 70000, 90000),
  row("광명[역]", "Gwangmyeong (station)", 55000, 80000),
  row("광주시", "Gwangju-si", 95000, 120000),
  row("곤지암", "Gonjiam", 110000, 130000),
  row("구리시", "Guri-si", 70000, 100000),
  row("군포시", "Gunpo-si", 65000, 85000),
  row("김포시 (신도시)", "Gimpo-si (new town)", 55000, 75000),
  regionGroup("namyangju", "남양주시", "Namyangju-si", [
    row("덕소", "Deokso", 80000, 110000),
    row("별내, 다산", "Byeollae, Dasan", 70000, 100000),
    row("수동, 조안", "Sudong, Joan", 100000, 130000),
    row("진접, 화도", "Jinjeop, Hwado", 90000, 120000),
  ]),
  row("동두천시", "Dongducheon-si", 90000, 130000),
  row("부천시", "Bucheon-si", 40000, 70000),
  row("성남시 (분당 포함)", "Seongnam-si (incl. Bundang)", 85000, 100000),
  row("수원시", "Suwon-si", 80000, 90000),
  row("수원 광교", "Suwon Gwanggyo", 85000, 90000),
  row("수원 영통", "Suwon Yeongtong", 85000, 100000),
  row("시흥시 (목감 포함)", "Siheung-si (incl. Mokgam)", 60000, 70000),
  row("시흥 정왕동", "Siheung Jeongwang-dong", 60000, 70000),
  row("안산시", "Ansan-si", 65000, 75000),
  row("안산 건건동", "Ansan Geongeon-dong", 70000, 80000),
  row("안산 대부도", "Ansan Daebudo", 80000, 100000),
  row("안산 팔곡동", "Ansan Palgok-dong", 70000, 80000),
  row("안성시", "Anseong-si", 120000, 140000),
  row("안성 공도", "Anseong Gongdo", 110000, 130000),
  row("안양시", "Anyang-si", 65000, 85000),
  row("양주시", "Yangju-si", 80000, 110000),
  row("양평군", "Yangpyeong-gun", 120000, 150000),
  row("여주시", "Yeoju-si", 120000, 150000),
  row("연천군", "Yeoncheon-gun", 110000, 160000),
  row("오산시", "Osan-si", 90000, 110000),
  regionGroup("yongin", "용인시", "Yongin-si", [
    row("용인 기흥, 죽전, 동백, 수지", "Yongin Giheung, Jukjeon, Dongbaek, Suji", 85000, 100000),
    row("용인 남사", "Yongin Namsa", 110000, 130000),
    row("용인 양지, 모현", "Yongin Yangji, Mohyeon", 100000, 120000),
    row("용인 이동", "Yongin Idong", 100000, 130000),
    row("용인 처인구", "Yongin Cheoin-gu", 90000, 120000),
  ]),
  row("위례", "Wirye", 85000, 100000),
  row("의왕, 평촌", "Uiwang, Pyeongchon", 65000, 85000),
  row("의정부시", "Uijeongbu-si", 70000, 100000),
  row("이천시", "Icheon-si", 110000, 130000),
  regionGroup("incheon_metro", "인천광역시", "Incheon", [
    row("강화", "Ganghwa", 70000, 100000),
    row("검단, 계양", "Geomdan, Gyeyang", 45000, 70000),
    row("인천 서구, 부평", "Incheon Seo-gu, Bupyeong", 50000, 70000),
    row("연수동, 송도, 간석, 남동", "Yeonsu, Songdo, Ganseok, Namdong", 60000, 60000),
    row("청라", "Cheongna", 50000, 60000),
  ]),
  row("일산", "Ilsan", 45000, 75000),
  row("일산 탄현", "Ilsan Tanhyeon", 50000, 80000),
  row("일산 화정, 행신", "Ilsan Hwajeong, Haengsin", 40000, 75000),
  row("장호원", "Janghowon", 120000, 160000),
  row("청평", "Cheongpyeong", 110000, 150000),
  regionGroup("paju", "파주시", "Paju-si", [
    row("파주 LCD", "Paju LCD", 70000, 95000),
    row("파주 광탄", "Paju Gwangtan", 80000, 100000),
    row("파주 금촌", "Paju Geumchon", 65000, 90000),
    row("파주 문산", "Paju Munsan", 75000, 110000),
    row("파주 봉일천", "Paju Bongilcheon", 70000, 100000),
    row("파주 운정", "Paju Unjeong", 60000, 85000),
  ]),
  row("평택시", "Pyeongtaek-si", 120000, 130000),
  row("포천시", "Pocheon-si", 100000, 130000),
  row("하남시", "Hanam-si", 75000, 100000),
  regionGroup("hwaseong", "화성시", "Hwaseong-si", [
    row("화성 동탄 1, 발안, 향남", "Hwaseong Dongtan 1, Balan, Hyangnam", 90000, 100000),
    row("화성 동탄 2", "Hwaseong Dongtan 2", 95000, 110000),
    row("화성 병점", "Hwaseong Byeongjeom", 85000, 100000),
    row("화성 봉담", "Hwaseong Bongdam", 80000, 95000),
    row("화성 새솔동, 송산", "Hwaseong Saesol, Songsan", 75000, 85000),
    row("화성 제부도", "Hwaseong Jebudo", 90000, 110000),
    row("화성시청", "Hwaseong City Hall", 85000, 90000),
  ]),
];

export const pricingRegions: PricingRegion[] = [
  {
    id: "seoul",
    name: "서울",
    nameEn: "Seoul",
    rows: seoulRows,
  },
  {
    id: "gyeonggi",
    name: "경기도",
    nameEn: "Gyeonggi-do",
    rows: gyeonggiRows,
  },
  {
    id: "gangwon",
    name: "강원도",
    nameEn: "Gangwon-do",
    rows: [
      { name: "강릉", nameEn: "Gangneung", gimpo: 230000, incheon: 320000, distanceKm: 266 },
      { name: "동해", nameEn: "Donghae", gimpo: 290000, incheon: 340000, distanceKm: 280 },
      { name: "속초", nameEn: "Sokcho", gimpo: 220000, incheon: 290000, distanceKm: 223 },
      { name: "양양", nameEn: "Yangyang", gimpo: 230000, incheon: 320000, distanceKm: 230 },
      { name: "원주", nameEn: "Wonju", gimpo: 150000, incheon: 190000, distanceKm: 163 },
      { name: "춘천", nameEn: "Chuncheon", gimpo: 170000, incheon: 230000, distanceKm: 191 },
      { name: "태백", nameEn: "Taebaek", gimpo: 300000, incheon: 390000, distanceKm: 322 },
      { name: "평창", nameEn: "Pyeongchang", gimpo: 250000, incheon: 300000, distanceKm: 261 },
      { name: "홍천", nameEn: "Hongcheon", gimpo: 180000, incheon: 230000, distanceKm: 179 },
    ].sort(sortKo),
  },
  {
    id: "chungnam",
    name: "충청남도",
    nameEn: "Chungcheongnam-do",
    rows: [
      { name: "공주", nameEn: "Gongju", gimpo: 130000, incheon: 190000, distanceKm: 173 },
      { name: "논산", nameEn: "Nonsan", gimpo: 150000, incheon: 220000, distanceKm: 234 },
      { name: "당진", nameEn: "Dangjin", gimpo: 100000, incheon: 160000, distanceKm: 130 },
      { name: "보령", nameEn: "Boryeong", gimpo: 160000, incheon: 240000, distanceKm: 212 },
      { name: "서산", nameEn: "Seosan", gimpo: 120000, incheon: 200000, distanceKm: 180 },
      { name: "아산", nameEn: "Asan", gimpo: 100000, incheon: 150000, distanceKm: 121 },
      { name: "천안", nameEn: "Cheonan", gimpo: 100000, incheon: 150000, distanceKm: 123 },
      { name: "태안", nameEn: "Taean", gimpo: 150000, incheon: 230000, distanceKm: 215 },
    ].sort(sortKo),
  },
  {
    id: "chungbuk",
    name: "충청북도",
    nameEn: "Chungcheongbuk-do",
    rows: [
      { name: "단양", nameEn: "Danyang", gimpo: 200000, incheon: 250000, distanceKm: 245 },
      { name: "보은", nameEn: "Boeun", gimpo: 160000, incheon: 240000, distanceKm: 221 },
      { name: "영동", nameEn: "Yeongdong", gimpo: 200000, incheon: 290000, distanceKm: 280 },
      { name: "제천", nameEn: "Jecheon", gimpo: 190000, incheon: 260000, distanceKm: 223 },
      { name: "증평", nameEn: "Jeungpyeong", gimpo: 150000, incheon: 210000, distanceKm: 187 },
      { name: "진천", nameEn: "Jincheon", gimpo: 140000, incheon: 190000, distanceKm: 147 },
      { name: "청주", nameEn: "Cheongju", gimpo: 130000, incheon: 180000, distanceKm: 128 },
      { name: "충주", nameEn: "Chungju", gimpo: 170000, incheon: 200000, distanceKm: 170 },
    ].sort(sortKo),
  },
  {
    id: "jeonnam",
    name: "전라남도",
    nameEn: "Jeollanam-do",
    rows: [
      { name: "강진", nameEn: "Gangjin", gimpo: 270000, incheon: 330000, distanceKm: 291 },
      { name: "고흥", nameEn: "Goheung", gimpo: 310000, incheon: 370000, distanceKm: 356 },
      { name: "광양", nameEn: "Gwangyang", gimpo: 260000, incheon: 320000, distanceKm: 280 },
      { name: "나주", nameEn: "Naju", gimpo: 220000, incheon: 270000, distanceKm: 223 },
      { name: "목포", nameEn: "Mokpo", gimpo: 290000, incheon: 340000, distanceKm: 293 },
      { name: "무안", nameEn: "Muan", gimpo: 280000, incheon: 330000, distanceKm: 281 },
      { name: "순천", nameEn: "Suncheon", gimpo: 260000, incheon: 310000, distanceKm: 271 },
      { name: "여수", nameEn: "Yeosu", gimpo: 280000, incheon: 340000, distanceKm: 310 },
      { name: "완도", nameEn: "Wando", gimpo: 340000, incheon: 390000, distanceKm: 387 },
      { name: "장흥", nameEn: "Jangheung", gimpo: 280000, incheon: 340000, distanceKm: 306 },
      { name: "해남", nameEn: "Haenam", gimpo: 330000, incheon: 380000, distanceKm: 367 },
    ].sort(sortKo),
  },
  {
    id: "jeonbuk",
    name: "전라북도",
    nameEn: "Jeollabuk-do",
    rows: [
      { name: "고창", nameEn: "Gochang", gimpo: 230000, incheon: 330000, distanceKm: 303 },
      { name: "군산", nameEn: "Gunsan", gimpo: 180000, incheon: 260000, distanceKm: 239 },
      { name: "김제", nameEn: "Gimje", gimpo: 190000, incheon: 280000, distanceKm: 257 },
      { name: "남원", nameEn: "Namwon", gimpo: 250000, incheon: 330000, distanceKm: 304 },
      { name: "무주", nameEn: "Muju", gimpo: 260000, incheon: 340000, distanceKm: 315 },
      { name: "부안", nameEn: "Buan", gimpo: 200000, incheon: 300000, distanceKm: 271 },
      { name: "순창", nameEn: "Sunchang", gimpo: 250000, incheon: 340000, distanceKm: 318 },
      { name: "익산", nameEn: "Iksan", gimpo: 180000, incheon: 270000, distanceKm: 251 },
      { name: "임실", nameEn: "Imsil", gimpo: 230000, incheon: 320000, distanceKm: 295 },
      { name: "전주", nameEn: "Jeonju", gimpo: 190000, incheon: 280000, distanceKm: 267 },
      { name: "정읍", nameEn: "Jeongeup", gimpo: 220000, incheon: 310000, distanceKm: 293 },
    ].sort(sortKo),
  },
  {
    id: "gyeongnam",
    name: "경상남도",
    nameEn: "Gyeongsangnam-do",
    rows: [
      { name: "거제", nameEn: "Geoje", gimpo: 370000, incheon: 460000, distanceKm: 450 },
      { name: "김해", nameEn: "Gimhae", gimpo: 320000, incheon: 410000, distanceKm: 389 },
      { name: "남해", nameEn: "Namhae", gimpo: 330000, incheon: 420000, distanceKm: 406 },
      { name: "밀양", nameEn: "Miryang", gimpo: 300000, incheon: 390000, distanceKm: 373 },
      { name: "사천", nameEn: "Sacheon", gimpo: 330000, incheon: 420000, distanceKm: 397 },
      { name: "양산", nameEn: "Yangsan", gimpo: 320000, incheon: 410000, distanceKm: 387 },
      { name: "진주", nameEn: "Jinju", gimpo: 330000, incheon: 420000, distanceKm: 396 },
      { name: "창원", nameEn: "Changwon", gimpo: 320000, incheon: 410000, distanceKm: 385 },
      { name: "통영", nameEn: "Tongyeong", gimpo: 350000, incheon: 440000, distanceKm: 415 },
    ].sort(sortKo),
  },
  {
    id: "gyeongbuk",
    name: "경상북도",
    nameEn: "Gyeongsangbuk-do",
    rows: [
      { name: "경산", nameEn: "Gyeongsan", gimpo: 360000, incheon: 450000, distanceKm: 414 },
      { name: "경주", nameEn: "Gyeongju", gimpo: 370000, incheon: 460000, distanceKm: 436 },
      { name: "구미", nameEn: "Gumi", gimpo: 330000, incheon: 420000, distanceKm: 377 },
      { name: "김천", nameEn: "Gimcheon", gimpo: 340000, incheon: 430000, distanceKm: 382 },
      { name: "문경", nameEn: "Mungyeong", gimpo: 340000, incheon: 430000, distanceKm: 351 },
      { name: "상주", nameEn: "Sangju", gimpo: 340000, incheon: 430000, distanceKm: 341 },
      { name: "안동", nameEn: "Andong", gimpo: 350000, incheon: 440000, distanceKm: 366 },
      { name: "영덕", nameEn: "Yeongdeok", gimpo: 420000, incheon: 510000, distanceKm: 420 },
      { name: "영주", nameEn: "Yeongju", gimpo: 390000, incheon: 480000, distanceKm: 390 },
      { name: "영천", nameEn: "Yeongcheon", gimpo: 360000, incheon: 450000, distanceKm: 391 },
      { name: "포항", nameEn: "Pohang", gimpo: 390000, incheon: 480000, distanceKm: 414 },
    ].sort(sortKo),
  },
  {
    id: "jeju",
    name: "제주도",
    nameEn: "Jeju-do",
    rows: [],
  },
].map((region) => ({
  ...region,
  /** 서울·경기/수도권은 수동 순서 유지, 그 외 지역만 가나다순 */
  rows:
    region.id === "seoul" || region.id === "gyeonggi"
      ? [...region.rows]
      : ([...(region.rows as PricingRow[])].sort(sortKo) as PricingTableEntry[]),
}));
