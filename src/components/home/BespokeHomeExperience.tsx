"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { SITE_PHONE_TEL } from "@/lib/site";
import { useRef } from "react";

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
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: ReactNode;
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
};

const visualSet = [
  {
    title: "Premier Airport Escort",
    image:
      "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Executive Business Transfer",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Calm Family Journey",
    image:
      "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?auto=format&fit=crop&w=1800&q=80",
  },
];

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const LUX_TRANSITION = { duration: 0.8, ease: LUX_EASE } as const;

export function BespokeHomeExperience(props: BespokeHomeExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const veilY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroParts = props.heroTitle.split("Premium");

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

      <section className="relative border-b border-border/50 pb-20 pt-24 md:pb-28 md:pt-32">
        <motion.div
          style={{ y: heroY }}
          className="mx-auto max-w-content px-4 text-center md:px-6"
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
                {props.heroTitle}
              </span>
            )}
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-tone-body md:mt-8 md:text-2xl [&_span]:inline-block">
            {props.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/booking">
              <Button className="h-11 rounded-xl px-7 text-sm font-semibold md:h-12 md:px-8 md:text-base">
                실시간 예약하기
              </Button>
            </Link>
            <a href={SITE_PHONE_TEL}>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-metal-bronze/45 px-7 text-sm font-semibold text-tone-sky md:h-12 md:px-8 md:text-base"
              >
                전화 상담하기
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-content px-4 py-20 md:px-6 md:py-28">
        <motion.svg
          aria-hidden
          viewBox="0 0 1200 430"
          className="pointer-events-none absolute left-0 top-6 h-[320px] w-full opacity-60"
          initial={{ opacity: 0, pathLength: 0.2 }}
          whileInView={{ opacity: 1, pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={LUX_TRANSITION}
        >
          <defs>
            <linearGradient id="homeBronze" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--metal-bronze)" />
              <stop offset="50%" stopColor="var(--metal-bronze)" />
              <stop offset="100%" stopColor="var(--metal-bronze-strong)" />
            </linearGradient>
          </defs>
          <path
            d="M40 250 C 210 100, 430 120, 610 250 S 980 400, 1160 210"
            fill="none"
            stroke="url(#homeBronze)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </motion.svg>

        <div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={LUX_TRANSITION}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
              {props.introEyebrow}
            </p>
            <h2 className='mt-3 font-sans text-4xl font-bold leading-tight tracking-[-0.02em] text-tone-sky md:text-5xl'>
              {props.introTitle}
            </h2>
            <div className="mt-6 text-base leading-relaxed text-tone-body md:text-lg">
              {props.introDesc}
            </div>
          </motion.div>

          <motion.div
            className="space-y-6 md:pt-16"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={LUX_TRANSITION}
          >
            {visualSet.map((item, idx) => (
              <motion.article
                key={item.title}
                className={`overflow-hidden rounded-[26px] border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.38)] ${
                  idx === 1 ? "md:ml-12" : idx === 2 ? "md:mr-12" : ""
                }`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ ...LUX_TRANSITION, delay: idx * 0.08 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-52 w-full object-cover md:h-56"
                />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-content gap-10 border-y border-border/45 px-4 py-20 md:grid-cols-2 md:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
            {props.vehicleEyebrow}
          </p>
          <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
            {props.vehicleTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-tone-body md:text-lg">
            {props.vehicleDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
          className="rounded-[30px] border border-metal-bronze/30 bg-gradient-to-br from-white/[0.03] to-brand-deep/25 p-8"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
            {props.pricingEyebrow}
          </p>
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
                <p className="mt-1 text-sm text-tone-soft">{tier.note}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-content px-4 py-20 md:px-6 md:py-24">
        <motion.div
          className="rounded-[30px] border border-metal-bronze/32 bg-gradient-to-r from-brand-deep/55 to-surface p-8 md:p-10"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={LUX_TRANSITION}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
            {props.bookingEyebrow}
          </p>
          <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
            {props.bookingTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-tone-body md:text-lg">
            {props.bookingDesc}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={SITE_PHONE_TEL}>
              <Button className="h-11 rounded-xl px-6 text-sm font-semibold">
                {props.bookingCall}
              </Button>
            </a>
            <Link href="/review">
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

      <section className="mx-auto max-w-content px-4 pb-24 md:px-6 md:pb-32">
        <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
          {props.reviewEyebrow}
        </p>
        <h2 className='mt-3 font-sans text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
          {props.reviewTitle}
        </h2>
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
              <p>{review.content}</p>
              <footer className="mt-4 text-xs font-semibold text-tone-strong">
                {review.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
