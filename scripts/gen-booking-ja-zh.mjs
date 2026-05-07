/**
 * scripts/booking-descriptors.json 기준으로 src/lib/booking-region-ja-zh.ts 생성.
 * node scripts/gen-booking-ja-zh.mjs
 */
import fs from "node:fs";

const descriptors = JSON.parse(fs.readFileSync(new URL("./booking-descriptors.json", import.meta.url), "utf8"));

/** 슬롯 단위 오버라이드 (경기·인천 일대 복합 지명) */
const SLUG_OVERRIDES = {
  gyeonggi__gapyeong_station_area: { ja: "加平駅周辺", zh: "加平站周边" },
  gyeonggi__goyang_si_ilsan_deogyang: { ja: "高陽市（一山・徳陽エリア）", zh: "高阳市（一山、德阳一带）" },
  gyeonggi__goyang_byeokje: { ja: "高陽・碧蹄", zh: "高阳·碧蹄" },
  gyeonggi__gwacheon_si: { ja: "果川市", zh: "果川市" },
  gyeonggi__gwangmyeong_station: { ja: "光明（駅）", zh: "光明（站）" },
  gyeonggi__gwangju_si: { ja: "広州市（京畿）", zh: "广州市（京畿道）" },
  gyeonggi__guri_si: { ja: "九里市", zh: "九里市" },
  gyeonggi__gunpo_si: { ja: "軍浦市", zh: "军浦市" },
  gyeonggi__gimpo_si_new_town: { ja: "金浦市（ニュータウン）", zh: "金浦市（新城）" },
  gyeonggi__namyangju__deokso: { ja: "南楊州市・徳沼", zh: "南杨州市·德沼" },
  gyeonggi__namyangju__byeollae_dasan: { ja: "南楊州市・別内・多山（ダサン）", zh: "南杨州市·别内·多山" },
  gyeonggi__namyangju__sudong_joan: { ja: "南楊州市・水洞・チョアン", zh: "南杨州市·水洞·椒岩" },
  gyeonggi__namyangju__jinjeop_hwado: { ja: "南楊州市・チンジョプ・ファド", zh: "南杨州市·镇捷·华岛" },
  gyeonggi__dongducheon_si: { ja: "東豆川市", zh: "东豆川市" },
  gyeonggi__bucheon_si: { ja: "富川市", zh: "富川市" },
  gyeonggi__seongnam_si_incl_bundang: { ja: "城南市（盆唐を含む）", zh: "城南市（含盆唐）" },
  gyeonggi__suwon_si: { ja: "水原市", zh: "水原市" },
  gyeonggi__suwon_gwanggyo: { ja: "水原・光橋（カンギョ）", zh: "水原·广桥" },
  gyeonggi__suwon_yeongtong: { ja: "水原・霊通（ヨントン）", zh: "水原·灵通" },
  gyeonggi__siheung_si_incl_mokgam: { ja: "始興市（モッカムを含む）", zh: "始兴市（含木甘）" },
  gyeonggi__siheung_jeongwang_dong: { ja: "始興・正旺洞", zh: "始兴·正旺洞" },
  gyeonggi__ansan_si: { ja: "安山市", zh: "安山市" },
  gyeonggi__ansan_geongeon_dong: { ja: "安山・乾乾洞", zh: "安山·乾乾洞" },
  gyeonggi__ansan_daebudo: { ja: "安山・大布島", zh: "安山·大布岛" },
  gyeonggi__ansan_palgok_dong: { ja: "安山・八谷洞", zh: "安山·八谷洞" },
  gyeonggi__anseong_si: { ja: "安城市", zh: "安城市" },
  gyeonggi__anseong_gongdo: { ja: "安城・公道（ゴンド）", zh: "安城·公道" },
  gyeonggi__anyang_si: { ja: "安養市", zh: "安养市" },
  gyeonggi__yangju_si: { ja: "楊州市", zh: "杨州市" },
  gyeonggi__yangpyeong_gun: { ja: "楊平郡", zh: "杨平郡" },
  gyeonggi__yeoju_si: { ja: "驪州市", zh: "骊州市" },
  gyeonggi__yeoncheon_gun: { ja: "漣川郡", zh: "涟川郡" },
  gyeonggi__osan_si: { ja: "烏山市", zh: "乌山市" },
  gyeonggi__yongin__yongin_giheung_jukjeon_dongbaek_suji: {
    ja: "龍仁市・器興・竹田・銅白・水枝エリア",
    zh: "龙仁市·器兴·竹田·铜白·水枝",
  },
  gyeonggi__yongin__yongin_namsa: { ja: "龍仁市・南社（ナムサ）", zh: "龙仁市·南社" },
  gyeonggi__yongin__yongin_yangji_mohyeon: { ja: "龍仁市・楊智・慕賢", zh: "龙仁市·杨智·慕贤" },
  gyeonggi__yongin__yongin_idong: { ja: "龍仁市・二洞", zh: "龙仁市·二洞" },
  gyeonggi__yongin__yongin_cheoin_gu: { ja: "龍仁市・処仁区", zh: "龙仁市·处仁区" },
  gyeonggi__uiwang_pyeongchon: { ja: "儀王・平村", zh: "义王·平村" },
  gyeonggi__uijeongbu_si: { ja: "議政府市", zh: "议政府市" },
  gyeonggi__icheon_si: { ja: "利川市", zh: "利川市" },
  gyeonggi__incheon_metro__ganghwa: { ja: "仁川広域市・江華", zh: "仁川广域市·江华" },
  gyeonggi__incheon_metro__geomdan_gyeyang: { ja: "仁川広域市・検丹・桂陽", zh: "仁川广域市·检丹·桂阳" },
  gyeonggi__incheon_metro__incheon_seo_gu_bupyeong: { ja: "仁川広域市・仁川西区・富平", zh: "仁川广域市·仁川西区·富平" },
  gyeonggi__incheon_metro__yeonsu_songdo_ganseok_namdong: {
    ja: "仁川広域市・延寿・松島・間石・南洞",
    zh: "仁川广域市·延寿·松岛·间石·南洞",
  },
  gyeonggi__incheon_metro__cheongna: { ja: "仁川広域市・青羅", zh: "仁川广域市·青罗" },
  gyeonggi__ilsan_tanhyeon: { ja: "一山・炭峴", zh: "一山·炭岘" },
  gyeonggi__ilsan_hwajeong_haengsin: { ja: "一山・花井・幸信", zh: "一山·花井·幸信" },
  gyeonggi__paju__paju_lcd: { ja: "坡州市・坡州 LCD", zh: "坡州市·坡州 LCD" },
  gyeonggi__paju__paju_gwangtan: { ja: "坡州市・光灘", zh: "坡州市·光滩" },
  gyeonggi__paju__paju_geumchon: { ja: "坡州市・金村", zh: "坡州市·金村" },
  gyeonggi__paju__paju_munsan: { ja: "坡州市・文山", zh: "坡州市·文山" },
  gyeonggi__paju__paju_bongilcheon: { ja: "坡州市・豊一川", zh: "坡州市·豊一川" },
  gyeonggi__paju__paju_unjeong: { ja: "坡州市・雲井", zh: "坡州市·云井" },
  gyeonggi__pyeongtaek_si: { ja: "平沢市", zh: "平泽市" },
  gyeonggi__pocheon_si: { ja: "抱川市", zh: "抱川市" },
  gyeonggi__hanam_si: { ja: "河南市", zh: "河南市" },
  gyeonggi__hwaseong__hwaseong_dongtan_1_balan_hyangnam: {
    ja: "華城市・東滩1・発安・香南",
    zh: "华城市·东滩1·发安·香南",
  },
  gyeonggi__hwaseong__hwaseong_dongtan_2: { ja: "華城市・東滩2", zh: "华城市·东滩2" },
  gyeonggi__hwaseong__hwaseong_byeongjeom: { ja: "華城市・餠店", zh: "华城市·饼店" },
  gyeonggi__hwaseong__hwaseong_bongdam: { ja: "華城市・峰潭", zh: "华城市·峰潭" },
  gyeonggi__hwaseong__hwaseong_saesol_songsan: { ja: "華城市・細率・松山", zh: "华城市·细率·松山" },
  gyeonggi__hwaseong__hwaseong_jebudo: { ja: "華城市・済扶島", zh: "华城市·济扶岛" },
  gyeonggi__hwaseong__hwaseong_city_hall: { ja: "華城市・市庁", zh: "华城市·市政府" },
};

