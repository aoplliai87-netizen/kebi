"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import { AdminVisualToolbar } from "@/components/admin/admin-visual-editor-primitives";
import { AdminPricingTableEditor } from "@/components/admin/AdminPricingTableEditor";
import { BespokePricingExperience } from "@/components/pricing/BespokePricingExperience";
import { SiteRuntimeProvider, type SiteRuntimeConfig } from "@/components/providers/SiteRuntimeProvider";
import type { ManagedPricingRegion } from "@/lib/pricing-table-types";
import type { LocaleKey } from "@/lib/site-settings-store";

type Props = {
  initialRegions: ManagedPricingRegion[];
  runtimeConfig: SiteRuntimeConfig;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
};

export function AdminPricingVisualEditor({ initialRegions, runtimeConfig, messagesByLocale }: Props) {
  const router = useRouter();
  const [previewLocale, setPreviewLocale] = useState<LocaleKey>("ko");
  const [regions, setRegions] = useState<ManagedPricingRegion[]>(initialRegions);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRegions(initialRegions);
  }, [initialRegions]);

  const persist = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/pricing-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions }),
      });
      const result = (await res.json()) as { ok: boolean; message?: string };
      if (result.ok) {
        setMessage("요금표가 저장되었습니다. 공개 `/pricing`에 반영됩니다.");
        router.refresh();
      } else {
        setMessage(result.message ?? "저장 실패");
      }
    } catch {
      setMessage("저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const reloadFromServer = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/admin/pricing-table", { cache: "no-store" });
      const result = (await res.json()) as { ok?: boolean; regions?: ManagedPricingRegion[] };
      if (result.ok && Array.isArray(result.regions)) {
        setRegions(result.regions);
        setMessage("서버에 저장된 최신 요금표를 불러왔습니다.");
      }
    } catch {
      setMessage("불러오기 실패");
    }
  };

  return (
    <section className="space-y-6">
      <AdminVisualToolbar
        previewLocale={previewLocale}
        onPreviewLocale={setPreviewLocale}
        onSave={persist}
        saving={saving}
        extra={
          <button
            type="button"
            onClick={() => void reloadFromServer()}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-tone-strong"
          >
            저장값 다시 불러오기
          </button>
        }
      />
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <NextIntlClientProvider locale={previewLocale} messages={messagesByLocale[previewLocale]}>
          <SiteRuntimeProvider value={runtimeConfig}>
            <BespokePricingExperience initialRegions={regions} />
          </SiteRuntimeProvider>
        </NextIntlClientProvider>
      </div>

      <AdminPricingTableEditor
        initialRegions={initialRegions}
        regions={regions}
        onRegionsChange={setRegions}
        hidePersistenceBar
      />
    </section>
  );
}
