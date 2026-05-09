/**
 * 차종별 안내 페이지 메인(외관) 이미지
 *
 * 바꾸는 방법:
 * 1. 사진 파일을 `public/images/vehicles/` 에 넣습니다 (예: staria-hero.jpg).
 * 2. 아래 문자열을 해당 경로로 수정합니다 (항상 `/images/...` 로 시작).
 *
 * 실내 사진은 `src/components/vehicle/BespokeVehicleFleet.tsx` 의 `DETAIL_GALLERY_SRC` 에
 * 차종별로 최대 6장까지 경로를 채우면 됩니다. 파일은 `public/images/vehicles/interiors/` 등
 * 폴더에 두고 `/images/vehicles/interiors/staria-01.jpg` 처럼 지정하면 됩니다.
 *
 * 원격 URL을 그대로 써도 됩니다. 빌드 전에 파일이 실제로 존재하는지 확인하세요.
 *
 * 관리자 `/admin/vehicles` 에서 저장하는 경로는 `data/vehicle-media.json` 에 기록되며,
 * 빈 슬롯은 여기 기본값(위 상수)으로 폴백합니다. 실사 전환 시 JSON·이 파일·갤러리 슬롯을
 * 함께 맞추면 공개 페이지·SEO alt가 한 경로를 바라보게 됩니다.
 */
export const VEHICLE_FLEET_MAIN = {
  staria: "/images/vehicles/staria-hero.png",
  solati: "/images/vehicles/solati-hero.png",
  county: "/images/vehicles/county-hero.png",
} as const;

export type FleetVehicleKey = keyof typeof VEHICLE_FLEET_MAIN;
