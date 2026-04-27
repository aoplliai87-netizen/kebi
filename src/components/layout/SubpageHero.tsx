type SubpageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SubpageHero({ eyebrow, title, description }: SubpageHeroProps) {
  return (
    <section className="border-b border-border/45 py-24 md:py-28">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-surface to-brand-deep/60 px-6 py-10 md:px-10 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold/95">
            SECTION GUIDE
          </p>
          <h1 className="mt-4 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-tone-strong md:text-7xl">
            {eyebrow}
          </h1>
          <p className="mt-5 max-w-3xl text-xl font-semibold leading-snug text-tone-sky md:text-2xl">
            {title}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-tone-body md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
