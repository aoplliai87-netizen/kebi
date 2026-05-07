"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** 언어 순서: 한국어 → English → 日本語 → 中文 */
const DROPDOWN_LOCALES = ["ko", "en", "ja", "zh"] as const;

const SHORT_TAG: Record<string, string> = {
  ko: "KO",
  zh: "ZH",
  ja: "JA",
  en: "EN",
};

function nativeLabel(t: (key: string) => string, loc: string) {
  switch (loc) {
    case "ko":
      return t("langNativeKo");
    case "zh":
      return t("langNativeZh");
    case "ja":
      return t("langNativeJa");
    case "en":
      return t("langNativeEn");
    default:
      return loc;
  }
}

export function LanguageSwitcher() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const short = SHORT_TAG[locale] ?? locale.toUpperCase();

  return (
    <div
      ref={rootRef}
      className="relative"
    >
      <button
        type="button"
        className={cn(
          "inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-white/14 bg-black/35 px-2.5 py-2 text-xs font-bold tracking-wide text-white/90 shadow-inner shadow-black/30 transition-colors",
          "hover:border-brand-gold/45 hover:bg-white/8 hover:text-brand-gold sm:gap-2 sm:px-3 sm:text-[13px]",
          open && "border-brand-gold/50 text-brand-gold",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("langHint")}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="h-4 w-4 shrink-0 text-tone-sky/95" aria-hidden />
        <span className="tabular-nums">{short}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-[120] min-w-[10.5rem] overflow-hidden rounded-xl border border-black/10 bg-white py-1.5 text-sm text-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        >
          {DROPDOWN_LOCALES.map((loc) => {
            const active = locale === loc;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <Link
                  href={pathname}
                  locale={loc}
                  className={cn(
                    "block px-4 py-2.5 text-center font-medium transition-colors hover:bg-neutral-100",
                    active && "bg-amber-50 font-semibold text-neutral-950",
                  )}
                  onClick={() => {
                    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`;
                    setOpen(false);
                  }}
                >
                  {nativeLabel(t, loc)}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
