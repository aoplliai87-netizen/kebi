"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import {
  BespokeHomeExperience,
  type HomeAdminSectionId,
} from "@/components/home/BespokeHomeExperience";
import { HomeDestinationsLinks } from "@/components/home/HomeDestinationsLinks";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { BtnEdit } from "@/components/admin/admin-visual-editor-primitives";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import {
  DEFAULT_HOME_FEATURED_DESTINATION_SLUGS,
  HOME_DESTINATIONS_FOOTER_PATH,
} from "@/constants/destinations";
import { effectiveText, msgAt } from "@/lib/admin-visual-effective";
import { resolveHomePreviewVm } from "@/lib/home-preview-resolve";
import { getFeaturedDestinationButtonDefaults } from "../../../data/landing-pages";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";
import { SITE_PHONE_TEL } from "@/lib/site";

type EditSection = HomeAdminSectionId | "destinations" | "faq";

type Props = {
  initialSettings: SiteSettings;
  previewLocale: LocaleKey;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  vehicleMediaMain: ManagedVehicleMedia["main"];
  /** 홈 대표 코스 선택용 — `getAllDestinationSlugs()` 와 동일 */
  destinationSlugs: string[];
  mergedContact: {
    kakao: string;
    instagram: string;
    whatsapp: string;
    line: string;
    messenger: string;
  };
};

const LOCALE_OPTIONS: LocaleKey[] = ["ko", "en", "ja", "zh"];

