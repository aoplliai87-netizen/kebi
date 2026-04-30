type SubpageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** 소형 라벨(eyebrow) → h1(title) → 본문(description) 순서 */
export function SubpageHero({ eyebrow, title, description }: SubpageHeroProps) {
  return (
    <section className="border-b border-border/45 py-24 md:py-28">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-surface to-brand-deep/60 px-6 py-10 md:px-10 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-tone-sky/95">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-balance font-sans text-5xl font-extrabold leading-[1.02] tracking-tight text-tone-strong md:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-tone-body md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
