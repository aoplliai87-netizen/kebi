/**
 * JA/ZH 目的地 LP のメタ・見出し・キーワードを検索意図ベースで整える（英語直訳のまま表に出さない）
 */
import type { LandingPageCopy } from "../../data/landing-pages";
import type { LandingPageSeoPlaceHints } from "../../data/destination-place-seo";
import { resolvePlaceSeo } from "../../data/destination-place-seo";
import { classifyDestinationSlug } from "@/lib/destination-slug-classify";

type Loc = "ja" | "zh";

/** ハイフン区切りトークン → 現地表記（よく使う区間のみ網羅、未登録はそのまま） */
const JA_TOKEN: Record<string, string> = {
  gangnam: "江南",
  jamsil: "蚕室",
  pangyo: "パンギョ",
  suwon: "水原",
  dongtan: "トンタン（板橋新城）",
  uijeongbu: "議政府",
  nowon: "蘆原（ノウォン）",
  gangbuk: "江北",
  suyu: "水逾（スユ）",
  changdong: "倉洞",
  dobong: "道峰",
  byeolnae: "別内（ピョルネ）",
  namyangju: "楊州（ナミャンジュ）",
  guri: "九里",
  yangju: "楊州（ヤンジュ）",
  dongducheon: "東豆川",
  seoul: "ソウル市内",
  myeongdong: "明洞",
  hongdae: "弘大・ホンデ",
  incheon: "仁川",
  airport: "空港",
  gimpo: "金浦",
  dawn: "早朝",
  pickup: "お迎え",
  transfer: "送迎",
  family: "ご家族",
  golf: "ゴルフ",
  foreigner: "外国人のお客様",
  group: "団体",
  heavy: "大型荷物",
  luggage: "荷物",
  meet: "待ち合わせ",
  van: "ワゴン",
  charter: "チャーター",
  vip: "VIP",
  korea: "韓国",
  sanding: "お見送り",
  "incheon-airport": "仁川空港",
  "gimpo-airport": "金浦空港",
};

const ZH_TOKEN: Record<string, string> = {
  gangnam: "江南",
  jamsil: "蚕室",
  pangyo: "板桥",
  suwon: "水原",
  dongtan: "东滩新城",
  uijeongbu: "议政府",
  nowon: "芦原",
  gangbuk: "江北",
  suyu: "水逾",
  changdong: "仓洞",
  dobong: "道峰",
  byeolnae: "别内",
  namyangju: "南杨州",
  guri: "九里",
  yangju: "杨州",
  dongducheon: "东豆川",
  seoul: "首尔市区",
  myeongdong: "明洞",
  hongdae: "弘大",
  incheon: "仁川",
  airport: "机场",
  gimpo: "金浦",
  dawn: "清晨",
  pickup: "接机",
  transfer: "接送",
  family: "家庭",
  golf: "高尔夫",
  foreigner: "外籍旅客",
  group: "团体",
  heavy: "大件行李",
  luggage: "行李",
  meet: "汇合",
  van: "包车",
  charter: "包车",
  vip: "贵宾",
  korea: "韩国",
  sanding: "送机",
  "incheon-airport": "仁川机场",
  "gimpo-airport": "金浦机场",
};

const JA_SECTION_HEADINGS = ["ご利用の流れ・スケジュール", "ルートの目安", "こんなお客様におすすめ"];
const ZH_SECTION_HEADINGS = ["接送流程与行程", "路线说明", "适合哪些旅客"];

function tokensToLocalized(slug: string, map: Record<string, string>): string {
  const parts = slug.split("-").filter(Boolean);
  const out: string[] = [];
  let i = 0;
  while (i < parts.length) {
    const try2 = i + 1 < parts.length ? `${parts[i]}-${parts[i + 1]}` : "";
    const try3 =
      i + 2 < parts.length ? `${parts[i]}-${parts[i + 1]}-${parts[i + 2]}` : "";
    if (try3 && map[try3]) {
      out.push(map[try3]);
      i += 3;
      continue;
    }
    if (try2 && map[try2]) {
      out.push(map[try2]);
      i += 2;
      continue;
    }
    const t = parts[i];
    if (t === "to" || t === "from" || t === "the") {
      i += 1;
      continue;
    }
    out.push(map[t] ?? t);
    i += 1;
  }
  return out.filter(Boolean).join("・");
}

