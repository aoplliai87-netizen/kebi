/**
 * 소개 페이지 Specialized Service 이미지 (`번역 IntroPage.services.s01` … `s04` 와 같은 순서).
 *
 * 적용 방법:
 * 1. 생성한 이미지 4장을 `public/images/intro-services/` 에 넣습니다.
 * 2. 아래 파일명과 같게 두거나, 파일명이 다르면 경로만 이 배열에서 수정합니다.
 */
export const INTRO_SERVICE_IMAGES = [
  "/images/intro-services/s01.png",
  "/images/intro-services/s02.png",
  "/images/intro-services/s03.png",
  "/images/intro-services/s04.png",
] as const;

export const INTRO_SERVICE_ALIGNS = ["left", "right", "left", "right"] as const;
