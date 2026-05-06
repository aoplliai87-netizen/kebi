"use client";

import { createContext, useContext } from "react";

export type SiteRuntimeConfig = {
  phoneDisplay: string;
  phoneTel: string;
  links: {
    kakao: string;
    instagram: string;
    whatsapp: string;
    line: string;
    messenger: string;
  };
};

const SiteRuntimeContext = createContext<SiteRuntimeConfig | null>(null);

export function SiteRuntimeProvider({
  value,
  children,
}: {
  value: SiteRuntimeConfig;
  children: React.ReactNode;
}) {
  return <SiteRuntimeContext.Provider value={value}>{children}</SiteRuntimeContext.Provider>;
}

export function useSiteRuntime() {
  const ctx = useContext(SiteRuntimeContext);
  if (!ctx) {
    throw new Error("useSiteRuntime must be used within SiteRuntimeProvider");
  }
  return ctx;
}
