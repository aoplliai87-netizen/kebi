"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import { BespokeBookingExperience } from "@/components/booking/BespokeBookingExperience";
import { SiteRuntimeProvider } from "@/components/providers/SiteRuntimeProvider";
import {
  AdminVisualModal,
  AdminVisualToolbar,
  BtnEdit,
} from "@/components/admin/admin-visual-editor-primitives";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { effectiveText } from "@/lib/admin-visual-effective";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { SITE_PHONE_TEL } from "@/lib/site";
import { pickSubpageLocalized } from "@/lib/subpages-content";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  mergedContact: { kakao: string; instagram: string; whatsapp: string; line: string; messenger: string };
};

export function AdminBookingVisualEditor({ initial, fallbackHints, messagesByLocale, mergedContact }: Props) {
  const router = useRouter();
  const [previewLocale, setPreviewLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"intro" | null>(null);
  const [editLocale, setEditLocale] = useState<LocaleKey>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fb = fallbackHints.subpages.booking;

  useEffect(() => {
    setSettings(initial);
  }, [initial]);

  useEffect(() => {
    if (panel) setEditLocale(previewLocale);
  }, [panel, previewLocale]);

  const localeMessages = messagesByLocale[previewLocale];
  const booking = settings.subpages.booking;
  const title =
    pickSubpageLocalized(booking.title, previewLocale) || fb.title[previewLocale];
  const description =
    pickSubpageLocalized(booking.description, previewLocale) || fb.description[previewLocale];

  const runtimeConfig = useMemo(
    () => ({
      phoneDisplay: settings.phoneDisplay,
      phoneTel: settings.phoneTel || SITE_PHONE_TEL,
      links: mergedContact,
    }),
    [settings.phoneDisplay, settings.phoneTel, mergedContact],
  );

  const persist = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = normalizeSiteSettingsForPersist(settings, messagesByLocale);
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as { ok?: boolean; message?: string };
      if (result.ok) {
        setMessage("저장되었습니다.");
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

  const resetIntroFields = () => {
    const loc = editLocale;
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        booking: {
          ...s.subpages.booking,
          title: { ...s.subpages.booking.title, [loc]: "" },
          description: { ...s.subpages.booking.description, [loc]: "" },
        },
      },
    }));
  };

  return (
    <section className="space-y-4">
      <AdminVisualToolbar
        previewLocale={previewLocale}
        onPreviewLocale={setPreviewLocale}
        onSave={persist}
        saving={saving}
      />
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <NextIntlClientProvider locale={previewLocale} messages={localeMessages}>
          <SiteRuntimeProvider value={runtimeConfig}>
            <BespokeBookingExperience
              locale={previewLocale}
              title={title}
              description={description}
              bookingIntroAdminChrome={<BtnEdit onClick={() => setPanel("intro")} />}
            />
          </SiteRuntimeProvider>
        </NextIntlClientProvider>
      </div>

      <AdminVisualModal
        open={panel === "intro"}
        title="예약 페이지 · 소개 문구"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetIntroFields}
      >
        <div>
          <label className="text-xs text-tone-soft">제목</label>
          <input
            value={effectiveText(settings.subpages.booking.title[editLocale] ?? "", fb.title[editLocale])}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                subpages: {
                  ...s.subpages,
                  booking: {
                    ...s.subpages.booking,
                    title: { ...s.subpages.booking.title, [editLocale]: e.target.value },
                  },
                },
              }))
            }
            className="mt-1 h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-tone-soft">설명</label>
          <textarea
            rows={5}
            value={effectiveText(
              settings.subpages.booking.description[editLocale] ?? "",
              fb.description[editLocale],
            )}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                subpages: {
                  ...s.subpages,
                  booking: {
                    ...s.subpages.booking,
                    description: { ...s.subpages.booking.description, [editLocale]: e.target.value },
                  },
                },
              }))
            }
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
      </AdminVisualModal>
    </section>
  );
}
