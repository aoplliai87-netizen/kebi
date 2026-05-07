"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { Link } from "@/i18n/navigation";
import {
  pricingRegions,
} from "@/constants/pricingData";
import {
  isManagedPricingGroup,
  type ManagedPricingEntry,
  type ManagedPricingRegion,
  type ManagedPricingRow,
} from "@/lib/pricing-table-types";
import { SITE_WEB_INQUIRY_PATH } from "@/lib/site";
import { useSiteRuntime } from "@/components/providers/SiteRuntimeProvider";
import { cn } from "@/lib/utils";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const LUX_TRANSITION = { duration: 0.8, ease: LUX_EASE } as const;
const LIST_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};
const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: LUX_TRANSITION },
};

const KRW = new Intl.NumberFormat("ko-KR");
const normalize = (value: string) => value.toLowerCase().replace(/\s|-/g, "");

function matchesRowQuery(row: ManagedPricingRow, q: string): boolean {
  return normalize(row.name).includes(q) || normalize(row.nameEn).includes(q);
}

function filterPricingEntries(entries: ManagedPricingEntry[], q: string): ManagedPricingEntry[] {
  if (!q) return entries;
  const out: ManagedPricingEntry[] = [];
  for (const entry of entries) {
    if (isManagedPricingGroup(entry)) {
      const parentHit = normalize(entry.name).includes(q) || normalize(entry.nameEn).includes(q);
      const childHits = entry.rows.filter((r) => matchesRowQuery(r, q));
      if (parentHit) {
        out.push(entry);
      } else if (childHits.length > 0) {
        out.push({ ...entry, rows: childHits });
      }
    } else if (matchesRowQuery(entry, q)) {
      out.push(entry);
    }
  }
  return out;
}

