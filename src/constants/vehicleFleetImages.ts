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
  staria:
    "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1400&q=82",
  solati:
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=82",
  county:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=82",
} as const;

export type FleetVehicleKey = keyof typeof VEHICLE_FLEET_MAIN;
