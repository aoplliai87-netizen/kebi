import type { ReactNode } from "react";

type SubpageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** 관리자 미리보기 전용 — 히어로 영역 우측 등 */
  adminChrome?: ReactNode;
};

/**
 * 서브페이지 공통 히어로 — 브랜드 골드 타이포로 차량/요금/리뷰 등 페이지 간 통일감 유지
 */
export function SubpageHero({ eyebrow, title, description, adminChrome }: SubpageHeroProps) {
  return (
    <section className="border-b border-border/45 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_55%),linear-gradient(180deg,#04070d_0%,#071224_45%,#05080f_100%)] py-16 md:py-20 lg:py-24">
      <div className="relative mx-auto max-w-content px-4 text-center md:px-6">
        {adminChrome ? (
          <div className="pointer-events-auto absolute right-4 top-0 z-10 md:right-6">{adminChrome}</div>
        ) : null}
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-gold/90 md:text-xs">
          {eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance font-sans text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-brand-gold md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-tone-body md:mt-5 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