export function BespokePricingExperience({ initialRegions }: { initialRegions?: ManagedPricingRegion[] }) {
  const t = useTranslations("PricingPage");
  const { phoneTel, links } = useSiteRuntime();
  const sourceRegions = initialRegions && initialRegions.length > 0 ? initialRegions : (pricingRegions as ManagedPricingRegion[]);
  const displayRegions = useMemo<ManagedPricingRegion[]>(() => {
    const seoul = sourceRegions.find((region) => region.id === "seoul");
    const metro = sourceRegions.find((region) => region.id === "gyeonggi");
    return [
      seoul ? { ...seoul, name: t("regionSeoul"), nameEn: "Seoul" } : null,
      metro ? { ...metro, name: t("regionGyeonggi"), nameEn: "Gyeonggi-do" } : null,
      { id: "others", name: t("regionOther"), nameEn: "Other areas (Contact us)", rows: [] },
    ].filter(Boolean) as ManagedPricingRegion[];
  }, [sourceRegions, t]);

  const [activeRegion, setActiveRegion] = useState(displayRegions[0]?.id ?? "seoul");
  const [query, setQuery] = useState("");
  const [openMetroGroups, setOpenMetroGroups] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const currentRegion = useMemo(
    () =>
      displayRegions.find((region) => region.id === activeRegion) ??
      displayRegions[0] ??
      { id: "others", name: t("regionOther"), nameEn: "Other areas (Contact us)", rows: [] },
    [displayRegions, activeRegion, t]
  );

  const queryNorm = useMemo(() => normalize(query.trim()), [query]);
  const searchActive = queryNorm.length > 0;

  const filteredEntries = useMemo(() => {
    const rows = currentRegion.rows;
    if (currentRegion.id === "gyeonggi") {
      return filterPricingEntries(rows, queryNorm);
    }
    if (!queryNorm) return rows;
    return rows.filter(
      (entry) =>
        !isManagedPricingGroup(entry) && matchesRowQuery(entry, queryNorm),
    );
  }, [currentRegion, queryNorm]);

  const groupExpanded = (id: string) => searchActive || openMetroGroups[id] === true;

  const toggleMetroGroup = (id: string) => {
    if (searchActive) return;
    setOpenMetroGroups((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? false),
    }));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateMetrics = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setCanScroll(false);
        setScrollProgress(0);
        return;
      }
      setCanScroll(true);
      setScrollProgress((el.scrollLeft / max) * 100);
    };

    updateMetrics();
    el.addEventListener("scroll", updateMetrics, { passive: true });
    window.addEventListener("resize", updateMetrics);
    return () => {
      el.removeEventListener("scroll", updateMetrics);
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  const handleTabWheel = (event: WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className="bg-[radial-gradient(circle_at_15%_15%,rgba(97,138,196,0.12),transparent_38%),linear-gradient(180deg,#04070d_0%,#071224_55%,#05080f_100%)]">
      <section className="scroll-mt-24 border-b border-border/45 pt-4 pb-12 md:pb-16 md:pt-6">
        <div className="mx-auto max-w-content space-y-5 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: LUX_EASE }}
            className="rounded-2xl border border-metal-bronze/35 bg-surface/65 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.35)] md:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-gold/90 md:text-xs">
                  {t("heroEyebrow")}
                </p>
                <h1 className="mt-2 font-sans text-3xl font-bold tracking-[-0.02em] text-brand-gold md:text-4xl lg:text-5xl">
                  {t("heroTitle")}
                </h1>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <p className="rounded-xl border border-metal-bronze/30 bg-black/20 px-3 py-2.5 text-sm text-tone-body md:text-base">
                  {t("tollIncluded")}
                </p>
                <div className="rounded-xl border border-brand-gold/45 bg-brand-gold-soft px-3 py-2.5 text-xs font-semibold text-[#f6e8bd] md:text-sm">
                  {t("extraFeeNotice")}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: LUX_EASE, delay: 0.05 }}
            className="rounded-3xl border border-white/10 bg-[#0a1324]/80 p-5 md:p-7"
          >
            <div className="border-b border-white/10 pb-5">
              <div className="relative xl:hidden">
                <div
                  ref={scrollRef}
                  onWheel={handleTabWheel}
                  className="scrollbar-hide overflow-x-auto"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0, black 28px, black calc(100% - 28px), transparent 100%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0, black 28px, black calc(100% - 28px), transparent 100%)",
                  }}
                >
                  <div className="inline-flex min-w-max items-stretch rounded-xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-md">
                    {displayRegions.map((region, index) => {
                      const active = region.id === activeRegion;
                      const withDivider = index !== displayRegions.length - 1;
                      return (
                        <div
                          key={`mobile-${region.id}`}
                          className={`relative flex items-center ${withDivider ? "border-r border-white/10" : ""}`}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveRegion(region.id)}
                            className={`relative z-10 min-w-[150px] rounded-lg px-5 py-3 text-left transition-colors ${
                              active ? "text-[#1a1204]" : "text-tone-soft hover:text-tone-sky"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="pricing-segment-active-mobile"
                                transition={LUX_TRANSITION}
                                className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#b38a44] via-[#9b6b4a] to-[#b38a44] shadow-[0_4px_12px_rgba(140,96,66,0.22)]"
                              />
                            )}
                            <span className="block text-base font-bold">{region.name}</span>
                            <span className={`block text-xs ${active ? "text-accent-foreground/85" : "text-tone-soft"}`}>
                              {region.nameEn}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 h-[2px] rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: canScroll ? `${Math.max(scrollProgress, 8)}%` : "100%" }}
                    transition={LUX_TRANSITION}
                    className="h-full rounded-full bg-gradient-to-r from-metal-bronze/45 to-metal-bronze-strong/85"
                  />
                </div>
              </div>

              <div
                className="hidden rounded-xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-md xl:grid"
                style={{ gridTemplateColumns: `repeat(${displayRegions.length}, minmax(0, 1fr))` }}
              >
                {displayRegions.map((region, index) => {
                  const active = region.id === activeRegion;
                  const withDivider = index !== displayRegions.length - 1;
                  return (
                    <div
                      key={`desktop-${region.id}`}
                      className={`relative flex items-center ${withDivider ? "border-r border-white/10" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveRegion(region.id)}
                        className={`relative z-10 min-h-[74px] w-full rounded-lg px-5 py-3 text-left transition-colors ${
                          active ? "text-[#1a1204]" : "text-tone-soft hover:text-tone-sky"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="pricing-segment-active-desktop"
                            transition={LUX_TRANSITION}
                            className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#b38a44] via-[#9b6b4a] to-[#b38a44] shadow-[0_4px_12px_rgba(140,96,66,0.22)]"
                          />
                        )}
                        <span className="block text-lg font-bold">{region.name}</span>
                        <span className={`block text-sm ${active ? "text-accent-foreground/85" : "text-tone-soft"}`}>
                          {region.nameEn}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="pricing-search" className="mb-2 block text-sm text-tone-soft md:text-base">
                {t("searchLabel")}
              </label>
              <input
                id="pricing-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-base text-tone-strong outline-none transition-colors placeholder:text-tone-soft focus:border-metal-bronze-strong md:text-lg"
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-brand-deep/65 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-metal-bronze-strong md:grid-cols-[1.9fr_1fr_1fr] md:px-5 md:text-base">
                <p>{t("colRegion")}</p>
                <p className="font-numeric tabular-nums text-[10px] leading-tight md:text-base">{t("colGimpo")}</p>
                <p className="font-numeric tabular-nums text-[10px] leading-tight md:text-base">{t("colIncheon")}</p>
              </div>
              <motion.div
                className="divide-y divide-white/10 bg-[#081121]/80"
                key={`${currentRegion.id}-${query}`}
                variants={LIST_VARIANTS}
                initial="hidden"
                animate="show"
              >
                {filteredEntries.length === 0 ? (
                  currentRegion.id === "others" ? (
                    <div className="flex flex-col gap-5 px-4 py-6 sm:px-5 md:flex-row md:items-center md:justify-between md:gap-8">
                      <p className="min-w-0 flex-1 text-base leading-relaxed text-tone-soft md:text-lg">
                        {t("othersNotice")}
                      </p>
                      <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                        <a
                          href={phoneTel}
                          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-emerald-50 transition-colors hover:bg-emerald-500"
                        >
                          {t("othersPhone")}
                        </a>
                        <a
                          href={links.kakao}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#FEE500]/80 bg-[#FEE500] px-5 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-95"
                        >
                          {t("othersKakao")}
                        </a>
                        <Link
                          href={SITE_WEB_INQUIRY_PATH}
                          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] px-5 text-sm font-semibold text-tone-strong transition-colors hover:bg-white/12"
                        >
                          {t("othersWeb")}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="px-5 py-8 text-base text-tone-soft md:text-lg">{t("searchEmpty")}</p>
                  )
                ) : (
                  filteredEntries.map((entry) =>
                    isManagedPricingGroup(entry) ? (
                      <div
                        key={`${currentRegion.id}-g-${entry.id}`}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMetroGroup(entry.id)}
                          className={cn(
                            "group grid w-full grid-cols-[1.9fr_1fr_1fr] items-center gap-2 px-4 py-4 text-left text-base transition-colors md:px-5 md:text-lg",
                            groupExpanded(entry.id)
                              ? "bg-brand-gold-soft/35 ring-1 ring-inset ring-metal-bronze/35"
                              : "bg-[#0d1a31]/55 hover:bg-[#12203b]/70 ring-1 ring-inset ring-tone-sky/20",
                          )}
                          aria-expanded={groupExpanded(entry.id)}
                        >
                          <span className="flex min-w-0 items-center gap-2 font-semibold text-tone-strong">
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 text-metal-bronze-strong transition-transform",
                                !groupExpanded(entry.id) && "-rotate-90",
                              )}
                              aria-hidden
                            />
                            <span className="min-w-0">
                              {entry.name}{" "}
                              <span className="font-normal text-tone-soft">({entry.nameEn})</span>
                            </span>
                          </span>
                          <span className="font-numeric tabular-nums text-tone-soft">—</span>
                          <span className="font-numeric tabular-nums text-tone-soft">—</span>
                        </button>
                        {!groupExpanded(entry.id) && (
                          <div className="px-4 pb-2 pt-1 md:px-5">
                            <button
                              type="button"
                              onClick={() => toggleMetroGroup(entry.id)}
                              className="inline-flex items-center rounded-full border border-tone-sky/35 bg-tone-sky/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-tone-sky transition hover:bg-tone-sky/15"
                            >
                              {t("expandSubRegions", { count: entry.rows.length })}
                            </button>
                          </div>
                        )}
                        {groupExpanded(entry.id) && (
                          <div className="bg-black/15">
                            {entry.rows.map((row) => (
                              <motion.article
                                key={`${currentRegion.id}-${entry.id}-${row.name}`}
                                variants={ROW_VARIANTS}
                                className="grid grid-cols-[1.6fr_1fr_1fr] items-center border-t border-white/5 px-4 py-3.5 pl-8 text-base md:grid-cols-[1.9fr_1fr_1fr] md:px-5 md:pl-10 md:text-lg"
                              >
                                <p className="font-medium text-tone-strong">
                                  {row.name}{" "}
                                  <span className="font-normal text-tone-soft">({row.nameEn})</span>
                                </p>
                                <p className="font-numeric tabular-nums text-[12px] text-metal-bronze-strong md:text-base">
                                  {KRW.format(row.gimpo)}{t("currencyUnit")}
                                </p>
                                <p className="font-numeric tabular-nums text-[12px] text-metal-bronze-strong md:text-base">
                                  {KRW.format(row.incheon)}{t("currencyUnit")}
                                </p>
                              </motion.article>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <motion.article
                        key={`${currentRegion.id}-${entry.name}`}
                        variants={ROW_VARIANTS}
                        className="grid grid-cols-[1.6fr_1fr_1fr] items-center px-4 py-4 text-base md:grid-cols-[1.9fr_1fr_1fr] md:px-5 md:text-lg"
                      >
                        <p className="font-semibold text-tone-strong">
                          {entry.name}{" "}
                          <span className="font-normal text-tone-soft">({entry.nameEn})</span>
                        </p>
                        <p className="font-numeric tabular-nums text-[12px] text-metal-bronze-strong md:text-base">
                          {KRW.format(entry.gimpo)}{t("currencyUnit")}
                        </p>
                        <p className="font-numeric tabular-nums text-[12px] text-metal-bronze-strong md:text-base">
                          {KRW.format(entry.incheon)}{t("currencyUnit")}
                        </p>
                      </motion.article>
                    ),
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
