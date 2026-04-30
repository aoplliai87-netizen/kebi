"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export type IntroServiceItem = {
  title: string;
  body: string;
  image: string;
  align: "left" | "right";
};

type BespokeIntroExperienceProps = {
  brandTitle: string;
  sectionLabel: string;
  headline: string;
  description: ReactNode;
  coreValueEyebrow: string;
  coreValueTitle: string;
  coreValueBody: string;
  contactEyebrow: string;
  representativeName: string;
  representativeLine: string;
  phoneCaption: string;
  phoneDisplay: string;
  services: IntroServiceItem[];
};

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const LUX_TRANSITION = { duration: 0.8, ease: LUX_EASE } as const;

export function BespokeIntroExperience({
  brandTitle,
  sectionLabel,
  headline,
  description,
  coreValueEyebrow,
  coreValueTitle,
  coreValueBody,
  contactEyebrow,
  representativeName,
  representativeLine,
  phoneCaption,
  phoneDisplay,
  services,
}: BespokeIntroExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const textureY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const crescentY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(90,120,170,0.14),transparent_45%),linear-gradient(180deg,#040506_0%,#060b13_45%,#080f18_100%)]"
    >
      <motion.div
        style={{ y: textureY }}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background:repeating-linear-gradient(120deg,rgba(255,255,255,0.035),rgba(255,255,255,0.035)_1px,transparent_1px,transparent_9px)]"
      />

      <motion.div
        style={{ y: crescentY }}
        aria-hidden
        className="pointer-events-none absolute -right-24 top-32 h-[500px] w-[500px] rounded-full border border-metal-bronze/30"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -250]) }}
        aria-hidden
        className="pointer-events-none absolute left-[-180px] top-[780px] h-[420px] w-[420px] rounded-full border border-metal-bronze/20"
      />

      <div className="relative mx-auto max-w-content px-4 pb-28 pt-20 md:px-6 md:pt-28">
        <motion.header
          style={{ y: heroY }}
          className="mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={LUX_TRANSITION}
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-metal-bronze/40 bg-white/[0.03] text-metal-bronze-strong shadow-[0_0_0_1px_rgba(176,122,87,0.18)] md:h-24 md:w-24">
            <span className="text-[10px] tracking-[0.2em] md:text-xs">IMAGE_4 LOGO</span>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong">
            {sectionLabel}
          </p>
          <h1 className="mt-6 text-balance font-sans tracking-[-0.02em]">
            <span className="block text-5xl font-bold leading-[0.98] text-brand-gold md:text-6xl lg:text-7xl">
              {brandTitle}
            </span>
            <span className="mt-4 block text-2xl font-bold leading-tight text-tone-sky md:mt-5 md:text-3xl">
              {headline}
            </span>
          </h1>
          <div className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-tone-body md:text-lg">
            {description}
          </div>
        </motion.header>

        <section className="relative mt-28 md:mt-36">
          <motion.svg
            aria-hidden
            viewBox="0 0 1200 500"
            className="pointer-events-none absolute left-0 top-[-80px] h-[380px] w-full opacity-70"
            initial={{ opacity: 0, pathLength: 0.2 }}
            whileInView={{ opacity: 1, pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={LUX_TRANSITION}
          >
            <defs>
              <linearGradient id="bronzeLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--metal-bronze)" />
                <stop offset="45%" stopColor="var(--metal-bronze)" />
                <stop offset="100%" stopColor="var(--metal-bronze-strong)" />
              </linearGradient>
            </defs>
            <path
              d="M30 290 C 210 90, 470 110, 600 260 S 990 430, 1170 230"
              fill="none"
              stroke="url(#bronzeLine)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M80 340 C 260 160, 510 180, 640 300 S 930 450, 1130 280"
              fill="none"
              stroke="url(#bronzeLine)"
              strokeOpacity="0.4"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </motion.svg>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              className="md:pt-12"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={LUX_TRANSITION}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
                {coreValueEyebrow}
              </p>
              <h2 className="mt-3 font-sans text-4xl font-bold leading-tight tracking-[-0.02em] text-tone-strong md:text-5xl">
                {coreValueTitle}
              </h2>
            </motion.div>
            <motion.div
              className="md:pl-12"
              initial={{ opacity: 0, x: 42 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={LUX_TRANSITION}
            >
              <p className="text-base leading-relaxed text-tone-body md:text-lg">{coreValueBody}</p>
            </motion.div>
          </div>
        </section>

        <section className="mt-28 space-y-24 md:space-y-28">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className={`grid items-center gap-8 ${
                service.align === "left" ? "md:grid-cols-[1.12fr_0.88fr]" : "md:grid-cols-[0.88fr_1.12fr]"
              }`}
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.52 }}
              transition={LUX_TRANSITION}
            >
              <div className={service.align === "right" ? "md:order-2" : ""}>
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="h-[420px] w-full rounded-[28px] border border-white/10 object-cover shadow-[0_26px_70px_rgba(0,0,0,0.42)]"
                  initial={{ scale: 1.05, opacity: 0.32 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={LUX_TRANSITION}
                />
              </div>
              <div className={service.align === "right" ? "md:order-1 md:pr-8" : "md:pl-8"}>
                <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">
                  Specialized Service {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-sans text-3xl font-bold leading-tight tracking-[-0.02em] text-tone-sky md:text-4xl">
                  {service.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-tone-body md:text-lg">{service.body}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section
          className="mt-28 rounded-[34px] border border-metal-bronze/32 bg-gradient-to-br from-white/[0.03] to-[#1c2734]/35 p-8 md:mt-36 md:p-12"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={LUX_TRANSITION}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-metal-bronze-strong">{contactEyebrow}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="font-sans text-2xl italic tracking-[-0.02em] text-metal-bronze-strong md:text-3xl">
                {representativeName}
              </p>
              <p className="mt-3 text-base text-tone-soft">{representativeLine}</p>
            </div>
            <div className="md:text-right">
              <p className="font-numeric text-4xl font-bold tracking-[-0.02em] text-tone-strong tabular-nums md:text-5xl">
                {phoneDisplay}
              </p>
              <p className="mt-3 text-sm text-tone-soft">{phoneCaption}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
}
