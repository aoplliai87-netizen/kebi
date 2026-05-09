"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminVisualModal, AdminVisualToolbar } from "@/components/admin/admin-visual-editor-primitives";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { BespokeIntroExperience } from "@/components/intro/BespokeIntroExperience";
import { INTRO_SERVICE_ALIGNS, INTRO_SERVICE_IMAGES } from "@/constants/introServices";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { effectiveText } from "@/lib/admin-visual-effective";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import { renderIntroBrandMarkup } from "@/lib/render-brand-markup";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
};

export function AdminIntroVisualEditor({ initial, fallbackHints, messagesByLocale }: Props) {
  const router = useRouter();
  const [previewLocale, setPreviewLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"hero" | "core" | "services" | "contact" | null>(null);
  const [editLocale, setEditLocale] = useState<LocaleKey>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const intro = settings.subpages.intro;

  useEffect(() => {
    setSettings(initial);
  }, [initial]);

  useEffect(() => {
    if (panel) setEditLocale(previewLocale);
  }, [panel, previewLocale]);

  const services = useMemo(
    () =>
      ["s01", "s02", "s03", "s04"].map((_, i) => ({
        title: intro.services[i].title[previewLocale] || fallbackHints.subpages.intro.services[i].title[previewLocale],
        body: intro.services[i].body[previewLocale] || fallbackHints.subpages.intro.services[i].body[previewLocale],
        image: intro.services[i].image || INTRO_SERVICE_IMAGES[i] || INTRO_SERVICE_IMAGES[0],
        align: INTRO_SERVICE_ALIGNS[i] ?? "left",
      })),
    [intro, previewLocale, fallbackHints],
  );

  const fb = fallbackHints.subpages.intro;
  const loc = editLocale;

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

  const resetHero = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        intro: {
          ...s.subpages.intro,
          brandTitle: { ...s.subpages.intro.brandTitle, [loc]: "" },
          sectionLabel: { ...s.subpages.intro.sectionLabel, [loc]: "" },
          headline: { ...s.subpages.intro.headline, [loc]: "" },
          description: { ...s.subpages.intro.description, [loc]: "" },
        },
      },
    }));

  const resetCore = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        intro: {
          ...s.subpages.intro,
          coreValueEyebrow: { ...s.subpages.intro.coreValueEyebrow, [loc]: "" },
          coreValueTitle: { ...s.subpages.intro.coreValueTitle, [loc]: "" },
          coreValueBody: { ...s.subpages.intro.coreValueBody, [loc]: "" },
        },
      },
    }));

  const resetServices = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        intro: {
          ...s.subpages.intro,
          services: s.subpages.intro.services.map((svc) => ({
            ...svc,
            title: { ...svc.title, [loc]: "" },
            body: { ...svc.body, [loc]: "" },
          })),
        },
      },
    }));

  const resetContact = () =>
    setSettings((s) => ({
      ...s,
      subpages: {
        ...s.subpages,
        intro: {
          ...s.subpages.intro,
          contactEyebrow: { ...s.subpages.intro.contactEyebrow, [loc]: "" },
          representativeName: { ...s.subpages.intro.representativeName, [loc]: "" },
          representativeLine: { ...s.subpages.intro.representativeLine, [loc]: "" },
          phoneCaption: { ...s.subpages.intro.phoneCaption, [loc]: "" },
        },
      },
    }));

  return (
    <section className="space-y-4">
      <AdminVisualToolbar
        previewLocale={previewLocale}
        onPreviewLocale={setPreviewLocale}
        onSave={persist}
        saving={saving}
        extra={
          <>
            <button
              type="button"
              onClick={() => setPanel("hero")}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong"
            >
              히어로
            </button>
            <button
              type="button"
              onClick={() => setPanel("core")}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong"
            >
              핵심가치
            </button>
            <button
              type="button"
              onClick={() => setPanel("services")}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong"
            >
              서비스
            </button>
            <button
              type="button"
              onClick={() => setPanel("contact")}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong"
            >
              연락처
            </button>
          </>
        }
      />
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <BespokeIntroExperience
          brandTitle={intro.brandTitle[previewLocale] || fb.brandTitle[previewLocale]}
          sectionLabel={intro.sectionLabel[previewLocale] || fb.sectionLabel[previewLocale]}
          headline={intro.headline[previewLocale] || fb.headline[previewLocale]}
          description={renderIntroBrandMarkup(intro.description[previewLocale] || fb.description[previewLocale])}
          coreValueEyebrow={intro.coreValueEyebrow[previewLocale] || fb.coreValueEyebrow[previewLocale]}
          coreValueTitle={intro.coreValueTitle[previewLocale] || fb.coreValueTitle[previewLocale]}
          coreValueBody={intro.coreValueBody[previewLocale] || fb.coreValueBody[previewLocale]}
          contactEyebrow={intro.contactEyebrow[previewLocale] || fb.contactEyebrow[previewLocale]}
          representativeName={intro.representativeName[previewLocale] || fb.representativeName[previewLocale]}
          representativeLine={intro.representativeLine[previewLocale] || fb.representativeLine[previewLocale]}
          phoneCaption={intro.phoneCaption[previewLocale] || fb.phoneCaption[previewLocale]}
          phoneDisplay={settings.phoneDisplay}
          services={services}
        />
      </div>

      <AdminVisualModal
        open={panel === "hero"}
        title="소개 · 히어로"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetHero}
      >
        <input
          value={effectiveText(intro.brandTitle[editLocale] ?? "", fb.brandTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: { ...s.subpages.intro, brandTitle: { ...s.subpages.intro.brandTitle, [editLocale]: e.target.value } },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(intro.sectionLabel[editLocale] ?? "", fb.sectionLabel[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: { ...s.subpages.intro, sectionLabel: { ...s.subpages.intro.sectionLabel, [editLocale]: e.target.value } },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(intro.headline[editLocale] ?? "", fb.headline[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: { ...s.subpages.intro, headline: { ...s.subpages.intro.headline, [editLocale]: e.target.value } },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={4}
          value={effectiveText(intro.description[editLocale] ?? "", fb.description[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: { ...s.subpages.intro, description: { ...s.subpages.intro.description, [editLocale]: e.target.value } },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "core"}
        title="소개 · 핵심 가치"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetCore}
      >
        <input
          value={effectiveText(intro.coreValueEyebrow[editLocale] ?? "", fb.coreValueEyebrow[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  coreValueEyebrow: { ...s.subpages.intro.coreValueEyebrow, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(intro.coreValueTitle[editLocale] ?? "", fb.coreValueTitle[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  coreValueTitle: { ...s.subpages.intro.coreValueTitle, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={4}
          value={effectiveText(intro.coreValueBody[editLocale] ?? "", fb.coreValueBody[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  coreValueBody: { ...s.subpages.intro.coreValueBody, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "services"}
        title="소개 · 서비스 (이미지)"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetServices}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="mb-2 text-xs font-semibold text-brand-gold">서비스 {i + 1}</p>
            <input
              value={effectiveText(intro.services[i].title[editLocale] ?? "", fb.services[i].title[editLocale])}
              onChange={(e) =>
                setSettings((s) => {
                  const n = [...s.subpages.intro.services];
                  n[i] = { ...n[i], title: { ...n[i].title, [editLocale]: e.target.value } };
                  return { ...s, subpages: { ...s.subpages, intro: { ...s.subpages.intro, services: n } } };
                })
              }
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
            />
            <textarea
              rows={3}
              value={effectiveText(intro.services[i].body[editLocale] ?? "", fb.services[i].body[editLocale])}
              onChange={(e) =>
                setSettings((s) => {
                  const n = [...s.subpages.intro.services];
                  n[i] = { ...n[i], body: { ...n[i].body, [editLocale]: e.target.value } };
                  return { ...s, subpages: { ...s.subpages, intro: { ...s.subpages.intro, services: n } } };
                })
              }
              className="mt-2 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
            />
            <div className="mt-2">
              <AdminImageUploader
                section="intro"
                purpose={`service-${i + 1}`}
                label={`서비스 ${i + 1} 이미지`}
                value={intro.services[i].image}
                onChange={(next) =>
                  setSettings((s) => {
                    const n = [...s.subpages.intro.services];
                    n[i] = { ...n[i], image: next };
                    return { ...s, subpages: { ...s.subpages, intro: { ...s.subpages.intro, services: n } } };
                  })
                }
              />
            </div>
          </div>
        ))}
      </AdminVisualModal>

      <AdminVisualModal
        open={panel === "contact"}
        title="소개 · 연락 블록"
        onClose={() => setPanel(null)}
        editLocale={editLocale}
        onEditLocale={setEditLocale}
        onSave={persist}
        saving={saving}
        onReset={resetContact}
      >
        <input
          value={effectiveText(intro.contactEyebrow[editLocale] ?? "", fb.contactEyebrow[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  contactEyebrow: { ...s.subpages.intro.contactEyebrow, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <input
          value={effectiveText(intro.representativeName[editLocale] ?? "", fb.representativeName[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  representativeName: { ...s.subpages.intro.representativeName, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
        />
        <textarea
          rows={3}
          value={effectiveText(intro.representativeLine[editLocale] ?? "", fb.representativeLine[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  representativeLine: { ...s.subpages.intro.representativeLine, [editLocale]: e.target.value },
                },
              },
            }))
          }
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        />
        <textarea
          rows={2}
          value={effectiveText(intro.phoneCaption[editLocale] ?? "", fb.phoneCaption[editLocale])}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              subpages: {
                ...s.subpages,
                intro: {
                  ...s.subpages.intro,
                  phoneCaption: { ...s.subpages.intro.phoneCaption, [editLocale]: e.target.value },
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