/** 서울 자치구 (-gu) */
const SEOUL_GU = {
  Dobong: { ja: "道峰区", zh: "道峰区" },
  Dongdaemun: { ja: "東大門区", zh: "东大门区" },
  Dongjak: { ja: "銅雀区", zh: "铜雀区" },
  Eunpyeong: { ja: "恩平区", zh: "恩平区" },
  Gangbuk: { ja: "江北区", zh: "江北区" },
  Gangdong: { ja: "江東区", zh: "江东区" },
  Gangnam: { ja: "江南区", zh: "江南区" },
  Gangseo: { ja: "江西区", zh: "江西区" },
  Geumcheon: { ja: "衿川区", zh: "衿川区" },
  Guro: { ja: "九老区", zh: "九老区" },
  Gwanak: { ja: "冠岳区", zh: "冠岳区" },
  Gwangjin: { ja: "広津区", zh: "广津区" },
  Jongno: { ja: "鐘路区", zh: "钟路区" },
  Jung: { ja: "中区", zh: "中区" },
  Jungnang: { ja: "中浪区", zh: "中浪区" },
  Mapo: { ja: "麻浦区", zh: "麻浦区" },
  Nowon: { ja: "蘆原区", zh: "芦原区" },
  Seocho: { ja: "瑞草区", zh: "瑞草区" },
  Seodaemun: { ja: "西大門区", zh: "西大门区" },
  Seongbuk: { ja: "城北区", zh: "城北区" },
  Seongdong: { ja: "城东区", zh: "城东区" },
  Songpa: { ja: "松坡区", zh: "松坡区" },
  Yangcheon: { ja: "陽川区", zh: "阳川区" },
  Yeongdeungpo: { ja: "永登浦区", zh: "永登浦区" },
  Yongsan: { ja: "龍山区", zh: "龙山区" },
};

