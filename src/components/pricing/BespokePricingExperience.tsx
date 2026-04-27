"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { pricingRegions } from "@/constants/pricingData";
import { SITE_KAKAO_CHAT_URL, SITE_PHONE_TEL } from "@/lib/site";
import { Button } from "@/components/ui/Button";

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

export function BespokePricingExperience() {
  const [activeRegion, setActiveRegion] = useState(pricingRegions[0]?.id ?? "seoul");
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const currentRegion = useMemo(
    () => pricingRegions.find((region) => region.id === activeRegion) ?? pricingRegions[0],
    [activeRegion]
  );

  const filteredRows = useMemo(() => {
    const normalized = normalize(query.trim());
    if (!normalized) return currentRegion.rows;
    return currentRegion.rows.filter(
      (row) =>
        normalize(row.name).includes(normalized) ||
        normalize(row.nameEn).includes(normalized)
    );
  }, [currentRegion, query]);

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
      <section className="border-b border-border/45 py-20 md:py-24">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={LUX_TRANSITION}
            className="rounded-3xl border border-metal-bronze/35 bg-surface/65 p-7 shadow-[0_18px_52px_rgba(0,0,0,0.35)] md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-metal-bronze-strong">
              PRICING GUIDE
            </p>
            <h1 className='mt-4 font-["Times_New_Roman","Georgia",serif] text-5xl font-bold tracking-[-0.02em] text-tone-strong md:text-6xl'>
              정찰제 운임 안내
            </h1>
            <p className="mt-5 rounded-2xl border border-metal-bronze/30 bg-black/20 px-4 py-3 text-base text-tone-body md:text-lg">
              본 요금표는 고속도로 통행료가 포함된 정찰제 금액입니다.
            </p>
            <div className="mt-4 rounded-2xl border border-brand-gold/45 bg-brand-gold-soft px-4 py-3 text-sm font-semibold text-[#f6e8bd] md:text-base">
              스타리아/카니발 6인 이상 탑승 시 추가 요금이 발생할 수 있습니다.
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/45 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={LUX_TRANSITION}
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
                    {pricingRegions.map((region, index) => {
                      const active = region.id === activeRegion;
                      const withDivider = index !== pricingRegions.length - 1;
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

              <div className="hidden grid-cols-5 rounded-xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-md xl:grid">
                {pricingRegions.map((region, index) => {
                  const active = region.id === activeRegion;
                  const withDivider = index !== pricingRegions.length - 1;
                  const withRowDivider = index < 5;
                  return (
                    <div
                      key={`desktop-${region.id}`}
                      className={`relative flex items-center ${withDivider ? "border-r border-white/10" : ""} ${withRowDivider ? "border-b border-white/10" : ""}`}
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
                내 지역 검색하기 (Search your area)
              </label>
              <input
                id="pricing-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: 강남 / Gangnam / Suwon"
                className="h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-base text-tone-strong outline-none transition-colors placeholder:text-tone-soft focus:border-metal-bronze-strong md:text-lg"
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.9fr_1fr_1fr_0.8fr] bg-brand-deep/65 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-metal-bronze-strong md:px-5 md:text-base">
                <p>지역명(영어명)</p>
                <p>요금(김포)</p>
                <p>요금(인천)</p>
                <p>거리(km)</p>
              </div>
              <motion.div
                className="divide-y divide-white/10 bg-[#081121]/80"
                key={`${currentRegion.id}-${query}`}
                variants={LIST_VARIANTS}
                initial="hidden"
                animate="show"
              >
                {filteredRows.length === 0 ? (
                  <p className="px-5 py-8 text-base text-tone-soft md:text-lg">
                    검색 결과가 없습니다. 다른 지역명(한글/영문)으로 검색해 주세요.
                  </p>
                ) : (
                  filteredRows.map((row) => (
                    <motion.article
                      key={`${currentRegion.id}-${row.name}`}
                      variants={ROW_VARIANTS}
                      className="grid grid-cols-[1.9fr_1fr_1fr_0.8fr] items-center px-4 py-4 text-base md:px-5 md:text-lg"
                    >
                      <p className="font-semibold text-tone-strong">
                        {row.name} <span className="font-normal text-tone-soft">({row.nameEn})</span>
                      </p>
                      <p className="text-metal-bronze-strong">{KRW.format(row.gimpo)}원</p>
                      <p className="text-metal-bronze-strong">{KRW.format(row.incheon)}원</p>
                      <p className="text-tone-body">{row.distanceKm ? row.distanceKm : "-"}</p>
                    </motion.article>
                  ))
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={LUX_TRANSITION}
            className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8"
          >
            <h2 className='font-["Times_New_Roman","Georgia",serif] text-4xl font-bold tracking-[-0.02em] text-tone-sky md:text-5xl'>
              자주 묻는 질문
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-tone-strong">야간/새벽에도 요금이 동일한가요?</p>
                <p className="mt-2 text-sm leading-relaxed text-tone-body">
                  기본 표준 운임을 적용하며, 심야 대기나 특별 요청이 있을 경우 사전 안내 후 반영됩니다.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-tone-strong">왕복 예약은 어떻게 계산되나요?</p>
                <p className="mt-2 text-sm leading-relaxed text-tone-body">
                  대기 시간과 귀환 일정 포함 여부에 따라 맞춤 정찰제로 별도 안내드립니다.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-tone-strong">짐이 많아도 이용 가능한가요?</p>
                <p className="mt-2 text-sm leading-relaxed text-tone-body">
                  캐리어/골프백/유아용품 동반 수량을 전달해주시면 차량 타입에 맞춰 안전하게 배차합니다.
                </p>
              </article>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={LUX_TRANSITION}
            className="mt-8 rounded-3xl border border-metal-bronze/35 bg-gradient-to-r from-brand-deep/55 to-surface p-6 md:p-8"
          >
            <p className="text-sm text-tone-body">빠른 상담이 필요하신가요?</p>
            <h3 className='mt-2 font-["Times_New_Roman","Georgia",serif] text-3xl font-bold tracking-[-0.02em] text-tone-strong md:text-4xl'>
              전화/카톡 상담으로 즉시 요금 확인
            </h3>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={SITE_PHONE_TEL}>
                <Button className="h-12 rounded-xl px-6 text-sm font-semibold">
                  전화 상담하기
                </Button>
              </a>
              <a href={SITE_KAKAO_CHAT_URL} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-metal-bronze/40 px-6 text-sm font-semibold text-tone-sky"
                >
                  카톡 상담하기
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
