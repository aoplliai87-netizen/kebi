import {
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_BIZ_URL,
  SITE_NAVER_URL,
} from "@/lib/site";

/** 샘플·빈 값·비-https 링크 제외 — JSON-LD sameAs·외부 프로필용 */
export function isPublicBrandUrl(url: string | undefined | null): url is string {
  const u = url?.trim() ?? "";
  if (!u.startsWith("https://")) return false;
  if (u.includes("/sample")) return false;
  if (u === "https://pf.kakao.com") return false;
  return true;
}

/** 운영 중인 공식 프로필 URL (환경 변수·site 기본값에서 수집, 중복 제거) */
export function getBrandSameAsLinks(): string[] {
  const candidates = [
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL,
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL,
    process.env.NEXT_PUBLIC_NAVER_PLACE_URL,
    SITE_KAKAO_BIZ_URL,
    SITE_NAVER_URL,
    SITE_INSTAGRAM_DM_URL,
  ];
  return Array.from(new Set(candidates.filter(isPublicBrandUrl)));
}
