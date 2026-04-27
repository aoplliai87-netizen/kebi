"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAV = [
  { msgKey: "navHome" as const, href: "/" },
  { msgKey: "navIntro" as const, href: "/intro" },
  { msgKey: "navVehicle" as const, href: "/vehicle" },
  { msgKey: "navPricing" as const, href: "/pricing" },
  { msgKey: "navBooking" as const, href: "/booking" },
  { msgKey: "navReview" as const, href: "/review" },
] as const;

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-brand-black/88 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center"
        >
          <Image
            src="/images/logo.png"
            alt={t("brand")}
            width={180}
            height={50}
            priority
            className="h-9 w-auto object-contain sm:h-10 md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-4 xl:flex" aria-label={t("navMain")}>
          {NAV.map(({ msgKey, href }) => (
            <Link
              key={msgKey}
              href={href}
              className="text-[11px] text-tone-soft transition-colors hover:text-tone-sky"
            >
              {t(msgKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label={t("langHint")}>
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={cn(
                  "min-w-[2.5rem] rounded-md px-2 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide transition-colors",
                  locale === loc
                    ? "bg-brand-gold text-accent-foreground shadow-sm"
                    : "text-tone-soft hover:bg-surface-elevated hover:text-tone-sky"
                )}
              >
                {loc === "ko" ? t("langKo") : t("langEn")}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
          </button>
        </div>
      </div>

      <div id="mobile-drawer" className={cn("fixed inset-0 z-50 xl:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <button
          type="button"
          className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
          aria-label={t("closeMenu")}
        />

        <div className={cn("absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-brand-black shadow-xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "translate-x-full")}> 
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">{t("brand")}</span>
            <button type="button" className="rounded-lg p-2 text-tone-soft hover:bg-surface hover:text-tone-sky" onClick={() => setOpen(false)} aria-label={t("closeMenu")}>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label={t("navMain")}>
            {NAV.map(({ msgKey, href }) => (
              <Link key={msgKey} href={href} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-surface" onClick={() => setOpen(false)}>
                {t(msgKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}