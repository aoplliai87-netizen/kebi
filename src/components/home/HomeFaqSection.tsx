"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type HomeFaqItem = { q: string; a: string };

type Props = {
  eyebrow: string;
  title: string;
  items: HomeFaqItem[];
};

export function HomeFaqSection({ eyebrow, title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section className="mx-auto max-w-content px-4 pb-24 md:px-6">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong md:text-[13px]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-[-0.02em] text-tone-sky md:text-4xl">
          {title}
        </h2>
      </div>

      <ul className="mt-10 space-y-3">
        {items.map((item, idx) => {
          const n = idx + 1;
          const isOpen = openIndex === n;
          return (
            <li
              key={`faq-${n}-${item.q.slice(0, 24)}`}
              className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.02]"
            >
              <button
                type="button"
                onClick={() => toggle(n)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="whitespace-pre-line text-base font-semibold text-tone-strong md:text-lg">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-metal-bronze-strong transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="border-t border-white/10 px-5 pb-5 pt-4 whitespace-pre-line text-base leading-relaxed text-tone-body">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
