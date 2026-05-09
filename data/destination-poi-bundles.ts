/**
 * 목적지 클러스터별 호텔·랜드마크·드롭오프 안내 — 호텔 단독 랜딩 없이 기존 구간 페이지에 컨텍스트만 제공
 */

export type PoiBundleId =
  | "gangnam_samsung_apgujeong"
  | "myeongdong_euljiro_cityhall"
  | "gwanghwamun_jongno"
  | "jamsil_songpa"
  | "hongdae_hapjeong_yeonnam"
  | "itaewon_hannam_yongsan"
  | "yeouido"
  | "seongsu_konkuk"
  | "pangyo_bundang"
  | "suwon_gwanggyo"
  | "songdo_incheon"
  | "yeongjong_airport_area"
  | "ilsan_goyang"
  | "north_gyeonggi";

export type AppLocalePoi = "ko" | "en" | "ja" | "zh";

export type LocalizedLine = Record<AppLocalePoi, string>;

/** 표시: ko는 한국어 공식명, en은 검색·병기용 영문 (화면에 locale별로 함께 노출) */
export type PoiQuad = { ko: string; en: string; ja: string; zh: string };

export type DestinationPoiBundle = {
  id: PoiBundleId;
  /** 메타 description 말미에 덧붙일 짧은 문장 (키워드 나열 금지, 1문장) */
  metaAccent: LocalizedLine;
  /** 리드 아래 자연스러운 한 문장 (없으면 빈 문자열) */
  ledeBridge: LocalizedLine;
  hotels: PoiQuad[];
  landmarks: PoiQuad[];
  /** 검색 보조 키워드 — 메타 keywords 병합용 (과다 삽입 방지로 소량) */
  searchBoostKeywords: Partial<Record<AppLocalePoi, string[]>>;
  recommendedDropoff: LocalizedLine;
  /** 칩 UI용 짧은 태그 */
  tags: Record<AppLocalePoi, string[]>;
  /** 같은 클러스터 관심 구간 내부링크 보강 */
  relatedSlugs: string[];
};

function L(ko: string, en: string, ja: string, zh: string): LocalizedLine {
  return { ko, en, ja, zh };
}

/** 호텔·랜드마크: ko 공식 한글명, en 브랜드·SEO용 영문 */
function P(ko: string, en: string, ja: string, zh: string): PoiQuad {
  return { ko, en, ja, zh };
}

