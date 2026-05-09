"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AdminVisualModal,
  AdminVisualToolbar,
  BtnEdit,
} from "@/components/admin/admin-visual-editor-primitives";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { BespokeReviewExperience } from "@/components/review/BespokeReviewExperience";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { effectiveText } from "@/lib/admin-visual-effective";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import { pickLocalized } from "@/lib/home-sections";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { pickSubpageLocalized } from "@/lib/subpages-content";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
};

export function AdminReviewVisualEditor({ initial, fallbackHints, messagesByLocale }: Props) {
  const router = useRouter();
  const [previewLocale, setPreviewLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"hero" | "samples" | null>(null);
  const [editLocale, setEditLocale] = useState<LocaleKey>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fr = fallbackHints.subpages.review;

  useEffect(() => {
    setSettings(initial);
  }, [initial]);

  useEffect(() => {
    if (panel) setEditLocale(previewLocale);
  }, [panel, previewLocale]);

  const localeMessages = messagesByLocale[previewLocale];
  const reviewCms = settings.subpages.review;
  const homeReviews = settings.home.reviews;
  const rows = [
    { content: pickLocalized(homeReviews.one.content, previewLocale), author: pickLocalized(homeReviews.one.author, previewLocale) },
    { content: pickLocalized(homeReviews.two.content, previewLocale), author: pickLocalized(homeReviews.two.author, previewLocale) },
    { content: pickLocalized(homeReviews.three.content, previewLocale), author: pickLocalized(homeReviews.three.author, previewLocale) },
  ];
  const showRows = rows.every((r) => r.content.trim() && r.author.trim());

  const hero = useMemo(
    () => ({
      eyebrow:
        pickSubpageLocalized(reviewCms.heroEyebrow, previewLocale) ||
        fr.heroEyebrow[previewLocale],
      title:
        pickSubpageLocalized(reviewCms.heroTitle, previewLocale) ||
        fr.heroTitle[previewLocale],
      desc:
        pickSubpageLocalized(reviewCms.heroDesc, previewLocale) ||
        fr.heroDesc[previewLocale],
    }),
    [reviewCms, previewLocale, fr],
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

  const resetHero = () => {
    const loc = editLocale;
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        review: {
          ...s.subpages.review,
          heroEyebrow: { ...s.subpages.review.heroEyebrow, [loc]: "" },
          heroTitle: { ...s.subpages.review.heroTitle, [loc]: "" },
          heroDesc: { ...s.subpages.review.heroDesc, [loc]: "" },
        },
      },
    }));
  };

  const resetSamples = () => {
    const loc = editLocale;
    setSettings((s) => ({
      ...s,
      home: {
        ...s.home,
        reviews: {
          ...s.home.reviews,
          one: {
            ...s.home.reviews.one,
            content: { ...s.home.reviews.one.content, [loc]: "" },
            author: { ...s.home.reviews.one.author, [loc]: "" },
          },
          two: {
            ...s.home.reviews.two,
            content: { ...s.home.reviews.two.content, [loc]: "" },
            author: { ...s.home.reviews.two.author, [loc]: "" },
          },
          three: {
            ...s.home.reviews.three,
            content: { ...s.home.reviews.three.content, [loc]: "" },
            author: { ...s.home.reviews.three.author, [loc]: "" },
          },
        },
      },
    }));
  };

  return (
    <section className="space-y-4">
      <AdminVisualToolbar previewLocale={previewLocale} onPreviewLocale={setPreviewLocale} onSave={persist} saving={saving} />
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <NextIntlClientProvider locale={previewLocale} messages={localeMessages}>
          <SubpageHero
            eyebrow={hero.eyebrow}
            title={hero.title}
            description={hero.desc}
            adminChrome={<BtnEdit onClick={() => setPanel("hero")} />}
          />
          <BespokeReviewExperience
            sampleReviews={showRows ? rows : []}
            samplesAdminChrome={<BtnEdit onClick={() => setPanel("samples")} />}
          />
        </NextIntlClientProvider>
      </div>

      <AdminVisualModal
        open={panel === "hero"}
        title="리뷰 페이지 · 히어로"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetHero}
      >
        <input
          value={effectiveText(settings.subpages.review.heroEyebrow[editLocale] ?? "", fr.heroEyebrow[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                review: {
                  ...s.subpages.review,
                  heroEyebrow: { ...s.subpages.review.heroEyebrow, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(settings.subpages.review.heroTitle[editLocale] ?? "", fr.heroTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                review: {
                  ...s.subpages.review,
                  heroTitle: { ...s.subpages.review.heroTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={4}
          value={effectiveText(settings.subpages.review.heroDesc[editLocale] ?? "", fr.heroDesc[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                review: {
                  ...s.subpages.review,
                  heroDesc: { ...s.subpages.review.heroDesc, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "samples"}
        title="홈 · 샘플 후기 (3건 모두 입력 시 공개)"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetSamples}
      >
        {(["one", "two", "three"] as const).map((slot, idx) => (
          <div key={slot} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="mb-2 text-xs font-semibold text-brand-gold">샘플 {idx + 1}</p>
            <textarea
              rows={3}
              value={effectiveText(
                settings.home.reviews[slot].content[editLocale] ?? "",
                fallbackHints.reviews[slot].content[editLocale],
              )}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    reviews: {
                      ...s.home.reviews,
                      [slot]: {
                        ...s.home.reviews[slot],
                        content: { ...s.home.reviews[slot].content, [editLocale]: e.target.value },
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
            />
            <input
              value={effectiveText(
                settings.home.reviews[slot].author[editLocale] ?? "",
                fallbackHints.reviews[slot].author[editLocale],
              )}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    reviews: {
                      ...s.home.reviews,
                      [slot]: {
                        ...s.home.reviews[slot],
                        author: { ...s.home.reviews[slot].author, [editLocale]: e.target.value },
                      },
                    },
                  },
                }))
              }
              className="mt-2 h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
            />
          </div>
        ))}
      </AdminVisualModal>
    </section>
  );
}
