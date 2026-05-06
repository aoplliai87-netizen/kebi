import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  readLocalReservations,
  readLocalReviews,
  readLocalSiteSettings,
  readLocalSupportInquiries,
} from "@/lib/local-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 설정이 필요합니다." },
      { status: 400 }
    );
  }

  const [reservations, inquiries, reviews, settings] = await Promise.all([
    readLocalReservations(),
    readLocalSupportInquiries(),
    readLocalReviews(),
    readLocalSiteSettings(),
  ]);

  const reservationRows = reservations.map((r) => ({
    id: r.id,
    created_at: r.createdAt,
    status: r.status,
    locale: r.locale,
    name: r.name,
    phone: r.phone,
    service_type: r.serviceType,
    travel_date: r.travelDate,
    travel_time: r.travelTime,
    start_point: r.startPoint,
    destination: r.destination,
    airport: r.airport,
    flight_no: r.flightNo ?? null,
    vehicle: r.vehicle,
    passengers: r.passengers,
    luggage: r.luggage,
    adult_passengers: r.adultPassengers ?? null,
    child_passengers: r.childPassengers ?? null,
    golf_bags: r.golfBags ?? null,
    waypoints_summary: r.waypointsSummary ?? null,
    preferred_messenger: r.preferredMessenger,
  }));
  const inquiryRows = inquiries.map((v) => ({
    id: v.id,
    created_at: v.createdAt,
    locale: v.locale,
    name: v.name,
    phone: v.phone,
    departure: v.departure,
    destination: v.destination,
    travel_date: v.travelDate,
    travel_time: v.travelTime,
    passengers: v.passengers,
    message: v.message,
    out_of_metro_area: v.outOfMetroArea,
  }));
  const reviewRows = reviews.map((v) => ({
    id: v.id,
    created_at: v.createdAt,
    author: v.author,
    content: v.content,
    images: v.images,
  }));

  const errors: string[] = [];
  if (reservationRows.length > 0) {
    const { error } = await supabase.from("reservations").upsert(reservationRows, { onConflict: "id" });
    if (error) errors.push(`reservations: ${error.message}`);
  }
  if (inquiryRows.length > 0) {
    const { error } = await supabase
      .from("support_inquiries")
      .upsert(inquiryRows, { onConflict: "id" });
    if (error) errors.push(`support_inquiries: ${error.message}`);
  }
  if (reviewRows.length > 0) {
    const { error } = await supabase.from("reviews").upsert(reviewRows, { onConflict: "id" });
    if (error) errors.push(`reviews: ${error.message}`);
  }
  {
    const { error } = await supabase.from("site_settings").upsert(
      {
        id: "default",
        about_me_title: settings.aboutMeTitle,
        about_me_description: settings.aboutMeDescription,
        gallery_image_urls: settings.galleryImageUrls,
        vehicle_section_title: settings.vehicleSectionTitle,
        vehicle_section_description: settings.vehicleSectionDescription,
        pricing_tiers: settings.pricingTiers,
        seo_home_title: settings.seoHomeTitle,
        seo_home_description: settings.seoHomeDescription,
        phone_display: settings.phoneDisplay,
        phone_tel: settings.phoneTel,
        kakao_url: settings.contactLinks.kakao,
        instagram_url: settings.contactLinks.instagram,
        whatsapp_url: settings.contactLinks.whatsapp,
        line_url: settings.contactLinks.line,
        messenger_url: settings.contactLinks.messenger,
        hero_title: settings.heroTitle,
        hero_subtitle: settings.heroSubtitle,
        about_me_title_ko: settings.aboutMeTitleByLocale.ko,
        about_me_title_en: settings.aboutMeTitleByLocale.en,
        about_me_title_ja: settings.aboutMeTitleByLocale.ja,
        about_me_title_zh: settings.aboutMeTitleByLocale.zh,
        about_me_description_ko: settings.aboutMeDescriptionByLocale.ko,
        about_me_description_en: settings.aboutMeDescriptionByLocale.en,
        about_me_description_ja: settings.aboutMeDescriptionByLocale.ja,
        about_me_description_zh: settings.aboutMeDescriptionByLocale.zh,
        hero_title_ko: settings.heroTitleByLocale.ko,
        hero_title_en: settings.heroTitleByLocale.en,
        hero_title_ja: settings.heroTitleByLocale.ja,
        hero_title_zh: settings.heroTitleByLocale.zh,
        hero_subtitle_ko: settings.heroSubtitleByLocale.ko,
        hero_subtitle_en: settings.heroSubtitleByLocale.en,
        hero_subtitle_ja: settings.heroSubtitleByLocale.ja,
        hero_subtitle_zh: settings.heroSubtitleByLocale.zh,
        seo_home_title_ko: settings.seoHomeTitleByLocale.ko,
        seo_home_title_en: settings.seoHomeTitleByLocale.en,
        seo_home_title_ja: settings.seoHomeTitleByLocale.ja,
        seo_home_title_zh: settings.seoHomeTitleByLocale.zh,
        seo_home_description_ko: settings.seoHomeDescriptionByLocale.ko,
        seo_home_description_en: settings.seoHomeDescriptionByLocale.en,
        seo_home_description_ja: settings.seoHomeDescriptionByLocale.ja,
        seo_home_description_zh: settings.seoHomeDescriptionByLocale.zh,
        vehicle_section_title_ko: settings.vehicleSectionTitleByLocale.ko,
        vehicle_section_title_en: settings.vehicleSectionTitleByLocale.en,
        vehicle_section_title_ja: settings.vehicleSectionTitleByLocale.ja,
        vehicle_section_title_zh: settings.vehicleSectionTitleByLocale.zh,
        vehicle_section_description_ko: settings.vehicleSectionDescriptionByLocale.ko,
        vehicle_section_description_en: settings.vehicleSectionDescriptionByLocale.en,
        vehicle_section_description_ja: settings.vehicleSectionDescriptionByLocale.ja,
        vehicle_section_description_zh: settings.vehicleSectionDescriptionByLocale.zh,
        pricing_tiers_ko: settings.pricingTiersByLocale.ko,
        pricing_tiers_en: settings.pricingTiersByLocale.en,
        pricing_tiers_ja: settings.pricingTiersByLocale.ja,
        pricing_tiers_zh: settings.pricingTiersByLocale.zh,
      },
      { onConflict: "id" }
    );
    if (error) errors.push(`site_settings: ${error.message}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    migrated: {
      reservations: reservationRows.length,
      supportInquiries: inquiryRows.length,
      reviews: reviewRows.length,
      siteSettings: 1,
    },
  });
}
