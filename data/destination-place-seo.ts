/**
 * 슬러그에 들어가는 지역 토큰(gangnam 등)에 대해 실제 외국인 검색·관광 명칭 alias·키워드를 보강합니다.
 * slug는 유지하고, 랜딩별로 seoPlaceHints로 덮어쓰기·추가 가능합니다.
 *
 * landing-pages.ts と循環参照しないよう、ここで AppLocale 互換のみ定義します。
 */
export type AppLocaleForHints = "ko" | "en" | "ja" | "zh";

export type LandingPageSeoPlaceHints = {
  aliases?: string[];
  searchKeywords?: Partial<Record<AppLocaleForHints, string[]>>;
  nearbyLandmarks?: Partial<Record<AppLocaleForHints, string[]>>;
};

type FaqPair = { q: string; a: string };

type PlaceProfile = {
  aliases: string[];
  searchKeywords: { ja: string[]; zh: string[]; en?: string[] };
  nearbyLandmarks: { ja: string[]; zh: string[] };
  /** メタ description に足す一文（観光テンプレ乱用なし・運用寄り） */
  intentMetaJa: string;
  intentMetaZh: string;
  faqJa: FaqPair;
  faqZh: FaqPair;
};

const PLACE_ORDER = ["gangnam", "myeongdong", "hongdae", "jamsil", "pangyo"] as const;
export type PlaceToken = (typeof PLACE_ORDER)[number];

