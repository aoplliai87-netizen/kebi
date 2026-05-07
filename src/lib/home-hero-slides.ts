import { HOME_INTRO_VISUALS } from "@/constants/homeIntroVisuals";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import { VEHICLE_FLEET_MAIN } from "@/constants/vehicleFleetImages";

export function getDefaultHomeHeroSlides(
  vehicleMainImages?: Partial<Record<FleetVehicleKey, string>>,
): string[] {
  const vehicle = {
    ...VEHICLE_FLEET_MAIN,
    ...(vehicleMainImages ?? {}),
  };
  return [
    ...HOME_INTRO_VISUALS.map((v) => v.src),
    vehicle.staria,
    vehicle.solati,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
}

