/** 사업자 연락처 · 오픈채팅 URL — 실제 값으로 교체하세요 */
export const SITE_PHONE_DISPLAY = "010-4135-7621";
export const SITE_PHONE_TEL = "tel:+821041357621";
export const SITE_KAKAO_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHAT_URL ?? "kakaotalk://";
export const SITE_NAVER_URL =
  process.env.NEXT_PUBLIC_NAVER_URL ?? "https://blog.naver.com/sample";
export const SITE_NAVER_TALKTALK_URL =
  process.env.NEXT_PUBLIC_NAVER_TALKTALK_URL ?? "https://talk.naver.com/sample";
export const SITE_KAKAO_BIZ_URL =
  process.env.NEXT_PUBLIC_KAKAO_BIZ_URL ?? "https://pf.kakao.com/sample";
export const SITE_SMS_URL =
  process.env.NEXT_PUBLIC_SMS_URL ?? "sms:+821041357621";
export const SITE_INSTAGRAM_DM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_DM_URL ??
  "instagram://direct-inbox";
export const SITE_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "whatsapp://send?phone=821041357621";
export const SITE_LINE_URL =
  process.env.NEXT_PUBLIC_LINE_URL ?? "line://ti/p/@sample";

/** 홈페이지 문의 페이지 (`/[locale]/inquiry`) — 라우트 변경 시 함께 수정 */
export const SITE_WEB_INQUIRY_PATH = "/inquiry" as const;
export const SITE_FACEBOOK_MESSENGER_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_MESSENGER_URL ?? "fb-messenger://";

/** 헤더·소개 히어로 등 공통 로고 — `public/images/logo.jpg` 등으로 두고 이 경로만 맞추면 됩니다(JPEG 가능). */
export const BRAND_LOGO_SRC = "/images/logo.jpg";