/** 영문 지명(로마자) → 표기 */
const FRAG = {
  "Incheon Airport Terminal 1 (T1)": { ja: "仁川空港 第1旅客ターミナル (T1)", zh: "仁川机场 第1航站楼 (T1)" },
  "Incheon Airport Terminal 2 (T2)": { ja: "仁川空港 第2旅客ターミナル (T2)", zh: "仁川机场 第2航站楼 (T2)" },
  "Gimpo Airport (Domestic)": { ja: "金浦空港（国内線）", zh: "金浦机场（国内线）" },
  "Gimpo Airport (International)": { ja: "金浦空港（国際線）", zh: "金浦机场（国际线）" },
  "Gimpo Airport": { ja: "金浦空港", zh: "金浦机场" },
  "Gaepo-dong": { ja: "開浦洞", zh: "开浦洞" },
  "Irwon, Segok, Jagok": { ja: "逸院・細谷・紫谷", zh: "逸院、细谷、紫谷" },
  "Sangil, Myeongil-dong": { ja: "上日・明日洞", zh: "上日、明日洞" },
  "Gangwon-do": { ja: "江原道", zh: "江原道" },
  "Chungcheongnam-do": { ja: "忠清南道", zh: "忠清南道" },
  "Chungcheongbuk-do": { ja: "忠清北道", zh: "忠清北道" },
  "Jeollanam-do": { ja: "全羅南道", zh: "全罗南道" },
  "Jeollabuk-do": { ja: "全羅北道", zh: "全罗北道" },
  "Gyeongsangnam-do": { ja: "慶尚南道", zh: "庆尚南道" },
  "Gyeongsangbuk-do": { ja: "慶尚北道", zh: "庆尚北道" },
  "Jeju-do (inquire separately)": { ja: "済州島（別途お問い合わせ）", zh: "济州岛（另洽）" },
  Incheon: { ja: "仁川", zh: "仁川" },
  Gonjiam: { ja: "昆池岩", zh: "昆池岩" },
  Wirye: { ja: "慰礼", zh: "慰礼" },
  Ilsan: { ja: "一山", zh: "一山" },
  Janghowon: { ja: "長湖院", zh: "长湖院" },
  Cheongpyeong: { ja: "清平", zh: "清平" },
};

