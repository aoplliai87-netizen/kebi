import { Fragment, createElement, type ReactNode } from "react";

/** Intro 소개문 등에서 `<brand>텍스트</brand>` → 금색 강조 span (IntroPage.hero.desc 와 동일 계열) */
export function renderIntroBrandMarkup(text: string): ReactNode {
  if (!text) return null;
  const parts = text.split(/(<brand>[\s\S]*?<\/brand>)/g);
  return parts.map((part, i) => {
    const m = part.match(/^<brand>([\s\S]*?)<\/brand>$/);
    if (m) {
      return createElement(
        "span",
        { key: i, className: "font-semibold text-brand-gold" },
        m[1],
      );
    }
    return createElement(Fragment, { key: i }, part);
  });
}