function describeRouteJa(slug: string): string {
  if (slug.includes("to-incheon-airport")) {
    const core = slug.replace("-to-incheon-airport", "");
    const label = tokensToLocalized(core, JA_TOKEN);
    return `${label}から仁川空港`;
  }
  if (slug.startsWith("incheon-airport-to-")) {
    const core = slug.slice("incheon-airport-to-".length);
    const label = tokensToLocalized(core, JA_TOKEN);
    return `仁川空港から${label}`;
  }
  if (slug.startsWith("gimpo-airport-to-")) {
    const core = slug.slice("gimpo-airport-to-".length);
    const label = tokensToLocalized(core, JA_TOKEN);
    return `金浦空港から${label}`;
  }
  return tokensToLocalized(slug, JA_TOKEN);
}

function describeRouteZh(slug: string): string {
  if (slug.includes("to-incheon-airport")) {
    const core = slug.replace("-to-incheon-airport", "");
    const label = tokensToLocalized(core, ZH_TOKEN);
    return `${label}至仁川机场`;
  }
  if (slug.startsWith("incheon-airport-to-")) {
    const core = slug.slice("incheon-airport-to-".length);
    const label = tokensToLocalized(core, ZH_TOKEN);
    return `仁川机场至${label}`;
  }
  if (slug.startsWith("gimpo-airport-to-")) {
    const core = slug.slice("gimpo-airport-to-".length);
    const label = tokensToLocalized(core, ZH_TOKEN);
    return `金浦机场至${label}`;
  }
  return tokensToLocalized(slug, ZH_TOKEN);
}

function keywordsFor(kind: ReturnType<typeof classifyDestinationSlug>, loc: Loc): string[] {
  if (loc === "ja") {
    const base = ["仁川空港送迎", "韓国空港送迎", "首都圏空港送迎", "貸切ワゴン", "ジャンボタクシー級", "深夜空港送迎"];
    const extra: Record<string, string[]> = {
      toAirport: ["出国送迎", "ドアツードア", "ICN送迎"],
      fromAirport: ["到着ピックアップ", "仁川空港お迎え", "外国人送迎"],
      north: ["議政府空港送迎", "北部空港アクセス", "京畿北部"],
      dawn: ["早朝空港送迎", "深夜送迎", "始発前"],
      family: ["家族空港送迎", "チャイルドシート", "スーツケース多数"],
      golf: ["ゴルフバッグ空港", "ゴルフ送迎韓国"],
      foreigner: ["VIP空港送迎", "英語対応送迎", "インバウンド"],
      group: ["団体空港送迎", "チャーター空港"],
      heavy: ["大型荷物空港", "バン貸切"],
      balanced: [],
    };
    return [...base, ...(extra[kind] ?? [])];
  }
  const base = ["仁川机场接送", "韩国包车", "首尔接送机", "深夜机场接送", "明码标价"];
  const extra: Record<string, string[]> = {
    toAirport: ["仁川送机", "出国包车", "上门接送"],
    fromAirport: ["仁川接机", "韩国接机包车", "入境接送"],
    north: ["京畿北部包车", "议政府接送"],
    dawn: ["凌晨机场接送", "清晨赶飞机"],
    family: ["家庭包车机场", "儿童座椅", "多件行李"],
    golf: ["高尔夫接送", "高尔夫球包接送"],
    foreigner: ["外籍接机", "VIP包车", "商务接送"],
    group: ["团体包车", "团队接送机"],
    heavy: ["大件行李包车", "搬家级行李"],
    balanced: [],
  };
  return [...base, ...(extra[kind] ?? [])];
}