export const PLACE_PROFILES: Record<PlaceToken, PlaceProfile> = {
  gangnam: {
    aliases: [
      "Gangnam",
      "Gangnam-gu",
      "江南",
      "カンナム",
      "COEX",
      "Samsung Station",
      "Samseong Station",
      "Teheran-ro",
      "Teheran Road",
    ],
    searchKeywords: {
      ja: [
        "カンナム 空港送迎",
        "COEX 仁川",
        "三成駅 空港",
        "江南駅 ピックアップ",
        "テヘラン路 ホテル",
        "貸切 江南",
      ],
      zh: ["江南接机", "COEX 仁川接送", "三成站 机场", "德黑兰路 酒店接送", "首尔江南 包车"],
      en: ["Gangnam airport transfer", "COEX ICN pickup", "Samseong Station van"],
    },
    nearbyLandmarks: {
      ja: ["COEX", "三成（サムソン）駅", "テヘラン路・江南駅のホテルエリア"],
      zh: ["COEX", "三成站", "德黑兰路商务区"],
    },
    intentMetaJa:
      "出張・展示会（COEX）・ホテル（三成・テヘラン路）・日程の詰むビジネス移動向け。住所・ゲート可否は予約時にすり合わせます。",
    intentMetaZh:
      "面向商务会展（COEX）、江南·三成酒店与紧凑行程；大厦门口或车道规则请在预约时确认。",
    faqJa: {
      q: "COEXや三成・テヘラン路のホテルまで指定できますか？",
      a: "はい。建物名・住所と乗降規則（ロータリー可否など）をご予約時にお知らせください。深夜・早朝便にも対応します。",
    },
    faqZh: {
      q: "可以到 COEX、三成或德黑兰路酒店接送吗？",
      a: "可以。预约时请提供准确地址与上下车位置是否允许临时停车；凌晨航班也可安排。",
    },
  },
  myeongdong: {
    aliases: ["Myeongdong", "Myeong-dong", "明洞", "ミョンドン", "Seoul shopping district"],
    searchKeywords: {
      ja: ["明洞 空港送迎", "ミョンドン ピックアップ", "明洞 ホテル 仁川", "観光 明洞 送迎"],
      zh: ["明洞接机", "首尔购物区接送", "明洞酒店 仁川"],
      en: ["Myeongdong airport transfer", "Seoul downtown pickup ICN"],
    },
    nearbyLandmarks: {
      ja: ["明洞商店街", "ソウル駅（メトロ接続）方面"],
      zh: ["明洞商业街", "首尔站换乘"],
    },
    intentMetaJa:
      "ショッピング・観光・市内ホテル泊に多いエリアです。道が狭い区間は乗降場所を事前に決めるとスムーズです。",
    intentMetaZh:
      "购物、观光与市中心酒店常见目的地；狭路区域建议预约时确认上下车点。",
    faqJa: {
      q: "明洞の狭い路地でも迎えに来られますか？",
      a: "車両サイズと道路規制によります。ホテル名・住所と地図ピンがあると安全側に調整できます。",
    },
    faqZh: {
      q: "明洞小路或步行街附近也能接送吗？",
      a: "取决于车型与交通管制。提供酒店名称、地址或地图定位便于安排合规上下车点。",
    },
  },
  hongdae: {
    aliases: ["Hongdae", "Hongik University", "Hongik Univ", "弘大", "ホンデ", "Hongdae Station"],
    searchKeywords: {
      ja: ["ホンデ 空港送迎", "弘大入口 仁川", "ホンデ ホステル", "夜便 ホンデ"],
      zh: ["弘大接机", "弘益大学接送", "首尔弘大 包车机场"],
      en: ["Hongdae airport transfer", "Hongik Univ ICN pickup"],
    },
    nearbyLandmarks: {
      ja: ["弘大入口駅", "延南洞・ゲストハウス密集エリア（エリアにより規制あり）"],
      zh: ["弘大入口站", "延南洞·民宿集中区（部分路段限行）"],
    },
    intentMetaJa:
      "深夜到着・ゲストハウス・カフェ街エリアが多いです。終電後の移動や小型路地は乗降場所を事前に決めると安心です。",
    intentMetaZh:
      "深夜抵达、民宿与巷弄区域较多；末班车后用车建议提前预约并确认上下车点。",
    faqJa: {
      q: "終電後のホンデ着でも空港から迎えに来てもらえますか？",
      a: "はい。フライト時刻と住所をお知らせください。歩道や一方通行に合わせて待ち合わせを調整します。",
    },
    faqZh: {
      q: "深夜到弘大还可以安排接机吗？",
      a: "可以。请提供航班时间与详细地址；我们会按单行线与步行区域约定汇合点。",
    },
  },
  jamsil: {
    aliases: ["Jamsil", "蚕室", "チャムシル", "Lotte World", "Jamsil Sports Complex", "Seokchon Lake"],
    searchKeywords: {
      ja: ["蚕室 空港送迎", "ロッテワールド 仁川", "チャムシル 家族", "コンサート 蚕室"],
      zh: ["蚕室接送", "乐天世界 机场", "蚕室家庭包车", "演唱会场馆接送"],
      en: ["Jamsil airport transfer", "Lotte World ICN van"],
    },
    nearbyLandmarks: {
      ja: ["蚕室総合運動場", "ロッテワールドタワー（乗降ルールは予約時確認）"],
      zh: ["蚕室综合运动场", "乐天世界塔（下车规则预约时确认）"],
    },
    intentMetaJa:
      "ロッテワールド・家族旅行・スポーツ観戦・イベント来日に多いエリアです。荷物が多い日程は車両クラスを先に決めるとスムーズです。",
    intentMetaZh:
      "乐天世界、亲子行程与赛事演唱会常见；行李多或儿童座椅需求建议在预约时一并说明。",
    faqJa: {
      q: "ロッテワールド周辺の混雑日でも指定時間に合わせられますか？",
      a: "できるだけ余裕を見たお迎え時刻をご提案します。イベント日は道路規制情報があると調整しやすいです。",
    },
    faqZh: {
      q: "乐天世界周边堵车日也能准时接送吗？",
      a: "会预留缓冲并建议提前出发；若有大活动或封路信息请一并告知以便改路线或汇合点。",
    },
  },
  pangyo: {
    aliases: [
      "Pangyo",
      "板桥",
      "パンギョ",
      "Pangyo Techno Valley",
      "Seongnam",
      "Bundang line",
    ],
    searchKeywords: {
      ja: [
        "パンギョ 空港送迎",
        "テクノバレー 出張 仁川",
        "城南エリア 空港",
        "パンギョ駅 ピックアップ",
      ],
      zh: ["板桥接机", "板桥科技园包车", "城南 机场接送", "泛谷 IT 园区"],
      en: ["Pangyo Techno Valley transfer", "Seongnam ICN van"],
    },
    nearbyLandmarks: {
      ja: ["판교테크노밸리", "판교역（新盆唐線）"],
      zh: ["板桥科技谷", "板桥站（新盆唐线）"],
    },
    intentMetaJa:
      "IT・出張・オフィス密集エリアです。勤務地住所と駐停可否を予約時に揃えるとスムーズです。",
    intentMetaZh:
      "科技园区与商务出行集中；请预约时提供写字楼地址与是否允许临停上下客。",
    faqJa: {
      q: "판교 테크노밸리のオフィスビル前まで可能ですか？",
      a: "ロータリー・駐停の可否はビルごとに異なります。正式名称と入口をお知らせください。",
    },
    faqZh: {
      q: "可以到板桥科技谷写字楼门口吗？",
      a: "各大厦转盘与临停规则不同；请提供楼盘正式名称与常用入口以便合规停靠。",
    },
  },
};