const CITY = {
  Gangneung: { ja: "江陵", zh: "江陵" },
  Donghae: { ja: "東海", zh: "东海" },
  Sokcho: { ja: "束草", zh: "束草" },
  Yangyang: { ja: "襄陽", zh: "襄阳" },
  Wonju: { ja: "原州", zh: "原州" },
  Chuncheon: { ja: "春川", zh: "春川" },
  Taebaek: { ja: "太白", zh: "太白" },
  Pyeongchang: { ja: "平昌", zh: "平昌" },
  Hongcheon: { ja: "洪川", zh: "洪川" },
  Gongju: { ja: "公州", zh: "公州" },
  Nonsan: { ja: "論山", zh: "论山" },
  Dangjin: { ja: "唐津", zh: "唐津" },
  Boryeong: { ja: "保寧", zh: "保宁" },
  Seosan: { ja: "瑞山", zh: "瑞山" },
  Asan: { ja: "牙山", zh: "牙山" },
  Cheonan: { ja: "天安", zh: "天安" },
  Taean: { ja: "泰安", zh: "泰安" },
  Danyang: { ja: "丹陽", zh: "丹阳" },
  Boeun: { ja: "報恩", zh: "报恩" },
  Yeongdong: { ja: "永同", zh: "永同" },
  Jecheon: { ja: "堤川", zh: "堤川" },
  Jeungpyeong: { ja: "曾坪", zh: "曾坪" },
  Jincheon: { ja: "鎮川", zh: "镇川" },
  Cheongju: { ja: "清州", zh: "清州" },
  Chungju: { ja: "忠州", zh: "忠州" },
  Gangjin: { ja: "康津", zh: "康津" },
  Goheung: { ja: "高興", zh: "高兴" },
  Gwangyang: { ja: "光陽", zh: "光阳" },
  Naju: { ja: "羅州", zh: "罗州" },
  Mokpo: { ja: "木浦", zh: "木浦" },
  Muan: { ja: "務安", zh: "务安" },
  Suncheon: { ja: "順天", zh: "顺天" },
  Yeosu: { ja: "麗水", zh: "丽水" },
  Wando: { ja: "莞島", zh: "莞岛" },
  Jangheung: { ja: "長興", zh: "长兴" },
  Haenam: { ja: "海南", zh: "海南" },
  Gochang: { ja: "高敞", zh: "高敞" },
  Gunsan: { ja: "群山", zh: "群山" },
  Gimje: { ja: "金堤", zh: "金堤" },
  Namwon: { ja: "南原", zh: "南原" },
  Muju: { ja: "茂朱", zh: "茂朱" },
  Buan: { ja: "扶安", zh: "扶安" },
  Sunchang: { ja: "淳昌", zh: "淳昌" },
  Iksan: { ja: "益山", zh: "益山" },
  Imsil: { ja: "任実", zh: "任实" },
  Jeonju: { ja: "全州", zh: "全州" },
  Jeongeup: { ja: "井邑", zh: "井邑" },
  Geoje: { ja: "巨済", zh: "巨济" },
  Gimhae: { ja: "金海", zh: "金海" },
  Namhae: { ja: "南海", zh: "南海" },
  Miryang: { ja: "密陽", zh: "密阳" },
  Sacheon: { ja: "泗川", zh: "泗川" },
  Yangsan: { ja: "梁山", zh: "梁山" },
  Jinju: { ja: "晋州", zh: "晋州" },
  Changwon: { ja: "昌原", zh: "昌原" },
  Tongyeong: { ja: "統営", zh: "统营" },
  Gyeongsan: { ja: "慶山", zh: "庆山" },
  Gyeongju: { ja: "慶州", zh: "庆州" },
  Gumi: { ja: "亀尾", zh: "龟尾" },
  Gimcheon: { ja: "金泉", zh: "金泉" },
  Mungyeong: { ja: "聞慶", zh: "闻庆" },
  Sangju: { ja: "尚州", zh: "尚州" },
  Andong: { ja: "安東", zh: "安东" },
  Yeongdeok: { ja: "永徳", zh: "永德" },
  Yeongju: { ja: "榮州", zh: "荣州" },
  Yeongcheon: { ja: "永川", zh: "永川" },
  Pohang: { ja: "浦項", zh: "浦项" },
};