function dedupeKeywords(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of items) {
    const t = x.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function gangnamLinkTitle(slug: string, loc: Loc, routeJa: string, routeZh: string): string | null {
  if (!slug.includes("gangnam")) return null;
  if (loc === "ja") {
    if (slug.startsWith("incheon-airport-to-gangnam")) return "仁川空港 → 江南・COEX方面";
    if (slug.includes("gangnam-to-incheon-airport")) return "江南・COEX方面 → 仁川空港";
    return routeJa.replace("から", " → ");
  }
  if (slug.startsWith("incheon-airport-to-gangnam")) return "仁川机场→江南·COEX";
  if (slug.includes("gangnam-to-incheon-airport")) return "江南·COEX→仁川机场";
  return routeZh.replace("至", "→");
}

export function refineLandingLocaleCopy(
  copy: LandingPageCopy,
  slug: string,
  locale: string,
  placeHints?: LandingPageSeoPlaceHints,
): LandingPageCopy {
  if (locale !== "ja" && locale !== "zh") return copy;
  const loc = locale as Loc;
  const kind = classifyDestinationSlug(slug);
  const routeJa = describeRouteJa(slug);
  const routeZh = describeRouteZh(slug);
  const place = resolvePlaceSeo(slug, placeHints);
  const baseKw = keywordsFor(kind, loc);
  const placeKw = loc === "ja" ? (place?.keywordsJa ?? []) : (place?.keywordsZh ?? []);
  const kw = dedupeKeywords([...baseKw, ...placeKw]).slice(0, 16);

  const tailJaFull =
    "早朝・深夜の便や荷物の多いご旅行も事前にご相談ください。通行料の扱いはお見積もりで明示します。";
  const tailJaShort = "早朝深夜も可。通行料はお見積もりで明示します。";
  const tailZhFull = "红眼航班、行李较多或多人出行可预约时一并说明；高速费等计费口径以确认为准。";
  const tailZhShort = "凌晨深夜可约；费用口径（含高速费等）预约时说明。";

  let metaTitle: string;
  let metaDescription: string;
  let linkTitle: string;
  let h1: string;

  if (loc === "ja") {
    metaTitle = `${routeJa}｜貸切空港送迎・深夜対応｜Kkebi`;
    metaDescription = place?.metaAccentJa
      ? `${routeJa}のドアツードア貸切送迎。${place.metaAccentJa} ${tailJaShort}`
      : `${routeJa}のドアツードア貸切送迎。${tailJaFull}`;
    linkTitle = gangnamLinkTitle(slug, loc, routeJa, routeZh) ?? routeJa.replace("から", " → ");
    h1 = `${routeJa}｜貸切ワゴン空港送迎`;
  } else {
    metaTitle = `${routeZh}专车接送｜仁川金浦·深夜凌晨｜Kkebi`;
    metaDescription = place?.metaAccentZh
      ? `${routeZh}门到门包车。${place.metaAccentZh} ${tailZhShort}`
      : `${routeZh}门到门包车。${tailZhFull}`;
    linkTitle = gangnamLinkTitle(slug, loc, routeJa, routeZh) ?? routeZh.replace("至", "→");
    h1 = `${routeZh}｜包车接送`;
  }

  const sections = copy.sections.map((s, idx) => ({
    ...s,
    heading:
      idx < (loc === "ja" ? JA_SECTION_HEADINGS.length : ZH_SECTION_HEADINGS.length)
        ? loc === "ja"
          ? JA_SECTION_HEADINGS[idx]!
          : ZH_SECTION_HEADINGS[idx]!
        : s.heading,
  }));

  return {
    ...copy,
    metaTitle,
    metaDescription,
    keywords: kw,
    linkTitle,
    h1,
    hero: {
      ...copy.hero,
      alt: loc === "ja" ? `${routeJa}貸切ワゴン送迎` : `${routeZh}包车接送`,
    },
    primaryCtaLabel: loc === "ja" ? "予約・お問い合わせ" : "预约与咨询",
    secondaryCtaLabel: loc === "ja" ? "料金について" : "费用说明",
    sections,
  };
}
