/**
 * 메인 페이지 소개 섹션(텍스트 오른쪽) 이미지 2장.
 *
 * 적용 방법:
 * 1. 사진 2장을 `public/images/home-intro/` 에 넣습니다.
 * 2. 아래 파일명과 같게 두거나, 이름이 다르면 `src`만 실제 파일명에 맞게 수정합니다.
 */
export const HOME_INTRO_VISUALS = [
  {
    alt: "깨비콜밴 프라이빗 밴 실내 — 인천공항 픽업·샌딩",
    src: "/images/home-intro/1.png",
  },
  {
    alt: "깨비콜밴 공항 픽업 차량 — 캐리어·가족 동반 이동",
    src: "/images/home-intro/2.png",
  },
] as const;