function dedupeStrings(items: string[]): string[] {
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

export function detectPlaceTokens(slug: string): PlaceToken[] {
  const found: PlaceToken[] = [];
  for (const token of PLACE_ORDER) {
    if (slug.includes(token)) found.push(token);
  }
  return found;
}

export type ResolvedPlaceSeo = {
  primaryToken: PlaceToken | null;
  aliases: string[];
  keywordsJa: string[];
  keywordsZh: string[];
  keywordsEn: string[];
  metaAccentJa: string;
  metaAccentZh: string;
  faqJa: FaqPair | null;
  faqZh: FaqPair | null;
};

function mergeHintLandmarks(
  baseJa: string,
  baseZh: string,
  hints?: LandingPageSeoPlaceHints,
): { ja: string; zh: string } {
  let ja = baseJa;
  let zh = baseZh;
  const hj = hints?.nearbyLandmarks?.ja;
  const hz = hints?.nearbyLandmarks?.zh;
  if (hj?.length) {
    ja = `${ja} ${hj.slice(0, 2).join("・")}方面の指定も可能です。`;
  }
  if (hz?.length) {
    zh = `${zh} 亦可预约${hz.slice(0, 2).join("、")}一带上下车。`;
  }
  return { ja, zh };
}

export function resolvePlaceSeo(
  slug: string,
  hints?: LandingPageSeoPlaceHints,
): ResolvedPlaceSeo | null {
  const tokens = detectPlaceTokens(slug);
  const primary = tokens[0] ?? null;

  const prof = primary ? PLACE_PROFILES[primary] : null;

  let aliases: string[] = prof ? [...prof.aliases] : [];
  let keywordsJa: string[] = prof ? [...prof.searchKeywords.ja] : [];
  let keywordsZh: string[] = prof ? [...prof.searchKeywords.zh] : [];
  let keywordsEn: string[] = prof?.searchKeywords.en ? [...prof.searchKeywords.en] : [];

  let metaAccentJa = prof?.intentMetaJa ?? "";
  let metaAccentZh = prof?.intentMetaZh ?? "";
  const faqJa = prof?.faqJa ?? null;
  const faqZh = prof?.faqZh ?? null;

  if (hints?.aliases?.length) aliases = dedupeStrings([...aliases, ...hints.aliases]);
  if (hints?.searchKeywords?.ja?.length)
    keywordsJa = dedupeStrings([...keywordsJa, ...hints.searchKeywords.ja]);
  if (hints?.searchKeywords?.zh?.length)
    keywordsZh = dedupeStrings([...keywordsZh, ...hints.searchKeywords.zh]);
  if (hints?.searchKeywords?.en?.length)
    keywordsEn = dedupeStrings([...keywordsEn, ...hints.searchKeywords.en]);

  const accented = mergeHintLandmarks(metaAccentJa, metaAccentZh, hints);
  metaAccentJa = accented.ja;
  metaAccentZh = accented.zh;

  if (!primary && !aliases.length && !keywordsJa.length && !keywordsZh.length) {
    return null;
  }

  return {
    primaryToken: primary,
    aliases,
    keywordsJa,
    keywordsZh,
    keywordsEn,
    metaAccentJa,
    metaAccentZh,
    faqJa,
    faqZh,
  };
}

/** JA/ZH FAQ：地域意図が明確なとき先頭に差し込む（重複質問は入れない） */
export function mergePlaceFaqForLocale(
  faq: FaqPair[],
  slug: string,
  locale: string,
  hints?: LandingPageSeoPlaceHints,
): FaqPair[] {
  const resolved = resolvePlaceSeo(slug, hints);
  if (!resolved || (locale !== "ja" && locale !== "zh")) return faq;

  const extra = locale === "ja" ? resolved.faqJa : resolved.faqZh;
  if (!extra) return faq;
  if (faq.some((x) => x.q === extra.q)) return faq;
  return [extra, ...faq];
}
