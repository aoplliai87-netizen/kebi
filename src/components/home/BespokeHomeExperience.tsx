"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { VEHICLE_FLEET_MAIN } from "@/constants/vehicleFleetImages";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import { getDefaultHomeHeroSlides } from "@/lib/home-hero-slides";
import { SITE_PHONE_TEL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type PricingTier = {
  label: string;
  price: string;
  note: string;
};

type ReviewItem = {
  content: string;
  author: string;
};

type BespokeHomeExperienceProps = {
  locale?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: ReactNode;
  heroSlides?: string[];
  introEyebrow: string;
  introTitle: string;
  introDesc: ReactNode;
  vehicleEyebrow: string;
  vehicleTitle: string;
  vehicleDesc: string;
  pricingEyebrow: string;
  pricingTitle: string;
  pricingTiers: PricingTier[];
  bookingEyebrow: string;
  bookingTitle: string;
  bookingDesc: string;
  bookingCall: string;
  bookingReview: string;
  reviewEyebrow: string;
  reviewTitle: string;
  reviews: ReviewItem[];
  aboutMeTitle?: string;
  aboutMeDescription?: string;
  galleryImageUrls?: string[];
  phoneTel?: string;
  contactLinks?: {
    kakao: string;
    instagram: string;
    whatsapp: string;
    line: string;
    messenger: string;
  };
  heroTitleOverride?: string;
  heroSubtitleOverride?: string;
  vehicleMainImages?: Record<FleetVehicleKey, string>;
};

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const LUX_TRANSITION = { duration: 0.8, ease: LUX_EASE } as const;

/** 섹션 상단 라벨(소개, AIRPORT VAN FLEET 등) — 모바일은 살짝만, md 이상에서 균형 있게 확대 */
const homeSectionEyebrow =
  "text-[13px] font-semibold uppercase tracking-[0.2em] text-metal-bronze-strong md:text-sm md:tracking-[0.24em] lg:tracking-[0.26em]";

export function BespokeHomeExperience(props: BespokeHomeExperienceProps) {
  const t = useTranslations("HomePage");
  const locale = props.locale ?? "ko";
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const veilY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const effectiveHeroTitle = props.heroTitleOverride?.trim() || props.heroTitle;
  const effectiveHeroSubtitle = props.heroSubtitleOverride?.trim() || null;
  const heroParts = effectiveHeroTitle.split("Premium");
  const phoneTel = props.phoneTel || SITE_PHONE_TEL;
  const quickChannels: ReadonlyArray<{
    label: string;
    icon: string;
    href: string;
    tone?: "phone";
  }> = [
    { label: t("channelPhone"), icon: "/icons/phone.svg", href: phoneTel, tone: "phone" as const },
    {
      label: t("channelKakao"),
      icon: "/icons/kakao.svg",
      href: props.contactLinks?.kakao || "#",
    },
    {
      label: "WhatsApp",
      icon: "/icons/whatsapp.svg",
      href: props.contactLinks?.whatsapp || "#",
    },
    { label: "LINE", icon: "/icons/line.svg", href: props.contactLinks?.line || "#" },
    {
      label: "Instagram",
      icon: "/icons/instagram.svg",
      href: props.contactLinks?.instagram || "#",
    },
    {
      label: "Facebook Messenger",
      icon: "/icons/messenger.svg",
      href: props.contactLinks?.messenger || "#",
    },
  ] as const;
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const vehicleMainImages = props.vehicleMainImages ?? VEHICLE_FLEET_MAIN;
  const heroSlides = useMemo(
    () => (props.heroSlides?.length ? props.heroSlides : getDefaultHomeHeroSlides(vehicleMainImages)),
    [props.heroSlides, vehicleMainImages],
  );
  useEffect(() => {
    setHeroSlideIndex(0);
  }, [heroSlides]);
  const homeVehiclePreviews = [
    { key: "staria", src: vehicleMainImages.staria, label: t("vehicle.staria") },
    { key: "solati", src: vehicleMainImages.solati, label: t("vehicle.solati") },
    { key: "county", src: vehicleMainImages.county, label: t("vehicle.county") },
  ] as const;
  const galleryImageUrls = props.galleryImageUrls ?? [];
  const emptyReviewLabel =
    locale === "en"
      ? "No published reviews yet."
      : locale === "ja"
        ? "登録されたレビューはまだありません。"
        : locale === "zh"
          ? "暂无已登记的评价。"
          : "등록된 후기가 없습니다.";
  const vehicleAltTail =
    locale === "en"
      ? "Private Van Service and Airport Transfer vehicle"
      : locale === "ja"
        ? "空港送迎・貸切バンサービス車両"
        : locale === "zh"
          ? "机场接送与私人包车服务车辆"
          : "공항 픽업·샌딩 프라이빗 밴 서비스 차량";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div
      ref={rootRef}
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_14%_12%,rgba(97,138,196,0.16),transparent_42%),linear-gradient(180deg,#030406_0%,#060b13_38%,#070f18_100%)]"
    >
      <motion.div
        aria-hidden
        style={{ y: veilY }}
        className="pointer-events-none absolute inset-0 opacity-25 [background:repeating-linear-gradient(122deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_1px,transparent_1px,transparent_8px)]"
      />

      <section className="relative overflow-hidden border-b border-border/50 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0">
          {heroSlides.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1300ms]",
                heroSlideIndex === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,12,0.72)_0%,rgba(4,7,13,0.78)_40%,rgba(5,9,16,0.86)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(212,175,55,0.12),transparent_45%)]" />
        </div>
        <motion.div
          style={{ y: heroY }}
          className="relative z-10 mx-auto max-w-content px-4 text-center md:px-6"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong md:text-[13px] md:tracking-[0.26em]">
            {props.heroEyebrow}
          </p>
          <h1 className='mt-6 text-balance font-sans text-6xl font-bold leading-[0.98] tracking-[-0.02em] text-tone-strong drop-shadow-[0_6px_28px_rgba(0,0,0,0.55)] md:text-7xl lg:text-8xl'>
            {heroParts.length > 1 ? (
              <>
                {heroParts[0]}
                <span className="bg-[linear-gradient(135deg,#f2cd76_0%,#d4af37_45%,#9f6e3f_100%)] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]">
                  Premium
                </span>
                {heroParts.slice(1).join("Premium")}
              </>
            ) : (
              <span className="bg-[linear-gradient(135deg,#e9f3ff_0%,#dbe9ff_45%,#f2cd76_100%)] bg-clip-text text-transparent">
                {effectiveHeroTitle}
              </span>
            )}
          </h1>
          <p className="mx-auto mt-7 max-w-3xl whitespace-pre-line text-xl leading-relaxed text-tone-body md:mt-8 md:text-2xl [&_span]:inline-block">
            {effectiveHeroSubtitle ? effectiveHeroSubtitle : props.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/booking">
              <Button className="h-11 rounded-xl px-7 text-sm font-semibold md:h-12 md:px-8 md:text-base">
                {t("ctaBookNow")}
              </Button>
            </Link>
            <a href={phoneTel}>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-metal-bronze/45 px-7 text-sm font-semibold text-tone-sky md:h-12 md:px-8 md:text-base"
              >
                {t("ctaCallConsult")}
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-content px-4 py-16 md:px-6 md:py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={LUX_TRANSITION}
        >
          <h2 className='font-sans text-4xl font-bold leading-tight tracking-[-0.02em] text-tone-sky md:text-5xl'>
            {props.introTitle}
          </h2>
          <div className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-tone-body md:text-lg">
            {props.introDesc}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-content px-4 pb-16 md:px-6 md:pb-20">
        <div className="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 text-center shadow-[0_18px_54px_rgba(0,0,0,0.32)] md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-metal-bronze-strong">
            {props.aboutMeTitle ?? "ABOUT ME"}
          </p>
          <p className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-xl font-semibold leading-relaxed text-tone-strong md:text-3xl">
            {props.aboutMeDescription}
          </p>
          <div className="mx-auto mt-7 grid max-w-[17.5rem] grid-cols-3 gap-3 sm:max-w-[19rem]">
            {quickChannels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border bg-black/25 transition-all hover:-translate-y-0.5 md:h-14 md:w-14",
                  channel.tone === "phone"
                    ? "border-white/20 hover:border-brand-gold/55 hover:bg-white/[0.08]"
                    : "border-white/20 hover:border-brand-gold/55 hover:bg-white/[0.08]",
                )}
                aria-label={channel.label}
                title={channel.label}
              >
                <Image src={channel.icon} alt="" width={28} height={28} className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            ))}
          </div>
          <a
            href={phoneTel}
            className="mt-8 inline-flex h-14 min-w-[220px] items-center justify-center rounded-xl bg-gradient-to-b from-brand-gold via-[#ddb94a] to-[#b8892a] px-8 text-lg font-bold text-black shadow-[0_10px_26px_rgba(212,175,55,0.34)] transition hover:brightness-110"
          >
            {t("ctaCallDirect")}
          </a>
        </div>
      </section>

      {galleryImageUrls.length > 0 ? (
        <section className="mx-auto max-w-content px-4 pb-16 md:px-6 md:pb-20">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImageUrls.map((src, index) => (
              <figure
                key={src}
                className="overflow-hidden rounded-2xl border border-white/12 bg-black/20 shadow-[0_10px_32px_rgba(0,0,0,0.28)]"
              >
                <Image
                  src={src}
                  alt={t("galleryAlt", { index: index + 1 })}
                  width={960}
                  height={640}
                  className="h-48 w-full object-cover md:h-56"
                />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-content gap-10 border-y border-border/45 px-4 py-20 md:px-6 md:py-24">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className={homeSectionEyebrow}>{props.vehicleEyebrow}</p>
          <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
            {props.vehicleTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-tone-body md:text-lg">
            {props.vehicleDesc}
          </p>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
            {homeVehiclePreviews.map((item) => (
              <article
                key={item.key}
                className="overflow-hidden rounded-2xl border border-white/12 bg-black/25 shadow-[0_12px_34px_rgba(0,0,0,0.32)]"
              >
                <Image
                  src={item.src}
                  alt={`${item.label} - ${vehicleAltTail}`}
                  width={640}
                  height={360}
                  className="h-36 w-full object-cover"
                />
                <p className="px-3 py-2 text-sm font-semibold text-tone-strong">{item.label}</p>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-3xl rounded-[30px] border border-metal-bronze/30 bg-gradient-to-br from-white/[0.03] to-brand-deep/25 p-8 text-center"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className={homeSectionEyebrow}>{props.pricingEyebrow}</p>
          <h2 className='mt-3 font-sans text-3xl font-bold tracking-[-0.02em] text-tone-strong md:text-4xl'>
            {props.pricingTitle}
          </h2>
          <div className="mt-6 space-y-4">
            {props.pricingTiers.map((tier) => (
              <div
                key={tier.label}
                className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
              >
                <p className="text-sm font-semibold text-tone-strong">{tier.label}</p>
                <p className="mt-1 text-lg font-semibold text-metal-bronze-strong">{tier.price}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-tone-soft">{tier.note}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-content px-4 py-20 md:px-6 md:py-24">
        <motion.div
          className="rounded-[30px] border border-metal-bronze/32 bg-gradient-to-r from-brand-deep/55 to-surface p-8 text-center md:p-10"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className={homeSectionEyebrow}>{props.bookingEyebrow}</p>
          <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
            {props.bookingTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-tone-body md:text-lg">
            {props.bookingDesc}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={phoneTel}>
              <Button className="h-11 rounded-xl px-6 text-sm font-semibold">
                {props.bookingCall}
              </Button>
            </a>
            <Link href="/booking">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-metal-bronze/45 px-6 text-sm font-semibold text-tone-sky"
              >
                {props.bookingReview}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-content px-4 pb-24 text-center md:px-6 md:pb-32">
        <p className={homeSectionEyebrow}>{props.reviewEyebrow}</p>
        <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
          {props.reviewTitle}
        </h2>
        {props.reviews.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {props.reviews.map((review, idx) => (
              <motion.blockquote
                key={`${review.author}-${idx}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 text-sm leading-relaxed text-tone-body"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...LUX_TRANSITION, delay: idx * 0.08 }}
              >
                <p className="whitespace-pre-line">{review.content}</p>
                <footer className="mt-4 text-xs font-semibold text-tone-strong">
                  {review.author}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-tone-soft">{emptyReviewLabel}</p>
        )}
      </section>
    </div>
  );
}
