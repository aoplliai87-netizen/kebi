export type ManagedPricingRow = {
  name: string;
  nameEn: string;
  gimpo: number;
  incheon: number;
};

export type ManagedPricingGroup = {
  group: true;
  id: string;
  name: string;
  nameEn: string;
  rows: ManagedPricingRow[];
};

export type ManagedPricingEntry = ManagedPricingRow | ManagedPricingGroup;

export type ManagedPricingRegion = {
  id: string;
  name: string;
  nameEn: string;
  rows: ManagedPricingEntry[];
};

export function isManagedPricingGroup(entry: ManagedPricingEntry): entry is ManagedPricingGroup {
  return "group" in entry && entry.group === true;
}
