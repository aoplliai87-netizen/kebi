export type VehicleLocale = "ko" | "en" | "ja" | "zh";

export type LocalizedValue = Record<VehicleLocale, string>;

export type VehicleCardContent = {
  badge: LocalizedValue;
  name: LocalizedValue;
  seat45: LocalizedValue;
  seat67: LocalizedValue;
  capacity: LocalizedValue;
  luggage: LocalizedValue;
  imageAlt: LocalizedValue;
  f1: LocalizedValue;
  f2: LocalizedValue;
  f3: LocalizedValue;
  f4: LocalizedValue;
};

export type VehiclePageContent = {
  sectionEyebrow: LocalizedValue;
  sectionTitle: LocalizedValue;
  sectionDesc: LocalizedValue;
  detailBtn: LocalizedValue;
  bookBtn: LocalizedValue;
  phoneBtn: LocalizedValue;
  galleryHeading: LocalizedValue;
  galleryNote: LocalizedValue;
  tourAvailable: LocalizedValue;
  gallerySlotLabel: LocalizedValue;
  modalClose: LocalizedValue;
  staria: VehicleCardContent;
  solati: VehicleCardContent;
  county: VehicleCardContent;
};

const LOCALES: VehicleLocale[] = ["ko", "en", "ja", "zh"];

export function emptyVehicleLocalized(): LocalizedValue {
  return { ko: "", en: "", ja: "", zh: "" };
}

function emptyCard(): VehicleCardContent {
  return {
    badge: emptyVehicleLocalized(),
    name: emptyVehicleLocalized(),
    seat45: emptyVehicleLocalized(),
    seat67: emptyVehicleLocalized(),
    capacity: emptyVehicleLocalized(),
    luggage: emptyVehicleLocalized(),
    imageAlt: emptyVehicleLocalized(),
    f1: emptyVehicleLocalized(),
    f2: emptyVehicleLocalized(),
    f3: emptyVehicleLocalized(),
    f4: emptyVehicleLocalized(),
  };
}

export function emptyVehiclePageContent(): VehiclePageContent {
  return {
    sectionEyebrow: emptyVehicleLocalized(),
    sectionTitle: emptyVehicleLocalized(),
    sectionDesc: emptyVehicleLocalized(),
    detailBtn: emptyVehicleLocalized(),
    bookBtn: emptyVehicleLocalized(),
    phoneBtn: emptyVehicleLocalized(),
    galleryHeading: emptyVehicleLocalized(),
    galleryNote: emptyVehicleLocalized(),
    tourAvailable: emptyVehicleLocalized(),
    gallerySlotLabel: emptyVehicleLocalized(),
    modalClose: emptyVehicleLocalized(),
    staria: emptyCard(),
    solati: emptyCard(),
    county: emptyCard(),
  };
}

function parseLocalized(value: unknown): LocalizedValue {
  const v = value && typeof value === "object" ? (value as Partial<LocalizedValue>) : {};
  const out = emptyVehicleLocalized();
  for (const locale of LOCALES) {
    out[locale] = typeof v[locale] === "string" ? v[locale].trim() : "";
  }
  return out;
}

function parseCard(value: unknown): VehicleCardContent {
  const v = value && typeof value === "object" ? (value as Partial<VehicleCardContent>) : {};
  return {
    badge: parseLocalized(v.badge),
    name: parseLocalized(v.name),
    seat45: parseLocalized(v.seat45),
    seat67: parseLocalized(v.seat67),
    capacity: parseLocalized(v.capacity),
    luggage: parseLocalized(v.luggage),
    imageAlt: parseLocalized(v.imageAlt),
    f1: parseLocalized(v.f1),
    f2: parseLocalized(v.f2),
    f3: parseLocalized(v.f3),
    f4: parseLocalized(v.f4),
  };
}

export function parseVehiclePageContent(value: unknown): VehiclePageContent {
  const v = value && typeof value === "object" ? (value as Partial<VehiclePageContent>) : {};
  return {
    sectionEyebrow: parseLocalized(v.sectionEyebrow),
    sectionTitle: parseLocalized(v.sectionTitle),
    sectionDesc: parseLocalized(v.sectionDesc),
    detailBtn: parseLocalized(v.detailBtn),
    bookBtn: parseLocalized(v.bookBtn),
    phoneBtn: parseLocalized(v.phoneBtn),
    galleryHeading: parseLocalized(v.galleryHeading),
    galleryNote: parseLocalized(v.galleryNote),
    tourAvailable: parseLocalized(v.tourAvailable),
    gallerySlotLabel: parseLocalized(v.gallerySlotLabel),
    modalClose: parseLocalized(v.modalClose),
    staria: parseCard(v.staria),
    solati: parseCard(v.solati),
    county: parseCard(v.county),
  };
}

export function pickVehicleLocalized(value: LocalizedValue, locale: VehicleLocale): string {
  return value[locale]?.trim() || value.ko?.trim() || value.en?.trim() || value.ja?.trim() || value.zh?.trim() || "";
}