export const DESTINATION_POI_BUNDLES: Record<PoiBundleId, DestinationPoiBundle> = {
  gangnam_samsung_apgujeong: {
    id: "gangnam_samsung_apgujeong",
    metaAccent: L(
      "코엑스·테헤란로 일대 호텔 로비 기준 픽업이 많습니다.",
      "Pickups often pin to COEX and Teheran-ro hotel lobbies.",
      "COEXやテヘラン通り沿いのホテルでは、ロビー前でのお迎えが多いです。",
      "常以 COEX、德黑兰路酒店大堂为接送汇合点。",
    ),
    ledeBridge: L(
      "전시·미팅 후 코엑스·파르나스·파크 하얏트 등 강남 코어 호텔로 바로 연결하는 일정을 자주 다룹니다.",
      "We regularly coordinate transfers tied to meetings and exhibitions toward COEX, Parnas, and core Gangnam hotels.",
      "展示会や会議の後にCOEX・パルナス・パークハイアットなど江南エリアのホテルへ直行するスケジュールをよく伺います。",
      "会展与商务会议结束后直达 COEX、帕纳斯、柏悦等江南核心酒店的行程很常见。",
    ),
    hotels: [
      P("조선 팰리스 강남", "Josun Palace Gangnam", "ジョスン パレス 江南", "首尔江南朝鲜王宫酒店"),
      P("그랜드 인터컨티넨탈 서울 파르나스", "Grand InterContinental Seoul Parnas", "グランドインターコンチネンタル ソウル パルナス", "首尔帕纳斯洲际大酒店"),
      P("인터컨티넨탈 서울 코엑스", "InterContinental Seoul COEX", "インターコンチネンタル ソウル COEX", "首尔 COEX 洲际酒店"),
      P("파크 하얏트 서울", "Park Hyatt Seoul", "パーク ハイアット ソウル", "首尔柏悦酒店"),
      P("안다즈 서울 강남", "Andaz Seoul Gangnam", "アンダーズ ソウル 江南", "首尔江南安达仕酒店"),
    ],
    landmarks: [
      P("코엑스", "COEX", "COEX・コエックス", "COEX 会展中心"),
      P("봉은사", "Bongeunsa", "奉恩寺（ポンウンサ）", "奉恩寺"),
      P("압구정 로데오", "Apgujeong Rodeo", "狎鴎亭ロデオ通り", "狎鸥亭罗迪奥街"),
      P("청담동", "Cheongdam-dong", "清潭洞（チョンダム）", "清潭洞"),
      P("삼성역", "Samsung Station", "三成駅（サムソン）", "三成站"),
      P("강남역", "Gangnam Station", "江南駅", "江南站"),
      P("신논현역", "Sinnonhyeon Station", "新論峴駅（シンノンヒョン）", "新论岘站"),
    ],
    searchBoostKeywords: {
      ko: ["코엑스 인천공항", "삼성역 픽업", "테헤란로 호텔 샌딩", "압구정 로데오 공항"],
      en: ["COEX airport transfer", "Samsung Station pickup", "Teheran-ro hotel van", "Apgujeong limo ICN"],
      ja: ["COEX 空港送迎", "三成駅 ピックアップ", "カンナム ホテル 仁川", "狎鴎亭 空港"],
      zh: ["COEX 仁川接送", "三成站接机", "江南酒店包车", "狎鸥亭机场"],
    },
    recommendedDropoff: L(
      "호텔 타워·지하 로비·회전교 통행 가능 여부를 예약 시 알려 주시면, 코엑스·무역센터·테헤란로 호텔 각각의 통행 규칙에 맞춰 하차 지점을 잡습니다.",
      "Share tower, lobby level, and whether your hotel allows brief curb stops—drop-offs align with COEX gates, Trade Tower loops, and Teheran-ro tower rules.",
      "タワー名・ロビー階・ロータリー可否をご予約時にお知らせください。COEXゲートやテヘラン通り沿いのタワー規則に合わせて降車地点を決めます。",
      "预约时请说明塔楼、大堂楼层及是否允许临停；下车点会配合 COEX、贸易中心塔与德黑兰路各楼宇规则。",
    ),
    tags: {
      ko: ["출장·전시", "코엑스", "호텔 로비 픽업", "비즈니스"],
      en: ["Business & MICE", "COEX", "Hotel lobby meet", "Corporate"],
      ja: ["出張・展示会", "COEX", "ホテルロビー", "ビジネス"],
      zh: ["商务会展", "COEX", "酒店大堂", "企业出行"],
    },
    relatedSlugs: [
      "incheon-airport-to-coex",
      "gangnam-to-incheon-airport",
      "incheon-airport-to-jamsil",
      "incheon-airport-to-pangyo",
    ],
  },

  myeongdong_euljiro_cityhall: {
    id: "myeongdong_euljiro_cityhall",
    metaAccent: L(
      "명동·소공·시청 인근 호텔 하차 시 차량 진입 규칙을 먼저 확인합니다.",
      "Hotel blocks around Myeongdong, Myeongdong Cathedral, and City Hall vary—pins follow access rules.",
      "明洞・市庁・ソウル駅周辺は車両進入規則が細かいので、予約時にピンをすり合わせます。",
      "明洞、市厅、首尔站周边车道规则细，预约时会确认上下车点。",
    ),
    ledeBridge: L(
      "롯데·웨스틴 조선·그라세리 등 시내 중심 호텔과 남대문·명동 쇼핑 동선을 묶어 이동하는 경우가 많습니다.",
      "Many rides combine Lotte, Westin Josun, Gracery, Namdaemun, and Myeongdong shopping corridors.",
      "ロッテ・ウェスティン・グラセリ等の都心ホテルと南大門・明洞ショッピングをまとめて動くケースが多いです。",
      "结合乐天、威斯汀朝昕、格拉斯丽等市中心酒店与南大门、明洞购物动线的需求很常见。",
    ),
    hotels: [
      P("롯데호텔 서울", "Lotte Hotel Seoul", "ロッテホテルソウル", "首尔乐天酒店"),
      P("웨스틴 조선 서울", "The Westin Josun Seoul", "ウェスティン チョスン ソウル", "首尔威斯汀朝鲜酒店"),
      P("호텔 그라세리 서울", "Hotel Gracery Seoul", "ホテル グラセリ ソウル", "格拉斯丽首尔酒店"),
      P("신라스테이 명동", "Shilla Stay Myeongdong", "新羅ステイ 明洞", "首尔明洞新罗舒泰酒店"),
    ],
    landmarks: [
      P("명동성당", "Myeongdong Cathedral", "明洞聖堂（ミョンドン）", "明洞圣堂"),
      P("명동 쇼핑거리", "Myeongdong Shopping Street", "明洞商店街", "明洞商业街"),
      P("을지로입구역", "Euljiro 1-ga Station", "乙支路1街駅", "乙支路1街站"),
      P("서울시청", "Seoul City Hall", "ソウル市庁", "首尔市厅"),
      P("남대문시장", "Namdaemun Market", "南大門市場", "南大门市场"),
      P("N서울타워", "N Seoul Tower", "Nソウルタワー", "N首尔塔"),
    ],
    searchBoostKeywords: {
      ko: ["명동 호텔 픽업", "을지로 인천공항", "남대문 콜밴", "시청역 공항"],
      en: ["Myeongdong hotel ICN", "Lotte Hotel Seoul transfer", "Namdaemun airport van", "Euljiro pickup"],
      ja: ["明洞 ホテル 仁川", "乙支路 空港送迎", "南大門 ピックアップ", "ミョンドン 貸切"],
      zh: ["明洞酒店接机", "乙支路仁川", "南大门包车", "乐天酒店接送"],
    },
    recommendedDropoff: L(
      "좁은 골목·보행자 우선 구역은 호텔 정문 맞은편 회전로나 지정 승하차 구역으로 안내하는 경우가 많습니다. 야간 쇼핑 후 이동 시에도 동선을 미리 고정합니다.",
      "Narrow lanes and pedestrian-first blocks often mean lobby-adjacent loops or hotel-approved bays—especially after evening shopping runs.",
      "狭い路地や歩行者優先エリアでは、ホテル正面のロータリーや指定乗降区に誘導することが多いです。",
      "窄巷与步行街区域多在酒店正门转盘或指定停靠点上下车，夜间购物返程也会提前固定路线。",
    ),
    tags: {
      ko: ["쇼핑·관광", "시내 호텔", "야간 이동", "첫 방문"],
      en: ["Shopping", "Downtown hotels", "Night arrivals", "First-time Seoul"],
      ja: ["買物・観光", "都心ホテル", "夜間移動", "初ソウル"],
      zh: ["购物观光", "市中心酒店", "夜间用车", "首次首尔"],
    },
    relatedSlugs: ["incheon-airport-to-hongdae", "incheon-airport-to-seoul-station", "incheon-airport-to-gangnam"],
  },

  gwanghwamun_jongno: {
    id: "gwanghwamun_jongno",
    metaAccent: L(
      "광화문·종로·DDP 일대는 행사일 통제에 따라 하차 위치가 달라질 수 있습니다.",
      "Gwanghwamun, Jongno, and DDP may shift drop-off pins during events.",
      "光化門・鐘路・DDPはイベント規制で降車地点が変わることがあります。",
      "光化门、钟路、东大门设计广场若有活动，下车点可能调整。",
    ),
    ledeBridge: L(
      "궁궐·한옥마을·인사동 관광 일정과 종로 비즈니스 호텔 이동을 같은 날 연결하는 경우가 있습니다.",
      "Same-day links between palace tours, Bukchon, Insadong, and Jongno business hotels are common.",
      "宮殿・北村・仁寺洞観光と鐘路ビジネスホテルを同日につなぐご利用もあります。",
      "宫殿、北村韩屋村、仁寺洞行程与钟路商务酒店同日衔接很常见。",
    ),
    hotels: [
      P("포시즌스 호텔 서울", "Four Seasons Hotel Seoul", "フォーシーズンズホテルソウル", "首尔四季酒店"),
      P("JW메리어트 동대문스퀘어 서울", "JW Marriott Dongdaemun Square Seoul", "JWマリオット 東大門スクエア", "首尔东大门广场JW万豪酒店"),
    ],
    landmarks: [
      P("경복궁", "Gyeongbokgung Palace", "景福宮（キョンボックン）", "景福宫"),
      P("광화문광장", "Gwanghwamun Square", "光化門広場", "光化门广场"),
      P("북촌한옥마을", "Bukchon Hanok Village", "北村韓屋村", "北村韩屋村"),
      P("인사동", "Insadong", "仁寺洞（インサドン）", "仁寺洞"),
      P("청계천", "Cheonggyecheon", "清渓川（チョンゲチョン）", "清溪川"),
      P("종로", "Jongno", "鐘路（チョンノ）", "钟路"),
      P("동대문디자인플라자(DDP)", "Dongdaemun Design Plaza (DDP)", "東大門デザインプラザ", "东大门设计广场"),
    ],
    searchBoostKeywords: {
      ko: ["광화문 인천공항", "종로 픽업", "DDP 공항 셔틀", "경복궁 관광 이동"],
      en: ["Gwanghwamun ICN transfer", "Jongno van pickup", "DDP airport ride", "Seoul palace tour transfer"],
      ja: ["光化門 空港送迎", "鐘路 ピックアップ", "DDP 仁川", "景福宮 観光"],
      zh: ["光化门接机", "钟路包车", "东大门设计广场接送", "景福宫旅游用车"],
    },
    recommendedDropoff: L(
      "광장·궁궐 앞 도로는 정차 규제가 잦습니다. 호텔명과 도보 접속 동선을 알려 주시면 통행 가능 지점으로 조정합니다.",
      "Plaza and palace fronts restrict standing traffic—share hotel name and walking approach so we pick compliant curb or lobby rules.",
      "広場・宮殿前は停車規制が多いです。ホテル名と徒歩動線をお知らせください。",
      "广场与宫门前常有限停；请提供酒店名称与步行路线以便选择合规停靠点。",
    ),
    tags: {
      ko: ["궁궐·한옥", "비즈니스 호텔", "문화 관광", "DDP 행사"],
      en: ["Palace & hanok", "Business hotels", "Culture tours", "DDP events"],
      ja: ["宮殿・韓屋", "ビジネスホテル", "文化観光", "DDPイベント"],
      zh: ["宫殿韩屋", "商务酒店", "文化观光", "DDP活动"],
    },
    relatedSlugs: ["incheon-airport-to-seoul-station", "incheon-airport-to-myeongdong", "incheon-airport-to-gangnam"],
  },

  jamsil_songpa: {
    id: "jamsil_songpa",
    metaAccent: L(
      "롯데월드·종합운동장 일정에는 행사 전후 교통이 몰려 여유 시각을 권장합니다.",
      "Lotte World and stadium events warrant extra buffer before concerts or games.",
      "ロッテワールド・総合運動場はイベント前後に渋滞しやすいので余裕をご提案します。",
      "乐天世界与综合运动场演出前后易拥堵，建议预留缓冲时间。",
    ),
    ledeBridge: L(
      "시그니엘·소피텔·롯데월드몰·올림픽공원 등 가족·콘서트 일정을 함께 묶는 경우가 많습니다.",
      "Families and concert-goers often bundle Signiel, Sofitel, Lotte World Mall, and Olympic Park on one ride plan.",
      "シグニエル・ソフィテル・ロッテワールドモール・オリンピック公園を家族・コンサートでまとめることが多いです。",
      "亲子与演唱会观众常把 Signiel、索菲特、乐天世界塔、奥林匹克公园排在同一天线路上。",
    ),
    hotels: [
      P("시그니엘 서울", "Signiel Seoul", "シグニエル ソウル", "首尔喜格尼尔酒店"),
      P("소피텔 앰배서더 서울", "Sofitel Ambassador Seoul", "ソフィテル アンバサダー ソウル", "首尔索菲特大使酒店"),
    ],
    landmarks: [
      P("롯데월드타워", "Lotte World Tower", "ロッテワールドタワー", "乐天世界塔"),
      P("롯데월드", "Lotte World", "ロッテワールド", "乐天世界"),
      P("롯데월드몰", "Lotte World Mall", "ロッテワールドモール", "乐天世界购物中心"),
      P("잠실종합운동장", "Jamsil Sports Complex", "蚕室総合運動場", "蚕室综合运动场"),
      P("올림픽공원", "Olympic Park", "オリンピック公園", "奥林匹克公园"),
      P("석촌호수", "Seokchon Lake", "石村湖（ソクチョン）", "石村湖"),
      P("KSPO돔(올림픽주경기장)", "KSPO Dome", "KSPOドーム（オリ主競）", "KSPO 体育馆（奥林匹克主竞技场）"),
    ],
    searchBoostKeywords: {
      ko: ["잠실 인천공항", "롯데월드 가족 픽업", "올림픽공원 콘서트 셔틀", "시그니엘 공항"],
      en: ["Jamsil ICN transfer", "Lotte World family van", "KSPO Dome shuttle", "Signiel pickup"],
      ja: ["蚕室 空港送迎", "ロッテワールド 家族", "KSPO コンサート", "シグニエル 仁川"],
      zh: ["蚕室接机", "乐天世界亲子", "KSPO演唱会接送", "喜格尼尔酒店"],
    },
    recommendedDropoff: L(
      "호텔 타워 로비·테마파크 게이트·경기장 게이트별로 최적 하차 지점이 다릅니다. 동반 어린이·유모차 여부를 알려 주세요.",
      "Tower lobbies, theme park gates, and stadium entrances each need different pins—note kids and strollers.",
      "ホテルタワー・テーマパークゲート・スタジアム入口で最適降車点が変わります。お子様・ベビーカーもお知らせください。",
      "酒店塔楼、乐园门口与场馆入口下车点不同；请说明儿童与婴儿车需求。",
    ),
    tags: {
      ko: ["가족·테마파크", "콘서트", "대형 쇼핑몰", "스포츠"],
      en: ["Family & theme park", "Concerts", "Mega mall", "Sports"],
      ja: ["家族・テーマパーク", "コンサート", "大型モール", "スポーツ"],
      zh: ["亲子乐园", "演唱会", "大型商场", "体育赛事"],
    },
    relatedSlugs: ["jamsil-to-incheon-airport", "incheon-airport-to-gangnam", "incheon-airport-to-coex"],
  },

  hongdae_hapjeong_yeonnam: {
    id: "hongdae_hapjeong_yeonnam",
    metaAccent: L(
      "홍대·합정·연남은 심야·주말 도보자 우선 구역이 많아 핀을 미리 고정합니다.",
      "Hongdae, Hapjeong, and Yeonnam rely on pre-pinned meets—especially late nights and weekends.",
      "弘大・合井・延南は深夜・週末に歩行者優先区域が多く、ピンを事前に決めます。",
      "弘大、合井、延南深夜与周末步行街多，需提前预约汇合点。",
    ),
    ledeBridge: L(
      "RYSE·L7 등 홍대 권역 호텔과 게스트하우스·카페 거리 이동을 한 번에 묶는 스케줄을 자주 맞춥니다.",
      "We often stitch RYSE, L7, guesthouses, and cafe lanes into one ride plan.",
      "RYSE・L7などホンデ（弘大）周辺のホステル・カフェ街をまとめたスケジュールが多いです。",
      "把 RYSE、L7 与民宿、咖啡街串在同一行程里很常见。",
    ),
    hotels: [
      P("라이즈 오토그래프 컬렉션", "RYSE, Autograph Collection", "ライズ オートグラフ コレクション", "首尔弘大RYSE酒店"),
      P("L7 홍대", "L7 Hongdae", "L7 ホンデ", "首尔弘大L7酒店"),
    ],
    landmarks: [
      P("홍대입구역", "Hongik University Station", "弘大入口駅", "弘大入口站"),
      P("홍대 거리", "Hongdae Street", "ホンデストリート", "弘大步行街"),
      P("연남동", "Yeonnam-dong", "延南洞（ヨンナム）", "延南洞"),
      P("합정역", "Hapjeong Station", "合井駅", "合井站"),
      P("망원시장", "Mangwon Market", "望遠市場", "望远市场"),
      P("경의선숲길", "Gyeongui Line Forest Park", "京義線林フォレストパーク", "京义线林荫公园"),
    ],
    searchBoostKeywords: {
      ko: ["홍대 공항 픽업", "합정 연남 셔틀", "홍익대역 미팅", "게스트하우스 인천"],
      en: ["Hongdae ICN pickup", "Hapjeong shuttle", "Hongik Univ Station meet", "guesthouse transfer"],
      ja: ["ホンデ 空港送迎", "合井 仁川", "弘大入口駅", "ゲストハウス"],
      zh: ["弘大接机", "合井接送", "弘益大学站", "民宿包车"],
    },
    recommendedDropoff: L(
      "숙소 골목 폭·일방통행 여부를 알려 주시면 가장 가까운 통행 가능 지점으로 안내합니다. 공연·야간 일정은 종료 시각까지 함께 적어 주세요.",
      "Share alley width rules and one-way restrictions—we pick the closest compliant pin. Add show end times for night plans.",
      "路地の幅・一方通行をお知らせください。公演・夜の予定は終演時刻もご記入ください。",
      "请说明巷宽与单行线；若有演出请写明预计结束时间。",
    ),
    tags: {
      ko: ["K-컬처", "게스트하우스", "야간 공연", "연남·합정"],
      en: ["K-culture", "Guesthouses", "Late gigs", "Yeonnam & Hapjeong"],
      ja: ["Kカルチャー", "ゲストハウス", "深夜ライブ", "延南・合井"],
      zh: ["韩流文化", "民宿", "深夜演出", "延南合井"],
    },
    relatedSlugs: ["incheon-airport-to-myeongdong", "incheon-airport-to-seongsu", "gangnam-to-incheon-airport"],
  },

  itaewon_hannam_yongsan: {
    id: "itaewon_hannam_yongsan",
    metaAccent: L(
      "이태원·한남·용산은 언덕·일방 도로가 많아 호텔 게이트별로 하차 규칙이 다릅니다.",
      "Itaewon, Hannam, and Yongsan have steep one-way rules—drop-offs vary by hotel gate.",
      "梨泰院・漢南・龍山は坂と一方通行が多く、ホテルゲートごとに降車ルールが異なります。",
      "梨泰院、汉南、龙山坡路与单行多，各酒店门口规则不同。",
    ),
    ledeBridge: L(
      "몬드리안·그랜드 하얏트 등 언덕 위 호텔과 용산역·전쟁기념관·국립중앙박물관 동선을 묶는 예약이 이어집니다.",
      "Bookings often chain Mondrian, Grand Hyatt on the hill with Yongsan Station, War Memorial, or National Museum days.",
      "モンドリアン・グランドハイアットと龍山駅・戦争記念館・国立中央博物館をつなぐご予約が続きます。",
      "蒙德里安、君悦与龙山站、战争纪念馆、国立中央博物馆的串联行程较多。",
    ),
    hotels: [
      P("몬드리안 서울 이태원", "Mondrian Seoul Itaewon", "モンドリアン ソウル イテウォン", "首尔梨泰院蒙德里安酒店"),
      P("그랜드 하얏트 서울", "Grand Hyatt Seoul", "グランド ハイアット ソウル", "首尔君悦酒店"),
    ],
    landmarks: [
      P("이태원 거리", "Itaewon Street", "イテウォンストリート", "梨泰院商业街"),
      P("한남동", "Hannam-dong", "漢南洞（ハンナム）", "汉南洞"),
      P("남산", "Namsan", "南山（ナムサン）", "南山"),
      P("용산역", "Yongsan Station", "龍山駅", "龙山站"),
      P("전쟁기념관", "War Memorial of Korea", "韓国戦争記念館", "韩国战争纪念馆"),
      P("국립중앙박물관", "National Museum of Korea", "国立中央博物館", "国立中央博物馆"),
    ],
    searchBoostKeywords: {
      ko: ["이태원 인천공항", "한남동 픽업", "용산역 셔틀", "그랜드하얏트 공항"],
      en: ["Itaewon ICN transfer", "Hannam pickup", "Yongsan Station van", "Grand Hyatt Seoul airport"],
      ja: ["イテウォン 仁川", "ハンナム ピックアップ", "龍山駅 空港", "グランドハイアット"],
      zh: ["梨泰院接机", "汉南用车", "龙山站包车", "君悦酒店接送"],
    },
    recommendedDropoff: L(
      "언덕 위 호텔은 로비층·포트코치 가능 여부를 확인합니다. 용산역 환승 동선은 역 출구 번호를 알려 주시면 맞춥니다.",
      "Hilltop hotels need lobby level and coach clearance. For Yongsan Station transfers, share exit numbers.",
      "丘の上のホテルはロビー階・コーチ可否を確認します。龍山駅は出口番号をお知らせください。",
      "山上酒店需确认大堂层与大巴可否停靠；龙山站请说明出口编号。",
    ),
    tags: {
      ko: ["국제가", "대사관가", "박물관·기념관", "야경"],
      en: ["Global dining", "Embassy row", "Museums", "Night views"],
      ja: ["国際色", "大使館街", "博物館", "夜景"],
      zh: ["国际餐饮", "使馆区", "博物馆", "夜景"],
    },
    relatedSlugs: ["incheon-airport-to-myeongdong", "incheon-airport-to-hongdae", "incheon-airport-to-gangnam"],
  },

  yeouido: {
    id: "yeouido",
    metaAccent: L(
      "여의도 금융·방송·쇼핑 몰은 출입구별 통행이 달라 건물명을 함께 적어 주세요.",
      "Yeouido towers and malls differ by entrance—add building names.",
      "汝矣島のオフィス・モールは入口ごとに動線が異なるのでビル名をご記入ください。",
      "汝矣岛楼宇与商场出入口不同，请写明大厦名称。",
    ),
    ledeBridge: L(
      "페어몬트·콘래드·더현대 등 여의도 핵심과 국회·한강공원 이동을 같은 날 묶는 출장이 잦습니다.",
      "Fairmont, Conrad, The Hyundai Seoul often pair with Assembly or river park legs on business days.",
      "フェアモント・コンラッド・ザ現代ソウルを国会・漢江公園と同日につなぐ出張が多いです。",
      "费尔蒙、康莱德、现代首尔常与国会、汉江公园安排在同一天。",
    ),
    hotels: [
      P("페어몬트 앰배서더 서울", "Fairmont Ambassador Seoul", "フェアモント アンバサダー ソウル", "首尔费尔蒙酒店"),
      P("콘래드 서울", "Conrad Seoul", "コンラッド ソウル", "首尔康莱德酒店"),
    ],
    landmarks: [
      P("더현대 서울", "The Hyundai Seoul", "ザ・ヒュンダイ ソウル", "现代首尔百货"),
      P("IFC몰", "IFC Mall", "IFCモール", "IFC商场"),
      P("여의도공원", "Yeouido Park", "汝矣島公園", "汝矣岛公园"),
      P("국회의사당", "National Assembly", "国会議事堂", "韩国国会"),
      P("여의나루역", "Yeouinaru Station", "汝矣渡口駅", "汝矣渡口站"),
      P("여의도 한강공원", "Han River Park (Yeouido)", "漢江公園（汝矣島）", "汉江公园（汝矣岛段）"),
    ],
    searchBoostKeywords: {
      ko: ["여의도 인천공항", "더현대 픽업", "IFC 셔틀", "국회대로 공항"],
      en: ["Yeouido ICN transfer", "The Hyundai Seoul pickup", "IFC mall van", "National Assembly ride"],
      ja: ["汝矣島 空港送迎", "ザ現代ソウル", "IFC 仁川", "国会議事堂"],
      zh: ["汝矣岛接机", "现代首尔百货", "IFC包车", "国会大厦用车"],
    },
    recommendedDropoff: L(
      "지하 연결로가 있는 건물은 지상·지하 중 어느 층에서 만날지 정합니다. 야간에는 여의도루 상대적 여유가 있으나 행사일은 달라질 수 있습니다.",
      "Connected basements mean choosing street vs concourse meets. Evenings are calmer unless major events run.",
      "地下連絡通路がある場合は、地上と地下のどちらで待ち合わせするか決めます。夜間は比較的すいていますが、大規模イベント時は変わることがあります。",
      "有地下连廊的楼宇需约定地面或地下汇合层；大型活动日除外夜间相对顺畅。",
    ),
    tags: {
      ko: ["금융·방송", "대형몰", "한강", "출장"],
      en: ["Finance & media", "Flagship mall", "Riverfront", "Business"],
      ja: ["金融・メディア", "大型モール", "漢江", "出張"],
      zh: ["金融媒体", "旗舰商场", "汉江", "商务"],
    },
    relatedSlugs: ["incheon-airport-to-gangnam", "gangnam-to-incheon-airport", "incheon-airport-to-seoul-station"],
  },

  seongsu_konkuk: {
    id: "seongsu_konkuk",
    metaAccent: L(
      "성수 카페 거리·커먼그라운드 일대는 좁은 도로가 많아 승하차 구간을 미리 고정합니다.",
      "Seongsu cafe streets and Common Ground need pinned curb windows.",
      "聖水カフェ街・カモングラウンドは狭い道路が多く、乗降ゾーンを事前に決めます。",
      "圣水咖啡街、Common Ground 一带道路窄，会提前预约停靠段。",
    ),
    ledeBridge: L(
      "성수·건대·뚝섬·서울숲을 묶은 주말 나들이·팝업 일정과 공항 이동을 연결합니다.",
      "Weekend pop-ups linking Seongsu, Konkuk, Ttukseom, and Seoul Forest often end with an airport leg.",
      "聖水・建大・トゥクソム・ソウルの森をまとめた週末ポップアップの後に空港へ、という動きもあります。",
      "周末把圣水、建大、纛岛、首尔森林串在一起后直奔机场的需求常见。",
    ),
    hotels: [],
    landmarks: [
      P("성수동", "Seongsu-dong", "聖水洞（ソンス）", "圣水洞"),
      P("서울숲", "Seoul Forest", "ソウルの森", "首尔林"),
      P("커먼그라운드", "Common Ground", "カモングラウンド", "Common Ground 集装箱商场"),
      P("건대입구역", "Konkuk University Station", "建大入口駅", "建大入口站"),
      P("뚝섬역", "Ttukseom Station", "トゥクソム駅", "纛岛站"),
      P("성수 카페거리", "Seongsu Cafe Street", "聖水カフェ街", "圣水咖啡街"),
    ],
    searchBoostKeywords: {
      ko: ["성수 인천공항", "서울숲 픽업", "건대 공항 셔틀", "성수동 콜밴"],
      en: ["Seongsu ICN transfer", "Seoul Forest pickup", "Konkuk Univ shuttle", "Common Ground van"],
      ja: ["聖水 空港送迎", "ソウルの森", "建大入口", "カモングラウンド"],
      zh: ["圣水接机", "首尔林", "建大入口", "Common Ground"],
    },
    recommendedDropoff: L(
      "팝업·전시장 인근은 임시 통제가 있을 수 있습니다. 목적지 링크나 지도 핀을 남겨 주시면 가장 가까운 통행 구간으로 맞춥니다.",
      "Pop-ups may add temp controls—share map pins so we align with the nearest legal stop.",
      "ポップアップ時は規制が入ることがあります。地図ピンをお知らせください。",
      "快闪活动可能有临时管制；请留下地图定位以便就近合规停靠。",
    ),
    tags: {
      ko: ["성수 핫플", "서울숲", "팝업", "주말"],
      en: ["Seongsu hotspots", "Seoul Forest", "Pop-ups", "Weekends"],
      ja: ["聖水トレンド", "ソウルの森", "ポップアップ", "週末"],
      zh: ["圣水热点", "首尔林", "快闪", "周末"],
    },
    relatedSlugs: ["incheon-airport-to-jamsil", "incheon-airport-to-gangnam", "incheon-airport-to-hongdae"],
  },

  pangyo_bundang: {
    id: "pangyo_bundang",
    metaAccent: L(
      "판교 테크노밸리·캠퍼스 구역은 출입구와 주차장 게이트별로 픽업 동선이 갈립니다.",
      "Pangyo Techno Valley campuses vary by gate and parking rules.",
      "パンギョ・テクノバレーはキャンパスゲートごとにピックアップ動線が分かれます。",
      "板桥科技谷各园区门口与停车场规则不同，接送需对齐闸口。",
    ),
    ledeBridge: L(
      "그래비티·코트야드 등 판교 숙소와 현대백화점·정자·분당 방향 출장 일정을 장거리 공항 동선과 자주 연결합니다.",
      "Gravity, Courtyard stays plus Hyundai Department Store, Jeongja, Bundang legs often pair with long ICN runs.",
      "グラビティ・コートヤードと現代百貨・亭子・盆唐の出張を長距離空港とつなぐことが多いです。",
      "Gravity、万怡与现代百货、亭子、盆唐的出差行程常与远程机场线衔接。",
    ),
    hotels: [
      P("그래비티 서울 판교", "Gravity Seoul Pangyo", "グラビティ ソウル パンギョ", "板桥Gravity酒店"),
      P("코트야드 서울 판교", "Courtyard Seoul Pangyo", "コートヤード ソウル パンギョ", "首尔板桥万怡酒店"),
    ],
    landmarks: [
      P("판교테크노밸리", "Pangyo Techno Valley", "パンギョテクノバレー", "板桥科技谷"),
      P("현대백화점 판교", "Hyundai Department Store Pangyo", "現代百貨店 パンギョ", "现代百货板桥店"),
      P("판교역", "Pangyo Station", "パンギョ駅", "板桥站"),
      P("정자역", "Jeongja Station", "ジョンジャ駅", "亭子站"),
      P("분당", "Bundang", "盆唐（プンダン）", "盆唐"),
      P("서현역", "Seohyeon Station", "ソヒョン駅", "书岘站"),
    ],
    searchBoostKeywords: {
      ko: ["판교 인천공항", "테크노밸리 픽업", "분당 출장 샌딩", "동탄 공항"],
      en: ["Pangyo ICN transfer", "Techno Valley pickup", "Bundang business van", "Dongtan airport"],
      ja: ["パンギョ 仁川", "テクノバレー", "盆唐 出張", "パンギョ駅"],
      zh: ["板桥接机", "科技谷", "盆唐出差", "板桥站"],
    },
    recommendedDropoff: L(
      "사업장 주소·건물 동·지하주차 연결 여부를 알려 주시면 캠퍼스 내부 통행로를 우선합니다. 야간 출국은 고속 혼잡을 반영해 출발 시각을 제안합니다.",
      "Share building wings and basement links—we prioritize internal campus drives. Night flights bake in highway variability.",
      "棟名・地下駐車場連絡の有無をお知らせください。夜間出国は高速渋滞を織り込みます。",
      "请提供楼号与是否连通地下停车场；夜间航班会考虑高速拥堵建议出发时刻。",
    ),
    tags: {
      ko: ["IT·바이오", "출장", "판교 캠퍼스", "경기 남부"],
      en: ["Tech & bio", "Business travel", "Pangyo campus", "Southern Gyeonggi"],
      ja: ["IT・バイオ", "出張", "パンギョキャンパス", "京畿南部"],
      zh: ["科技生物", "出差", "板桥园区", "京畿南部"],
    },
    relatedSlugs: ["pangyo-to-incheon-airport", "dongtan-to-incheon-airport", "incheon-airport-to-suwon"],
  },

  suwon_gwanggyo: {
    id: "suwon_gwanggyo",
    metaAccent: L(
      "수원·광교·영통·삼성 디지털시티 일대는 산업단지와 주거지가 섞여 정문 기준 픽업이 중요합니다.",
      "Suwon, Gwanggyo, Yeongtong, and Samsung Digital City mix plants and housing—gate-level pins matter.",
      "水原・光教・永通・サムスンデジタルシティは工場と住宅が混在し、正門基準が重要です。",
      "水原、光教、永通、三星数字城厂区与住宅交错，正门汇合很重要。",
    ),
    ledeBridge: L(
      "코트야드 수원·컨벤션센터·갤러리아 광교·화성행궁 일정을 출장·가족 여행에 맞춰 연결합니다.",
      "Courtyard Suwon, convention center, Galleria Gwanggyo, and Hwaseong tours mix business and family legs.",
      "コートヤード水原・コンベンション・ギャラリア光教・華城行宮を出張と家族旅行でつなぐことがあります。",
      "万怡水原、会议中心、Galleria光教、华城行宫常与商务或家庭行程结合。",
    ),
    hotels: [P("코트야드 바이 메리어트 수원", "Courtyard by Marriott Suwon", "コートヤード バイ マリオット 水原", "水原万怡酒店")],
    landmarks: [
      P("수원컨벤션센터", "Suwon Convention Center", "水原コンベンションセンター", "水原会议中心"),
      P("갤러리아 광교", "Galleria Gwanggyo", "ギャラリア光教", "Galleria光教"),
      P("광교호수공원", "Gwanggyo Lake Park", "光教湖水公園", "光教湖水公园"),
      P("수원역", "Suwon Station", "水原駅", "水原站"),
      P("수원화성", "Hwaseong Fortress", "水原華城", "水原华城"),
      P("영통", "Yeongtong", "永通（ヨントン）", "永通"),
      P("삼성 디지털시티", "Samsung Digital City", "サムスンデジタルシティ", "三星数字城"),
    ],
    searchBoostKeywords: {
      ko: ["수원 인천공항", "광교 픽업", "영통 셔틀", "삼성디지털시티 공항"],
      en: ["Suwon ICN transfer", "Gwanggyo pickup", "Samsung Digital City van", "Yeongtong shuttle"],
      ja: ["水原 仁川", "光教 ピックアップ", "サムスンデジタルシティ", "華城"],
      zh: ["水原接机", "光教", "三星数字城", "华城"],
    },
    recommendedDropoff: L(
      "기업 단지는 보안 게이트 안내가 필요할 수 있습니다. 방문 목적·담당자 연락처가 있으면 함께 알려 주세요.",
      "Industrial gates may need security clearance—share visit purpose if required.",
      "企業団地はゲート手続きが必要な場合があります。訪問目的をお知らせください。",
      "产业园区可能需要门卫手续；如有对接人请一并提供。",
    ),
    tags: {
      ko: ["제조·IT 단지", "대학·연구", "가족 여행", "화성 관광"],
      en: ["Industrial & IT", "Universities", "Family trips", "Hwaseong heritage"],
      ja: ["製造・IT団地", "大学・研究", "家族旅行", "華城観光"],
      zh: ["制造科技园区", "高校科研", "亲子游", "华城游览"],
    },
    relatedSlugs: ["suwon-to-incheon-airport", "dongtan-to-incheon-airport", "incheon-airport-to-pangyo"],
  },

  songdo_incheon: {
    id: "songdo_incheon",
    metaAccent: L(
      "송도 컨벤시아·트리플스트리트·센트럴파크 일대는 행사장 주변 교통이 몰릴 수 있습니다.",
      "Songdo Convensia and Triple Street areas spike around conventions.",
      "ソンドコンベンシア・トリプルストリート・セントラルパークはイベント時に混雑します。",
      "松岛会展中心、Triple Street、中央公园大型活动期间易拥堵。",
    ),
    ledeBridge: L(
      "셰라톤·오크우드 등 숙소와 컨벤시아 전시·국제회의 일정을 묶어 인천공항·김포와 연결합니다.",
      "Sheraton, Oakwood stays tie to Convensia trade shows and ICN/GMP legs.",
      "シェラトン・オークウッドとコンベンシア展示・国際会議を仁川・金浦につなぎます。",
      "喜来登、橡树与会展中心展会及仁川、金浦机场线衔接。",
    ),
    hotels: [
      P("쉐라톤 그랜드 인천", "Sheraton Grand Incheon", "シェラトン グランド インチョン", "仁川喜来登大酒店"),
      P("오크우드 프리미어 인천", "Oakwood Premier Incheon", "オークウッド プレミア インチョン", "仁川奥克伍德豪景酒店"),
    ],
    landmarks: [
      P("송도 컨벤시아", "Songdo Convensia", "ソンドコンベンシア", "松岛国际会展中心"),
      P("송도 센트럴파크", "Songdo Central Park", "ソンドセントラルパーク", "松岛中央公园"),
      P("트리플스트리트", "Triple Street", "トリプルストリート", "Triple Street"),
      P("현대프리미엄아울렛 송도", "Hyundai Premium Outlet Songdo", "ヒュンダイプレミアムソンド", "现代奥特莱斯松岛店"),
      P("인천대학교", "Incheon National University", "仁川大学（インチョン）", "仁川大学"),
      P("인천국제공항", "Incheon International Airport (ICN)", "仁川国際空港（ICN）", "仁川国际机场（ICN）"),
    ],
    searchBoostKeywords: {
      ko: ["송도 인천공항", "컨벤시아 픽업", "triple street 셔틀", "중국어 예약 송도"],
      en: ["Songdo ICN transfer", "Convensia pickup", "Triple Street shuttle", "Incheon National Univ"],
      ja: ["ソンド 仁川空港", "コンベンシア", "トリプルストリート", "仁川大学"],
      zh: ["松岛接机", "会展中心", "Triple Street", "仁川大学"],
    },
    recommendedDropoff: L(
      "전시 부스 동선·짐 적재 시간을 알려 주시면 하차 후 이동 시간을 함께 고려합니다. 송도는 신도로가 많아 핀 정확도가 중요합니다.",
      "Share booth logistics—we factor loading time. Songdo’s grid rewards precise pins.",
      "ブース動線・荷積み時間をお知らせください。ソンドは道路網が新しくピン精度が重要です。",
      "请说明展台动线与装卸时间；松岛路网新、定位要准。",
    ),
    tags: {
      ko: ["국제회의", "전시", "송도 신도시", "공항 근접"],
      en: ["Conventions", "Trade shows", "Smart city", "Near ICN"],
      ja: ["国際会議", "展示", "ソンド新都市", "空港近接"],
      zh: ["国际会议", "展会", "松岛新城", "近机场"],
    },
    relatedSlugs: ["incheon-airport-to-seoul", "incheon-vip-airport-service", "incheon-airport-to-yeouido"],
  },

  yeongjong_airport_area: {
    id: "yeongjong_airport_area",
    metaAccent: L(
      "영종·을왕리 리조트 이동은 야간·새벽 편이 많아 도착 게이트와 숙소 체크인 시간을 함께 적어 주세요.",
      "Yeongjong and Eulwang resort runs skew late-night—note arrival gates and hotel check-in.",
      "永宗・乙旺里リゾートは深夜便が多く、ゲートとチェックイン時刻をご記入ください。",
      "永宗、乙旺里度假村深夜航班多，请写明到达口与入住时间。",
    ),
    ledeBridge: L(
      "파라다이스시티·인스파이어·네스트 등 리조트 체크인과 터미널 간 이동을 한 번에 묶습니다.",
      "Paradise City, Inspire, Nest resort check-ins pair with terminal hops.",
      "パラダイスシティ・インスパイア・ネストなどリゾートチェックインとターミナルをつなぎます。",
      "天堂城、迎仕柏、Nest 等度假村入住与航站楼接送常合并安排。",
    ),
    hotels: [
      P("파라다이스시티", "Paradise City", "パラダイスシティ", "百乐达斯城"),
      P("인스파이어 엔터테인먼트 리조트", "Inspire Entertainment Resort", "インスパイアエンタテインメントリゾート", "迎仕柏度假城"),
      P("네스트호텔 인천", "Nest Hotel Incheon", "ネストホテルインチョン", "仁川Nest酒店"),
      P("더위크앤리조트", "The Week & Resort", "ザウィークアンドリゾート", "The Week度假村"),
    ],
    landmarks: [
      P("인천국제공항 제1여객터미널", "Incheon Airport Terminal 1", "仁川国際空港 第1ターミナル", "仁川国际机场1号航站楼"),
      P("인천국제공항 제2여객터미널", "Incheon Airport Terminal 2", "仁川国際空港 第2ターミナル", "仁川国际机场2号航站楼"),
      P("씨메르 스파", "Cimer Spa", "シーメール（ジメール）", "汐美水疗"),
      P("영종도", "Yeongjongdo", "永宗島（ヨンジョンド）", "永宗岛"),
      P("을왕리 해수욕장", "Eulwangri Beach", "乙旺里海水浴場", "乙旺里海滩"),
    ],
    searchBoostKeywords: {
      ko: ["영종도 공항 픽업", "파라다이스시티 셔틀", "인스파이어 리조트 인천", "터미널2 네스트호텔"],
      en: ["Yeongjong ICN resort transfer", "Paradise City shuttle", "Inspire Incheon van", "T2 Nest hotel"],
      ja: ["永宗島 空港", "パラダイスシティ", "インスパイア", "第2ターミナル"],
      zh: ["永宗岛接机", "百乐达斯城", "迎仕柏", "第二航站楼"],
    },
    recommendedDropoff: L(
      "리조트는 동선이 크게 갈립니다. 예약명·예약번호와 함께 픽업 게이트(T1/T2)를 명확히 적어 주세요.",
      "Resorts diverge widely—add reservation names and T1/T2 pickup gates.",
      "リゾートごとに動線が異なります。T1/T2と宿泊名義を明記してください。",
      "各度假村动线差异大；请注明 T1/T2 与预订姓名。",
    ),
    tags: {
      ko: ["리조트", "연박", "카지노·스파", "심야 도착"],
      en: ["Resort stays", "Multi-night", "Spa & gaming", "Late arrivals"],
      ja: ["リゾート", "連泊", "スパ", "深夜到着"],
      zh: ["度假村", "连住", "水疗娱乐", "深夜抵达"],
    },
    relatedSlugs: ["incheon-vip-airport-service", "dawn-airport-pickup", "family-airport-transfer"],
  },

  ilsan_goyang: {
    id: "ilsan_goyang",
    metaAccent: L(
      "킨텍스 전시 일정과 일산 호수공원·대화역 일대는 행사 전후 교통 변동이 큽니다.",
      "KINTEX show days shift traffic around Lake Park and Daehwa.",
      "KINTEX展示期間は湖水公園・大花駅周辺の交通が変わりやすいです。",
      "KINTEX 展会期间湖水公园、大化站周边车流变化大。",
    ),
    ledeBridge: L(
      "소노캄·라페스타·웨스턴돔 등 고양 시내 숙소와 전시·가족 나들이 동선을 묶습니다.",
      "Sono Calm, Lafesta, Western Dom visits combine fairs and family outings.",
      "ソノカーム・ラフェスタ・ウェスタンドームを展示と家族外出でまとめます。",
      "Sono Calm、Lafesta、Western Dom 常与展会和家庭出行合并。",
    ),
    hotels: [P("소노캄 고양", "Sono Calm Goyang", "ソノカーム 高陽", "高阳绍诺卡尔姆酒店")],
    landmarks: [
      P("킨텍스", "KINTEX", "KINTEX（キンテックス）", "韩国国际会展中心"),
      P("일산호수공원", "Ilsan Lake Park", "一山湖水公園（イルサン）", "一山湖水公园"),
      P("대화역", "Daehwa Station", "大花駅", "大化站"),
      P("라페스타", "Lafesta", "ラフェスタ", "Lafesta"),
      P("웨스턴돔", "Western Dom", "ウェスタンドーム", "Western Dom"),
      P("현대백화점 킨텍스점", "Hyundai Department Store Kintex", "現代百貨店 キンテックス", "现代百货KINTEX店"),
    ],
    searchBoostKeywords: {
      ko: ["킨텍스 인천공항", "일산 픽업", "고양 대화역 셔틀", "라페스타 공항"],
      en: ["KINTEX ICN transfer", "Ilsan pickup", "Daehwa Station van", "Lafesta shuttle"],
      ja: ["KINTEX 仁川", "一山 ピックアップ", "大花駅", "ラフェスタ"],
      zh: ["KINTEX接机", "一山", "大化站", "Lafesta"],
    },
    recommendedDropoff: L(
      "전시장 동·게이트 번호가 있으면 하차 후 도보 거리를 줄일 수 있습니다. 주말 일산 코스트몰 방문 일정도 함께 알려 주세요.",
      "Hall and gate numbers shorten walks after drop-off—note weekend mall runs too.",
      "ホール・ゲート番号があると降車後の徒歩が短くなります。",
      "展馆与门号可缩短步行；若有周末奥特莱斯行程请一并说明。",
    ),
    tags: {
      ko: ["전시·박람회", "가족 공원", "경기 북서부", "쇼핑몰"],
      en: ["Trade fairs", "Lake parks", "NW Gyeonggi", "Retail"],
      ja: ["展示会", "湖水公園", "京畿北西部", "ショッピング"],
      zh: ["展会", "湖滨公园", "京畿西北", "购物"],
    },
    relatedSlugs: ["incheon-airport-to-seoul", "uijeongbu-to-incheon-airport", "nowon-to-incheon-airport"],
  },

  north_gyeonggi: {
    id: "north_gyeonggi",
    metaAccent: L(
      "북부·동부 경기는 고속 구간이 길어 편도 사고·날씨 변수를 여유에 포함합니다.",
      "Northern routes carry longer highway legs—weather and incidents matter.",
      "北部・東部京畿は高速区間が長く、天候・事故の余裕を見ます。",
      "京畿北部线路高速占比高，会预留天气与事故缓冲。",
    ),
    ledeBridge: L(
      "의정부·노원·수유·창동·도봉·양주·남양주·구리·동두천·별내 등 생활 동선과 산업단지 출장을 장거리 공항 이동과 연결합니다.",
      "Daily routes across Uijeongbu, Nowon, Suyu, Changdong, Dobong, Yangju, Namyangju, Guri, Dongducheon, Byeollae tie to long ICN legs.",
      "議政府・蘆原・水逾・倉洞・道峰・楊州・南楊州・九里・東豆川・別内の生活圏と出張を長距離空港につなぎます。",
      "议政府、芦原、水逾、仓洞、道峰、杨州、南杨州、九里、东豆川、别内生活圈与远程机场衔接。",
    ),
    hotels: [],
    landmarks: [
      P("의정부역", "Uijeongbu Station", "議政府駅", "议政府站"),
      P("노원역", "Nowon Station", "蘆原駅", "芦原站"),
      P("창동역", "Chang-dong Station", "倉洞駅", "仓洞站"),
      P("도봉역", "Dobong Station", "道峰駅", "道峰站"),
      P("수유역", "Suyu Station", "水逾駅", "水逾站"),
      P("강북구", "Gangbuk-gu", "江北区（カンブク）", "江北区"),
      P("북한산", "Bukhansan", "北漢山（プカンサン）", "北汉山"),
      P("양주", "Yangju", "楊州（ヤンジュ）", "杨州"),
      P("동두천", "Dongducheon", "東豆川（トンドゥチョン）", "东豆川"),
      P("남양주", "Namyangju", "南楊州市", "南杨州市"),
      P("구리", "Guri", "九里市", "九里市"),
      P("별내", "Byeollae", "別内（ピョルネ）", "别内"),
    ],
    searchBoostKeywords: {
      ko: ["의정부 인천공항", "노원 공항 셔틀", "경기북부 콜밴", "양주 픽업"],
      en: ["Uijeongbu ICN transfer", "Nowon airport van", "Northern Gyeonggi shuttle", "Namyangju pickup"],
      ja: ["議政府 仁川", "ノウォン 空港", "京畿北部", "南楊州"],
      zh: ["议政府接机", "芦原包车", "京畿北部", "南杨州"],
    },
    recommendedDropoff: L(
      "신도시·구시가지 모두 건물 주소와 차량 진입 가능 여부를 적어 주세요. 새벽 배차는 첫차 전 도착을 함께 역산합니다.",
      "Pin addresses for both new towns and older blocks—dawn jobs back-plan before first metro.",
      "新都市・旧市街どちらも住所と進入可否をご記入ください。早朝は始発前に合わせます。",
      "新城与老城区都请写明地址与可否驶入；凌晨班次会配合首班地铁前抵达。",
    ),
    tags: {
      ko: ["생활권 이동", "산업단지", "장거리", "새벽 배차"],
      en: ["Residential commutes", "Industrial parks", "Long haul", "Dawn pickups"],
      ja: ["生活圏", "工業団地", "長距離", "早朝配車"],
      zh: ["生活通勤", "产业园区", "长途", "凌晨用车"],
    },
    relatedSlugs: [
      "uijeongbu-to-incheon-airport",
      "nowon-to-incheon-airport",
      "namyangju-to-incheon-airport",
      "guri-to-incheon-airport",
    ],
  },
};

