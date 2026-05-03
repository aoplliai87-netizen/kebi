/**
 * 차종별 안내 페이지 이미지
 *
 * 바꾸는 방법:
 * 1. 사진 파일을 `public/images/vehicles/` 에 넣습니다 (예: staria-hero.jpg).
 * 2. 아래 문자열을 해당 경로로 수정합니다 (항상 `/images/...` 로 시작).
 *
 * 원격 URL을 그대로 써도 됩니다. 빌드 전에 파일이 실제로 존재하는지 확인하세요.
 */
export const VEHICLE_FLEET_MAIN = {
  staria: "/images/vehicles/staria-hero.png",
  solati: "/images/vehicles/solati-hero.png",
  county: "/images/vehicles/county-hero.png",
} as const;

export type FleetVehicleKey = keyof typeof VEHICLE_FLEET_MAIN;
