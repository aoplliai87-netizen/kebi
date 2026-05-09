"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AdminVisualModal,
  AdminVisualToolbar,
  BtnEdit,
} from "@/components/admin/admin-visual-editor-primitives";
import { BespokeSupportExperience } from "@/components/support/BespokeSupportExperience";
import { SiteRuntimeProvider } from "@/components/providers/SiteRuntimeProvider";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { effectiveText } from "@/lib/admin-visual-effective";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { SITE_PHONE_TEL } from "@/lib/site";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  mergedContact: { kakao: string; instagram: string; whatsapp: string; line: string; messenger: string };
};

export function AdminInquiryVisualEditor({ initial, fallbackHints, messagesByLocale, mergedContact }: Props) {
  const router = useRouter();
  const [previewLocale, setPreviewLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"hero" | "faq" | "form" | "contact" | null>(null);
  const [editLocale, setEditLocale] = useState<LocaleKey>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const q = settings.subpages.inquiry;
  const fb = fallbackHints.subpages.inquiry;

  useEffect(() => {
    setSettings(initial);
  }, [initial]);

  useEffect(() => {
    if (panel) setEditLocale(previewLocale);
  }, [panel, previewLocale]);

  const localeMessages = messagesByLocale[previewLocale];

  const runtimeConfig = useMemo(
    () => ({
      phoneDisplay: settings.phoneDisplay,
      phoneTel: settings.phoneTel || SITE_PHONE_TEL,
      links: mergedContact,
    }),
    [settings.phoneDisplay, settings.phoneTel, mergedContact],
  );

  const overrides = useMemo(
    () => ({
      heroEyebrow: q.heroEyebrow[previewLocale],
      heroTitle: q.heroTitle[previewLocale],
      heroDesc: q.heroDesc[previewLocale],
      faqTitle: q.faqTitle[previewLocale],
      faqQ1: q.faqItems[0].q[previewLocale],
      faqA1: q.faqItems[0].a[previewLocale],
      faqQ2: q.faqItems[1].q[previewLocale],
      faqA2: q.faqItems[1].a[previewLocale],
      faqQ3: q.faqItems[2].q[previewLocale],
      faqA3: q.faqItems[2].a[previewLocale],
      faqQ4: q.faqItems[3].q[previewLocale],
      faqA4: q.faqItems[3].a[previewLocale],
      faqQ5: q.faqItems[4].q[previewLocale],
      faqA5: q.faqItems[4].a[previewLocale],
      formTitle: q.formTitle[previewLocale],
      formDesc: q.formDesc[previewLocale],
      contactSectionTitle: q.contactSectionTitle[previewLocale],
      contactSectionDesc: q.contactSectionDesc[previewLocale],
    }),
    [q, previewLocale],
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

  const loc = editLocale;
  const resetHero = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        inquiry: {
          ...s.subpages.inquiry,
          heroEyebrow: { ...s.subpages.inquiry.heroEyebrow, [loc]: "" },
          heroTitle: { ...s.subpages.inquiry.heroTitle, [loc]: "" },
          heroDesc: { ...s.subpages.inquiry.heroDesc, [loc]: "" },
        },
      },
    }));

  const resetFaq = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        inquiry: {
          ...s.subpages.inquiry,
          faqTitle: { ...s.subpages.inquiry.faqTitle, [loc]: "" },
          faqItems: s.subpages.inquiry.faqItems.map((item) => ({
            q: { ...item.q, [loc]: "" },
            a: { ...item.a, [loc]: "" },
          })),
        },
      },
    }));

  const resetForm = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        inquiry: {
          ...s.subpages.inquiry,
          formTitle: { ...s.subpages.inquiry.formTitle, [loc]: "" },
          formDesc: { ...s.subpages.inquiry.formDesc, [loc]: "" },
        },
      },
    }));

  const resetContact = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        inquiry: {
          ...s.subpages.inquiry,
          contactSectionTitle: { ...s.subpages.inquiry.contactSectionTitle, [loc]: "" },
          contactSectionDesc: { ...s.subpages.inquiry.contactSectionDesc, [loc]: "" },
        },
      },
    }));

  return (
    <section className="space-y-4">
      <AdminVisualToolbar previewLocale={previewLocale} onPreviewLocale={setPreviewLocale} onSave={persist} saving={saving} />
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <NextIntlClientProvider locale={previewLocale} messages={localeMessages}>
          <SiteRuntimeProvider value={runtimeConfig}>
            <BespokeSupportExperience
              contentOverrides={overrides}
              adminHeroChrome={<BtnEdit onClick={() => setPanel("hero")} />}
              adminFaqChrome={<BtnEdit onClick={() => setPanel("faq")} />}
              adminFormChrome={<BtnEdit onClick={() => setPanel("form")} />}
              adminContactChrome={<BtnEdit onClick={() => setPanel("contact")} />}
            />
          </SiteRuntimeProvider>
        </NextIntlClientProvider>
      </div>

      <AdminVisualModal
        open={panel === "hero"}
        title="문의 · 히어로"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetHero}
      >
        <input
          value={effectiveText(q.heroEyebrow[editLocale] ?? "", fb.heroEyebrow[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  heroEyebrow: { ...s.subpages.inquiry.heroEyebrow, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(q.heroTitle[editLocale] ?? "", fb.heroTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  heroTitle: { ...s.subpages.inquiry.heroTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={3}
          value={effectiveText(q.heroDesc[editLocale] ?? "", fb.heroDesc[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  heroDesc: { ...s.subpages.inquiry.heroDesc, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "faq"}
        title="문의 · FAQ"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetFaq}
      >
        <input
          value={effectiveText(q.faqTitle[editLocale] ?? "", fb.faqTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  faqTitle: { ...s.subpages.inquiry.faqTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="mb-2 text-xs text-brand-gold">FAQ {i + 1}</p>
            <textarea
              rows={2}
              value={effectiveText(q.faqItems[i].q[editLocale] ?? "", fb.faqItems[i].q[editLocale])}
              onChange={(e) =>
                setSettings((s) => {
                  const n = [...s.subpages.inquiry.faqItems];
                  n[i] = { ...n[i], q: { ...n[i].q, [editLocale]: e.target.value } };
                  return { ...s, subpages: { ...s.subpages, inquiry: { ...s.subpages.inquiry, faqItems: n } } };
                })
              }
              className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
            />
            <textarea
              rows={3}
              value={effectiveText(q.faqItems[i].a[editLocale] ?? "", fb.faqItems[i].a[editLocale])}
              onChange={(e) =>
                setSettings((s) => {
                  const n = [...s.subpages.inquiry.faqItems];
                  n[i] = { ...n[i], a: { ...n[i].a, [editLocale]: e.target.value } };
                  return { ...s, subpages: { ...s.subpages, inquiry: { ...s.subpages.inquiry, faqItems: n } } };
                })
              }
              className="mt-2 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "form"}
        title="문의 · 폼 안내 문구"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetForm}
      >
        <input
          value={effectiveText(q.formTitle[editLocale] ?? "", fb.formTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  formTitle: { ...s.subpages.inquiry.formTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={3}
          value={effectiveText(q.formDesc[editLocale] ?? "", fb.formDesc[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  formDesc: { ...s.subpages.inquiry.formDesc, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "contact"}
        title="문의 · 연락 채널 안내"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetContact}
      >
        <input
          value={effectiveText(q.contactSectionTitle[editLocale] ?? "", fb.contactSectionTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  contactSectionTitle: { ...s.subpages.inquiry.contactSectionTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={3}
          value={effectiveText(q.contactSectionDesc[editLocale] ?? "", fb.contactSectionDesc[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                inquiry: {
                  ...s.subpages.inquiry,
                  contactSectionDesc: { ...s.subpages.inquiry.contactSectionDesc, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>
    </section>
  );
}