function splitParts(nameEn) {
  return String(nameEn)
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function translateToken(s) {
  if (FRAG[s]) return FRAG[s];
  if (CITY[s]) return CITY[s];
  const gu = /^(.+)-gu$/.exec(s);
  if (gu && SEOUL_GU[gu[1]]) return SEOUL_GU[gu[1]];
  return { ja: s, zh: s };
}

function translatePartSegment(seg) {
  const subs = seg.split(/\s*,\s*/).map((t) => t.trim()).filter(Boolean);
  const ja = [];
  const zh = [];
  for (const sub of subs) {
    const tr = translateToken(sub);
    ja.push(tr.ja);
    zh.push(tr.zh);
  }
  return { ja: ja.join("、"), zh: zh.join("、") };
}

function translateParts(nameEn) {
  const top = splitParts(nameEn);
  const ja = [];
  const zh = [];
  for (const seg of top) {
    const t = translatePartSegment(seg);
    ja.push(t.ja);
    zh.push(t.zh);
  }
  return { ja: ja.join("・"), zh: zh.join("・") };
}

function translateDescriptor(d) {
  const pre = SLUG_OVERRIDES[d.slug];
  if (pre) return pre;

  const { slug, nameEn } = d;

  if (slug.startsWith("incheon_terminal_") || slug.startsWith("gimpo_terminal_")) {
    return FRAG[nameEn] ?? { ja: nameEn, zh: nameEn };
  }

  const guMatch = /^(.+)-gu$/.exec(nameEn);
  if (guMatch && SEOUL_GU[guMatch[1]]) {
    return SEOUL_GU[guMatch[1]];
  }

  if (slug.startsWith("seoul__")) {
    if (nameEn === "Gaepo-dong") return { ja: "開浦洞", zh: "开浦洞" };
    if (FRAG[nameEn]) return FRAG[nameEn];
    return translateParts(nameEn);
  }

  if (slug === "jeju__inquiry") {
    return FRAG["Jeju-do (inquire separately)"];
  }

  return translateParts(nameEn);
}

const lines = [
  `/** 자동 생성 (scripts/gen-booking-ja-zh.mjs) — SLUG_OVERRIDES·FRAG·CITY 보강 */`,
  `export const BOOKING_REGION_JA_ZH: Record<string, { ja: string; zh: string }> = {`,
];

for (const d of descriptors) {
  const { ja, zh } = translateDescriptor(d);
  const jaEsc = ja.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const zhEsc = zh.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  lines.push(`  "${d.slug}": { ja: "${jaEsc}", zh: "${zhEsc}" },`);
}

lines.push(`};`, ``);

fs.writeFileSync(new URL("../src/lib/booking-region-ja-zh.ts", import.meta.url), lines.join("\n"), "utf8");
console.log("wrote src/lib/booking-region-ja-zh.ts", descriptors.length);