export function AdminHomeVisualEditor({
  initialSettings,
  previewLocale,
  messagesByLocale,
  vehicleMediaMain,
  destinationSlugs,
  mergedContact,
}: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteSettings>(initialSettings);
  const [panel, setPanel] = useState<EditSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [editLocale, setEditLocale] = useState<LocaleKey>(previewLocale);

  useEffect(() => {
    setDraft(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    setEditLocale(previewLocale);
  }, [previewLocale]);

  const vm = useMemo(
    () => resolveHomePreviewVm(draft, previewLocale, messagesByLocale[previewLocale], vehicleMediaMain),
    [draft, previewLocale, messagesByLocale, vehicleMediaMain],
  );

  const editMessages = messagesByLocale[editLocale];
  const hpEdit = (...p: string[]) => msgAt(editMessages, ["HomePage", ...p]);
  const ihEdit = (...p: string[]) => msgAt(editMessages, ["IntroPage", "hero", ...p]);
  const hfEdit = (...p: string[]) => msgAt(editMessages, ["HomeFaq", ...p]);
  const hdEdit = (...p: string[]) => msgAt(editMessages, ["HomeDestinations", ...p]);
  const destFbEdit = useMemo(
    () => getFeaturedDestinationButtonDefaults(editLocale, draft.home.destinations.featuredSlugs),
    [editLocale, draft.home.destinations.featuredSlugs],
  );

  const save = async () => {
    setSaving(true);
    setToast("");
    try {
      const payload = normalizeSiteSettingsForPersist(draft, messagesByLocale);
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) {
        setToast("저장되었습니다.");
        router.refresh();
      } else {
        setToast(data.message ?? "저장 실패");
      }
    } catch {
      setToast("저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const renderChrome = (id: HomeAdminSectionId) => (
    <BtnEdit onClick={() => setPanel(id)} />
  );

  const resetPanelToDefaults = () => {
    const loc = editLocale;
    setDraft((d) => {
      switch (panel) {
        case "hero":
          return {
            ...d,
            heroTitleByLocale: { ...d.heroTitleByLocale, [loc]: "" },
            heroSubtitleByLocale: { ...d.heroSubtitleByLocale, [loc]: "" },
          };
        case "intro":
          return {
            ...d,
            home: {
              ...d.home,
              intro: {
                ...d.home.intro,
                eyebrow: { ...d.home.intro.eyebrow, [loc]: "" },
                title: { ...d.home.intro.title, [loc]: "" },
                desc: { ...d.home.intro.desc, [loc]: "" },
              },
            },
          };
        case "about":
          return {
            ...d,
            aboutMeTitleByLocale: { ...d.aboutMeTitleByLocale, [loc]: "" },
            aboutMeDescriptionByLocale: { ...d.aboutMeDescriptionByLocale, [loc]: "" },
          };
        case "gallery":
          return { ...d, galleryImageUrls: [] };
        case "vehicle":
          return {
            ...d,
            vehicleSectionTitleByLocale: { ...d.vehicleSectionTitleByLocale, [loc]: "" },
            vehicleSectionDescriptionByLocale: { ...d.vehicleSectionDescriptionByLocale, [loc]: "" },
          };
        case "pricing": {
          const rows = [...(d.pricingTiersByLocale[loc] ?? [])];
          while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
          const cleared = rows.map(() => ({ label: "", price: "", note: "" }));
          return { ...d, pricingTiersByLocale: { ...d.pricingTiersByLocale, [loc]: cleared } };
        }
        case "booking":
          return {
            ...d,
            home: {
              ...d.home,
              booking: {
                ...d.home.booking,
                eyebrow: { ...d.home.booking.eyebrow, [loc]: "" },
                title: { ...d.home.booking.title, [loc]: "" },
                desc: { ...d.home.booking.desc, [loc]: "" },
                ctaCall: { ...d.home.booking.ctaCall, [loc]: "" },
                ctaReview: { ...d.home.booking.ctaReview, [loc]: "" },
              },
            },
          };
        case "reviews":
          return {
            ...d,
            home: {
              ...d.home,
              reviews: {
                ...d.home.reviews,
                eyebrow: { ...d.home.reviews.eyebrow, [loc]: "" },
                title: { ...d.home.reviews.title, [loc]: "" },
                one: {
                  ...d.home.reviews.one,
                  content: { ...d.home.reviews.one.content, [loc]: "" },
                  author: { ...d.home.reviews.one.author, [loc]: "" },
                },
                two: {
                  ...d.home.reviews.two,
                  content: { ...d.home.reviews.two.content, [loc]: "" },
                  author: { ...d.home.reviews.two.author, [loc]: "" },
                },
                three: {
                  ...d.home.reviews.three,
                  content: { ...d.home.reviews.three.content, [loc]: "" },
                  author: { ...d.home.reviews.three.author, [loc]: "" },
                },
              },
            },
          };
        case "destinations":
          return {
            ...d,
            home: {
              ...d.home,
              destinations: {
                ...d.home.destinations,
                featuredSlugs: [...DEFAULT_HOME_FEATURED_DESTINATION_SLUGS],
                eyebrow: { ...d.home.destinations.eyebrow, [loc]: "" },
                title: { ...d.home.destinations.title, [loc]: "" },
                description: { ...d.home.destinations.description, [loc]: "" },
                footerLabel: { ...d.home.destinations.footerLabel, [loc]: "" },
                footerHref: "",
                buttons: d.home.destinations.buttons.map((b) => ({
                  ...b,
                  label: { ...b.label, [loc]: "" },
                  href: "",
                })) as SiteSettings["home"]["destinations"]["buttons"],
              },
            },
          };
        case "faq":
          return {
            ...d,
            home: {
              ...d.home,
              faq: {
                ...d.home.faq,
                eyebrow: { ...d.home.faq.eyebrow, [loc]: "" },
                title: { ...d.home.faq.title, [loc]: "" },
                items: d.home.faq.items.map((item) => ({
                  q: { ...item.q, [loc]: "" },
                  a: { ...item.a, [loc]: "" },
                })) as SiteSettings["home"]["faq"]["items"],
              },
            },
          };
        default:
          return d;
      }
    });
  };

  const appendHeroSlide = (url: string) => {
    const t = url.trim();
    if (!t) return;
    setDraft((d) => {
      const next = [...d.home.heroVisuals];
      if (!next.includes(t)) next.push(t);
      return { ...d, home: { ...d.home, heroVisuals: next } };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-tone-soft">미리보기 언어</span>
          <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-black/30 p-1">
            {LOCALE_OPTIONS.map((loc) => (
              <a
                key={loc}
                href={`/admin/content?previewLocale=${loc}`}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  previewLocale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
                }`}
              >
                {loc.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/seo"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-tone-strong hover:border-brand-gold/40"
          >
            SEO 설정
          </a>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded-lg bg-brand-gold px-4 py-1.5 text-xs font-bold text-black disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
      {toast ? <p className="text-xs text-tone-sky">{toast}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a11]">
        <NextIntlClientProvider locale={previewLocale} messages={messagesByLocale[previewLocale]}>
          <BespokeHomeExperience
            locale={previewLocale}
            heroEyebrow={vm.heroEyebrow}
            heroTitle={vm.heroTitle}
            heroSlides={vm.heroSlides}
            heroSubtitle={vm.heroSubtitle}
            introEyebrow={vm.introEyebrow}
            introTitle={vm.introTitle}
            introDesc={vm.introDesc}
            vehicleEyebrow={vm.vehicleEyebrow}
            vehicleTitle={vm.vehicleTitle}
            vehicleDesc={vm.vehicleDesc}
            pricingEyebrow={vm.pricingEyebrow}
            pricingTitle={vm.pricingTitle}
            pricingTiers={vm.pricingTiers}
            bookingEyebrow={vm.bookingEyebrow}
            bookingTitle={vm.bookingTitle}
            bookingDesc={vm.bookingDesc}
            bookingCall={vm.bookingCall}
            bookingReview={vm.bookingReview}
            reviewEyebrow={vm.reviewEyebrow}
            reviewTitle={vm.reviewTitle}
            reviews={vm.reviews}
            aboutMeTitle={vm.aboutMeTitle}
            aboutMeDescription={vm.aboutMeDescription}
            galleryImageUrls={vm.galleryImageUrls}
            phoneTel={draft.phoneTel || SITE_PHONE_TEL}
            contactLinks={mergedContact}
            heroTitleOverride={vm.heroTitleOverride}
            heroSubtitleOverride={vm.heroSubtitleOverride}
            vehicleMainImages={vm.vehicleMainImages}
            renderAdminChrome={renderChrome}
          />
          <div className="relative">
            <div className="pointer-events-auto absolute right-4 top-4 z-20 md:right-10">
              <BtnEdit onClick={() => setPanel("destinations")} />
            </div>
            <HomeDestinationsLinks
              eyebrow={vm.destinationsEyebrow}
              title={vm.destinationsTitle}
              description={vm.destinationsDescription}
              buttons={vm.destinationButtons}
              footerLabel={vm.destinationsFooterLabel}
              footerHref={vm.destinationsFooterHref}
            />
          </div>
          <HomeFaqSection
            eyebrow={vm.faqEyebrow}
            title={vm.faqTitle}
            items={vm.faqItems}
            adminChrome={<BtnEdit onClick={() => setPanel("faq")} />}
          />
        </NextIntlClientProvider>
      </div>

      {/* Modal */}
      {panel ? (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/70 p-4 md:items-center">
          <div
            role="dialog"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#0a1522] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-tone-strong">섹션 편집</p>
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="rounded-lg border border-white/20 px-2 py-1 text-xs text-tone-soft"
              >
                닫기
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/30 p-1">
              {LOCALE_OPTIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setEditLocale(loc)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold ${
                    editLocale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            {panel === "hero" && (
              <div className="space-y-3 text-sm">
                <label className="block text-tone-soft">히어로 제목</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-tone-strong"
                  value={effectiveText(draft.heroTitleByLocale[editLocale] ?? "", hpEdit("heroTitle"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      heroTitleByLocale: { ...d.heroTitleByLocale, [editLocale]: e.target.value },
                    }))
                  }
                />
                <label className="block text-tone-soft">히어로 서브타이틀</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-tone-strong"
                  value={effectiveText(draft.heroSubtitleByLocale[editLocale] ?? "", hpEdit("heroSubtitle"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      heroSubtitleByLocale: { ...d.heroSubtitleByLocale, [editLocale]: e.target.value },
                    }))
                  }
                />
                <p className="text-xs text-tone-soft">히어로 배경 슬라이드</p>
                <AdminImageUploader
                  section="home"
                  purpose="hero-slide-admin"
                  label="이미지 추가"
                  value=""
                  onChange={(u) => appendHeroSlide(u)}
                />
                <ul className="space-y-1 text-xs text-tone-soft">
                  {draft.home.heroVisuals.map((url, i) => (
                    <li key={url} className="flex items-center justify-between gap-2">
                      <span className="truncate">{url}</span>
                      <button
                        type="button"
                        className="shrink-0 text-rose-400"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            home: {
                              ...d.home,
                              heroVisuals: d.home.heroVisuals.filter((_, j) => j !== i),
                            },
                          }))
                        }
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panel === "intro" && (
              <div className="space-y-3 text-sm">
                <label className="block text-tone-soft">소개 eyebrow</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-tone-strong"
                  value={effectiveText(draft.home.intro.eyebrow[editLocale] ?? "", ihEdit("eyebrow"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        intro: {
                          ...d.home.intro,
                          eyebrow: { ...d.home.intro.eyebrow, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                <label className="block text-tone-soft">소개 제목</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-tone-strong"
                  value={effectiveText(draft.home.intro.title[editLocale] ?? "", ihEdit("title"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        intro: {
                          ...d.home.intro,
                          title: { ...d.home.intro.title, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                <label className="block text-tone-soft">소개 본문</label>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-tone-strong"
                  value={effectiveText(draft.home.intro.desc[editLocale] ?? "", ihEdit("desc"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        intro: {
                          ...d.home.intro,
                          desc: { ...d.home.intro.desc, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
              </div>
            )}

            {panel === "about" && (
              <div className="space-y-3 text-sm">
                <label className="block text-tone-soft">About 제목</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={draft.aboutMeTitleByLocale[editLocale] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      aboutMeTitleByLocale: { ...d.aboutMeTitleByLocale, [editLocale]: e.target.value },
                    }))
                  }
                />
                <label className="block text-tone-soft">About 설명</label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={draft.aboutMeDescriptionByLocale[editLocale] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      aboutMeDescriptionByLocale: {
                        ...d.aboutMeDescriptionByLocale,
                        [editLocale]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            )}

            {panel === "gallery" && (
              <div className="space-y-3 text-sm">
                <AdminImageUploader
                  section="home"
                  purpose="gallery-admin"
                  label="갤러리 이미지 URL"
                  value=""
                  onChange={(url) => {
                    const u = url.trim();
                    if (!u) return;
                    setDraft((d) => ({
                      ...d,
                      galleryImageUrls: d.galleryImageUrls.includes(u)
                        ? d.galleryImageUrls
                        : [...d.galleryImageUrls, u],
                    }));
                  }}
                />
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-xs"
                  value={draft.galleryImageUrls.join("\n")}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      galleryImageUrls: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </div>
            )}

            {panel === "vehicle" && (
              <div className="space-y-3 text-sm">
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(
                    draft.vehicleSectionTitleByLocale[editLocale] ?? "",
                    hpEdit("vehicle", "cardTitle"),
                  )}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      vehicleSectionTitleByLocale: {
                        ...d.vehicleSectionTitleByLocale,
                        [editLocale]: e.target.value,
                      },
                    }))
                  }
                />
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(
                    draft.vehicleSectionDescriptionByLocale[editLocale] ?? "",
                    hpEdit("vehicle", "desc"),
                  )}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      vehicleSectionDescriptionByLocale: {
                        ...d.vehicleSectionDescriptionByLocale,
                        [editLocale]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            )}

            {panel === "pricing" && (
              <div className="space-y-4 text-sm">
                {(["airport", "city", "charter"] as const).map((key, idx) => {
                  const labelFb = hpEdit("pricing", key, "label");
                  const priceFb = hpEdit("pricing", key, "price");
                  const noteFb = hpEdit("pricing", key, "note");
                  return (
                    <div key={key} className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <p className="mb-2 text-xs font-semibold text-brand-gold">카드 {idx + 1}</p>
                      <input
                        className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                        value={effectiveText(
                          draft.pricingTiersByLocale[editLocale]?.[idx]?.label ?? "",
                          labelFb,
                        )}
                        onChange={(e) =>
                          setDraft((d) => {
                            const rows = [...(d.pricingTiersByLocale[editLocale] ?? [])];
                            while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
                            rows[idx] = { ...rows[idx], label: e.target.value };
                            return {
                              ...d,
                              pricingTiersByLocale: { ...d.pricingTiersByLocale, [editLocale]: rows },
                            };
                          })
                        }
                      />
                      <input
                        className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                        value={effectiveText(
                          draft.pricingTiersByLocale[editLocale]?.[idx]?.price ?? "",
                          priceFb,
                        )}
                        onChange={(e) =>
                          setDraft((d) => {
                            const rows = [...(d.pricingTiersByLocale[editLocale] ?? [])];
                            while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
                            rows[idx] = { ...rows[idx], price: e.target.value };
                            return {
                              ...d,
                              pricingTiersByLocale: { ...d.pricingTiersByLocale, [editLocale]: rows },
                            };
                          })
                        }
                      />
                      <textarea
                        rows={2}
                        className="w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                        value={effectiveText(
                          draft.pricingTiersByLocale[editLocale]?.[idx]?.note ?? "",
                          noteFb,
                        )}
                        onChange={(e) =>
                          setDraft((d) => {
                            const rows = [...(d.pricingTiersByLocale[editLocale] ?? [])];
                            while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
                            rows[idx] = { ...rows[idx], note: e.target.value };
                            return {
                              ...d,
                              pricingTiersByLocale: { ...d.pricingTiersByLocale, [editLocale]: rows },
                            };
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {panel === "booking" && (
              <div className="space-y-3 text-sm">
                {(["eyebrow", "title", "desc", "ctaCall", "ctaReview"] as const).map((k) => (
                  <div key={k}>
                    <label className="text-xs text-tone-soft">{k}</label>
                    <textarea
                      rows={k === "desc" ? 5 : 2}
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                      value={effectiveText(
                        draft.home.booking[k][editLocale] ?? "",
                        hpEdit("booking", k),
                      )}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          home: {
                            ...d.home,
                            booking: {
                              ...d.home.booking,
                              [k]: { ...d.home.booking[k], [editLocale]: e.target.value },
                            },
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {panel === "reviews" && (
              <div className="space-y-4 text-sm">
                {(["eyebrow", "title"] as const).map((k) => (
                  <input
                    key={k}
                    className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                    value={effectiveText(
                      draft.home.reviews[k][editLocale] ?? "",
                      hpEdit("review", k),
                    )}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        home: {
                          ...d.home,
                          reviews: {
                            ...d.home.reviews,
                            [k]: { ...d.home.reviews[k], [editLocale]: e.target.value },
                          },
                        },
                      }))
                    }
                  />
                ))}
                {(["one", "two", "three"] as const).map((slot) => (
                  <div key={slot} className="rounded-lg border border-white/10 p-3">
                    <p className="mb-2 text-xs text-brand-gold">{slot}</p>
                    <textarea
                      rows={3}
                      className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                      value={effectiveText(
                        draft.home.reviews[slot].content[editLocale] ?? "",
                        msgAt(editMessages, ["HomePage", "review", slot, "content"]),
                      )}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          home: {
                            ...d.home,
                            reviews: {
                              ...d.home.reviews,
                              [slot]: {
                                ...d.home.reviews[slot],
                                content: {
                                  ...d.home.reviews[slot].content,
                                  [editLocale]: e.target.value,
                                },
                              },
                            },
                          },
                        }))
                      }
                    />
                    <input
                      className="w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                      value={effectiveText(
                        draft.home.reviews[slot].author[editLocale] ?? "",
                        msgAt(editMessages, ["HomePage", "review", slot, "author"]),
                      )}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          home: {
                            ...d.home,
                            reviews: {
                              ...d.home.reviews,
                              [slot]: {
                                ...d.home.reviews[slot],
                                author: {
                                  ...d.home.reviews[slot].author,
                                  [editLocale]: e.target.value,
                                },
                              },
                            },
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {panel === "destinations" && (
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-white/10 p-3">
                  <p className="mb-2 text-xs font-semibold text-tone-strong">홈 카드로 노출할 대표 코스</p>
                  <p className="mb-2 text-[11px] text-tone-soft">
                    slug를 선택하면 버튼 기본 라벨·링크가 해당 랜딩과 일치합니다.
                  </p>
                  {[0, 1, 2].map((i) => (
                    <label key={i} className="mb-2 block text-xs text-tone-soft">
                      대표 {i + 1}
                      <select
                        className="mt-1 w-full rounded border border-white/20 bg-black/40 px-2 py-1.5 font-mono text-[11px]"
                        value={draft.home.destinations.featuredSlugs[i] ?? ""}
                        onChange={(e) =>
                          setDraft((d) => {
                            const next = [...d.home.destinations.featuredSlugs] as [string, string, string];
                            next[i] = e.target.value;
                            return {
                              ...d,
                              home: {
                                ...d.home,
                                destinations: { ...d.home.destinations, featuredSlugs: next },
                              },
                            };
                          })
                        }
                      >
                        {destinationSlugs.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <label className="text-xs text-tone-soft">Eyebrow</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(draft.home.destinations.eyebrow[editLocale] ?? "", hdEdit("eyebrow"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        destinations: {
                          ...d.home.destinations,
                          eyebrow: { ...d.home.destinations.eyebrow, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                <label className="text-xs text-tone-soft">제목</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(draft.home.destinations.title[editLocale] ?? "", hdEdit("title"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        destinations: {
                          ...d.home.destinations,
                          title: { ...d.home.destinations.title, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                <label className="text-xs text-tone-soft">설명</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(
                    draft.home.destinations.description[editLocale] ?? "",
                    hdEdit("description"),
                  )}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        destinations: {
                          ...d.home.destinations,
                          description: {
                            ...d.home.destinations.description,
                            [editLocale]: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-3">
                    <p className="mb-2 text-xs font-semibold text-tone-strong">버튼 {i + 1}</p>
                    <input
                      className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                      value={effectiveText(
                        draft.home.destinations.buttons[i].label[editLocale] ?? "",
                        destFbEdit[i]?.label ?? "",
                      )}
                      onChange={(e) =>
                        setDraft((d) => {
                          const buttons = [...d.home.destinations.buttons] as typeof d.home.destinations.buttons;
                          buttons[i] = {
                            ...buttons[i],
                            label: { ...buttons[i].label, [editLocale]: e.target.value },
                          };
                          return {
                            ...d,
                            home: { ...d.home, destinations: { ...d.home.destinations, buttons } },
                          };
                        })
                      }
                    />
                    <input
                      className="w-full rounded border border-white/20 bg-black/40 px-2 py-1 font-mono text-xs"
                      value={effectiveText(
                        draft.home.destinations.buttons[i].href ?? "",
                        destFbEdit[i]?.href ?? "",
                      )}
                      onChange={(e) =>
                        setDraft((d) => {
                          const buttons = [...d.home.destinations.buttons] as typeof d.home.destinations.buttons;
                          buttons[i] = { ...buttons[i], href: e.target.value };
                          return {
                            ...d,
                            home: { ...d.home, destinations: { ...d.home.destinations, buttons } },
                          };
                        })
                      }
                    />
                  </div>
                ))}
                <label className="block text-xs text-tone-soft">「더 많은 코스」링크 문구</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(
                    draft.home.destinations.footerLabel[editLocale] ?? "",
                    hdEdit("footerMoreCourses"),
                  )}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        destinations: {
                          ...d.home.destinations,
                          footerLabel: {
                            ...d.home.destinations.footerLabel,
                            [editLocale]: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                />
                <label className="block text-xs text-tone-soft">하단 링크 경로 (보통 /destinations)</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-xs"
                  value={effectiveText(draft.home.destinations.footerHref ?? "", HOME_DESTINATIONS_FOOTER_PATH)}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        destinations: { ...d.home.destinations, footerHref: e.target.value },
                      },
                    }))
                  }
                />
              </div>
            )}

            {panel === "faq" && (
              <div className="space-y-4 text-sm">
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(draft.home.faq.eyebrow[editLocale] ?? "", hfEdit("eyebrow"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        faq: {
                          ...d.home.faq,
                          eyebrow: { ...d.home.faq.eyebrow, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                <input
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
                  value={effectiveText(draft.home.faq.title[editLocale] ?? "", hfEdit("title"))}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      home: {
                        ...d.home,
                        faq: {
                          ...d.home.faq,
                          title: { ...d.home.faq.title, [editLocale]: e.target.value },
                        },
                      },
                    }))
                  }
                />
                {draft.home.faq.items.map((pair, idx) => {
                  const n = idx + 1;
                  return (
                    <div key={idx} className="rounded-lg border border-white/10 p-3">
                      <p className="mb-2 text-xs text-brand-gold">FAQ {n}</p>
                      <textarea
                        rows={2}
                        className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                        value={effectiveText(pair.q[editLocale] ?? "", hfEdit(`q${n}`))}
                        onChange={(e) =>
                          setDraft((d) => {
                            const items = [...d.home.faq.items];
                            items[idx] = {
                              ...items[idx],
                              q: { ...items[idx].q, [editLocale]: e.target.value },
                            };
                            return {
                              ...d,
                              home: { ...d.home, faq: { ...d.home.faq, items: items as typeof d.home.faq.items } },
                            };
                          })
                        }
                      />
                      <textarea
                        rows={3}
                        className="w-full rounded border border-white/20 bg-black/40 px-2 py-1"
                        value={effectiveText(pair.a[editLocale] ?? "", hfEdit(`a${n}`))}
                        onChange={(e) =>
                          setDraft((d) => {
                            const items = [...d.home.faq.items];
                            items[idx] = {
                              ...items[idx],
                              a: { ...items[idx].a, [editLocale]: e.target.value },
                            };
                            return {
                              ...d,
                              home: { ...d.home, faq: { ...d.home.faq, items: items as typeof d.home.faq.items } },
                            };
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => resetPanelToDefaults()}
                className="rounded-lg border border-white/25 px-4 py-2 text-sm text-tone-soft"
              >
                기본값으로 되돌리기
              </button>
              <button
                type="button"
                onClick={() => void save()}
                className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-bold text-black"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
