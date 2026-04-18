"use client";

import { useTranslations, useLocale } from "next-intl";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_PHONE_TEL } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { msgKey: "navService" as const, hash: "#services" },
  { msgKey: "navReviews" as const, hash: "#reviews" },
  { msgKey: "navContact" as const, hash: "#contact" },
] as const;

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const pathWithHash = (hash: string) => `${pathname}${hash}`;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-brand-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground sm:text-base"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-deep text-xs font-bold text-primary-foreground">
            KV
          </span>
          <span className="truncate sm:inline">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label={t("navMain")}>
          {NAV.map(({ msgKey, hash }) => (
            <Link
              key={msgKey}
              href={pathWithHash(hash)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {t(msgKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex rounded-lg border border-border bg-surface p-0.5"
            role="group"
            aria-label={t("langHint")}
          >
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={cn(
                  "min-w-[2.75rem] rounded-md px-2 py-1.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors sm:min-w-[3rem] sm:text-[13px]",
                  locale === loc
                    ? "bg-brand-gold text-accent-foreground shadow-sm"
                    : "text-muted hover:bg-surface-elevated hover:text-foreground"
                )}
              >
                {loc === "ko" ? t("langKo") : t("langEn")}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
          aria-label={t("closeMenu")}
        />

        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-brand-black shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">{t("brand")}</span>
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label={t("navMain")}>
            {NAV.map(({ msgKey, hash }) => (
              <Link
                key={msgKey}
                href={pathWithHash(hash)}
                className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {t(msgKey)}
              </Link>
            ))}
            <a
              href={SITE_PHONE_TEL}
              className="mt-auto flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-3 text-sm font-medium text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              {t("navContact")}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
