import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";

export type ManagedVehicleMedia = {
  main: Record<FleetVehicleKey, string>;
  interior: Record<FleetVehicleKey, (string | null)[]>;
};
