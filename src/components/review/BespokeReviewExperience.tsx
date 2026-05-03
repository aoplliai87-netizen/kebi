"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { StoredReview } from "@/lib/review-store";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

const SAMPLE_KEYS = ["one", "two", "three"] as const;

function formatPostedDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function formatDateTimePosted(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function BespokeReviewExperience() {
  const t = useTranslations("ReviewBoard");
  const tr = useTranslations("HomePage.review");
  const locale = useLocale();
  const [userReviews, setUserReviews] = useState<StoredReview[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<"idle" | "success" | "error" | "validation">("idle");
  const [writeOpen, setWriteOpen] = useState(false);
  const writeFormRef = useRef<HTMLFormElement>(null);

  const loadReviews = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; reviews?: StoredReview[] };
      if (data.ok && Array.isArray(data.reviews)) {
        setUserReviews(data.reviews);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const onPickFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const next = [...files];
    for (let i = 0; i < list.length && next.length < 4; i += 1) {
      next.push(list[i]);
    }
    setFiles(next.slice(0, 4));
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage("idle");
    if (content.trim().length < 10) {
      setFormMessage("validation");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("content", content.trim());
      fd.set("author", author.trim());
      fd.set("locale", locale);
      files.forEach((f) => fd.append("images", f));
      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setFormMessage("error");
        return;
      }
      setFormMessage("success");
      setAuthor("");
      setContent("");
      setFiles([]);
      await loadReviews();
    } catch {
      setFormMessage("error");
    } finally {
      setSubmitting(false);
    }
  };

  const openWriteForm = () => {
    setWriteOpen(true);
    requestAnimationFrame(() => {
      writeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="scroll-mt-24 border-b border-border/45 py-12 md:py-16">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLE_KEYS.map((key, idx) => (
            <article
              key={key}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-surface/85 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            >
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/25 text-sm font-bold text-brand-gold">
                {idx + 1}
              </span>
              <p className="pr-12 text-xs font-medium text-tone-soft">
                {formatPostedDate(tr(`${key}.postedAt`), locale)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-tone-body">{tr(`${key}.content`)}</p>
              <footer className="mt-4 border-t border-white/10 pt-3 text-xs font-semibold text-tone-strong">{tr(`${key}.author`)}</footer>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-sans text-xl font-bold tracking-tight text-brand-gold md:text-2xl">{t("userSectionTitle")}</h3>
            <Button
              type="button"
              variant="outline"
              onClick={openWriteForm}
              className="h-12 shrink-0 rounded-xl border-metal-bronze/45 px-6 text-sm font-semibold text-tone-sky sm:self-start"
            >
              {t("writeReviewBtn")}
            </Button>
          </div>
          {!writeOpen ? (
            <p className="mt-2 text-sm text-tone-soft">{t("writeReviewHint")}</p>
          ) : null}
          {loadError ? (
            <p className="mt-3 text-sm text-red-300/90">{t("loadError")}</p>
          ) : userReviews.length === 0 ? (
            <p className="mt-3 text-sm text-tone-soft">{t("emptyUser")}</p>
          ) : (
            <ul className="mt-6 space-y-5">
              {userReviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-white/12 bg-black/25 p-5 backdrop-blur-sm md:p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-tone-strong">{r.author}</span>
                    <time className="text-xs text-tone-soft" dateTime={r.createdAt}>
                      {formatDateTimePosted(r.createdAt, locale)}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-tone-body">{r.content}</p>
                  {r.images.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {r.images.map((src) => (
                        <a
                          key={src}
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                        >
                          {/* 동적 업로드 경로 — next/image 대신 일반 img 사용 */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {writeOpen ? (
        <motion.form
          ref={writeFormRef}
          onSubmit={submitReview}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: LUX_EASE }}
          className="mt-10 rounded-3xl border border-metal-bronze/35 bg-black/30 p-6 backdrop-blur-md md:p-8"
        >
          <h3 className="font-sans text-lg font-bold text-metal-bronze-strong md:text-xl">{t("formTitle")}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <label htmlFor="rev-author" className="mb-1.5 block text-sm text-tone-soft">
                {t("authorLabel")}
              </label>
              <input
                id="rev-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t("authorPlaceholder")}
                className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
                disabled={submitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="rev-content" className="mb-1.5 block text-sm text-tone-soft">
                {t("contentLabel")}
              </label>
              <textarea
                id="rev-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("contentPlaceholder")}
                rows={5}
                className="min-h-[140px] w-full resize-y rounded-xl border border-metal-bronze/30 bg-black/30 px-4 py-3 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
                disabled={submitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="rev-images" className="mb-1.5 block text-sm text-tone-soft">
                {t("imagesLabel")}
              </label>
              <input
                id="rev-images"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => onPickFiles(e.target.files)}
                className="block w-full text-sm text-tone-body file:mr-3 file:rounded-lg file:border-0 file:bg-metal-bronze-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-tone-strong"
                disabled={submitting}
              />
              {previewUrls.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewUrls.map((url) => (
                    <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {formMessage === "validation" ? (
            <p className="mt-3 text-sm font-medium text-amber-200/95">{t("validationContent")}</p>
          ) : null}
          {formMessage === "success" ? (
            <p className="mt-3 text-sm font-medium text-emerald-300/95">{t("success")}</p>
          ) : null}
          {formMessage === "error" ? <p className="mt-3 text-sm font-medium text-red-300/95">{t("error")}</p> : null}
          <Button type="submit" size="lg" className="mt-6 h-12 rounded-xl font-semibold" disabled={submitting}>
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </motion.form>
        ) : null}
      </div>
    </section>
  );
}