export function resolvePoiBundleId(slug: string): PoiBundleId | null {
  const s = slug.toLowerCase();

  if (
    /yeongjong|eulwang|paradise|inspire|cimer|nest-hotel|eulwangri|youngjong|week-and-resort/.test(s)
  ) {
    return "yeongjong_airport_area";
  }
  if (/songdo|convensia|triple-street|oakwood-premier|sheraton-grand-incheon|songdo-central/.test(s)) {
    return "songdo_incheon";
  }
  if (/ilsan|goyang|kintex|daehwa|lafesta|western-dom|hyundai.*kintex|sono-calm/.test(s)) {
    return "ilsan_goyang";
  }
  if (
    /uijeongbu|nowon|gangbuk|changdong|dobong|suyu|namyangju|guri|yangju|dongducheon|byeollae|byeolnae|bukhan|north-gyeonggi/.test(
      s,
    )
  ) {
    return "north_gyeonggi";
  }
  if (/suwon|gwanggyo|yeongtong|hwaseong|samsung-digital|digital-city/.test(s)) {
    return "suwon_gwanggyo";
  }
  if (/dongtan|pangyo|bundang|jeongja|seohyeon|techno-valley|pangyo/.test(s)) {
    return "pangyo_bundang";
  }
  if (/yeouido|yeuido|ifc|national-assembly|han-river|fairmont|conrad-seoul|hyundai-seoul/.test(s)) {
    return "yeouido";
  }
  if (/itaewon|hannam|yongsan|mondrian|grand-hyatt-seoul|war-memorial|national-museum/.test(s)) {
    return "itaewon_hannam_yongsan";
  }
  if (/hongdae|hongik|hapjeong|yeonnam|mangwon|ryse|l7-hongdae/.test(s)) {
    return "hongdae_hapjeong_yeonnam";
  }
  if (/jamsil|songpa|seokchon|lotte-world|olympic|kspo|signiel|sofitel|ks-spo/.test(s)) {
    return "jamsil_songpa";
  }
  if (
    /gwanghwamun|jongno|insadong|bukchon|gyeongbok|cheonggyecheon|dongdaemun-design|ddp|four-seasons-seoul|jw-marriott-dongdaemun/.test(s)
  ) {
    return "gwanghwamun_jongno";
  }
  if (
    /myeongdong|euljiro|seoul-station|namdaemun|city-hall|lotte-hotel|westin-josun|gracery|shilla-stay/.test(s)
  ) {
    return "myeongdong_euljiro_cityhall";
  }
  if (/seongsu|konkuk|ttukseom|common-ground|seoul-forest/.test(s)) {
    return "seongsu_konkuk";
  }
  if (/gangnam|coex|samseong|yeoksam|nonhyeon|sinnonhyeon|apgujeong|cheongdam|teheran|gimpo-airport-to-gangnam/.test(s)) {
    return "gangnam_samsung_apgujeong";
  }

  return null;
}

export function getPoiBundle(slug: string): DestinationPoiBundle | null {
  const id = resolvePoiBundleId(slug);
  return id ? DESTINATION_POI_BUNDLES[id] : null;
}
