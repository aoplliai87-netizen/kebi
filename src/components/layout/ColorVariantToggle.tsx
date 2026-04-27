"use client";

import { useEffect, useState } from "react";

type Variant = "a" | "b";

const STORAGE_KEY = "kebi-color-variant";

function applyVariant(variant: Variant) {
  document.documentElement.setAttribute("data-color-variant", variant);
}

export function ColorVariantToggle() {
  const [variant, setVariant] = useState<Variant>("a");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "a" || saved === "b") {
      setVariant(saved);
      applyVariant(saved);
      return;
    }
    applyVariant("a");
  }, []);

  const selectVariant = (next: Variant) => {
    setVariant(next);
    applyVariant(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[70] rounded-xl border border-white/20 bg-black/70 p-1.5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => selectVariant("a")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            variant === "a"
              ? "bg-brand-gold text-accent-foreground"
              : "text-tone-soft hover:bg-surface-elevated hover:text-tone-sky"
          }`}
        >
          A버전
        </button>
        <button
          type="button"
          onClick={() => selectVariant("b")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            variant === "b"
              ? "bg-brand-gold text-accent-foreground"
              : "text-tone-soft hover:bg-surface-elevated hover:text-tone-sky"
          }`}
        >
          B버전
        </button>
      </div>
    </div>
  );
}
