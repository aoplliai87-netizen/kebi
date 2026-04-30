"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { SITE_KAKAO_CHAT_URL, SITE_PHONE_TEL } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const FAQ_IDS = [1, 2, 3, 4, 5] as const;

export function BespokeSupportExperience() {
  const t = useTranslations("Support");
  const locale = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [passengers, setPassengers] = useState("");
  const [message, setMessage] = useState("");
  const [outOfMetro, setOutOfMetro] = useState(false);

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const validatePhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (
      !name.trim() ||
      !phone.trim() ||
      !departure.trim() ||
      !destination.trim() ||
      !travelDate ||
      !travelTime ||
      !passengers.trim()
    ) {
      setFieldError("validationRequired");
      return;
    }
    if (!validatePhone(phone)) {
      setFieldError("validationPhone");
      return;
    }

    setSubmitState("loading");
    try {
      const res = await fetch("/api/support-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: name.trim(),
          phone: phone.trim(),
          departure: departure.trim(),
          destination: destination.trim(),
          travelDate,
          travelTime,
          passengers: passengers.trim(),
          message: message.trim(),
          outOfMetroArea: outOfMetro,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
      setName("");
      setPhone("");
      setDeparture("");
      setDestination("");
      setTravelDate("");
      setTravelTime("");
      setPassengers("");
      setMessage("");
      setOutOfMetro(false);
    } catch {
      setSubmitState("error");
    }
  };

  const labelCls =
    "mb-1.5 block text-sm font-medium text-tone-soft md:text-base";

  const inputCls =
    "h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-base text-tone-strong outline-none transition-colors placeholder:text-tone-soft focus:border-metal-bronze-strong";

  return (
    <div className="bg-[radial-gradient(circle_at_15%_15%,rgba(97,138,196,0.12),transparent_38%),linear-gradient(180deg,#04070d_0%,#071224_55%,#05080f_100%)]">
      <section className="scroll-mt-24 border-b border-border/45 pt-6 pb-12 md:pb-16 md:pt-10">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: LUX_EASE }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-metal-bronze-strong md:text-xs">
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-3 font-sans text-3xl font-bold tracking-[-0.02em] text-tone-strong md:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-tone-body md:text-lg">
              {t("heroDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: LUX_EASE, delay: 0.05 }}
            className="mt-10 rounded-3xl border border-white/10 bg-[#0a1324]/85 p-6 backdrop-blur-md md:p-8"
          >
            <h2 className="font-sans text-2xl font-bold tracking-[-0.02em] text-tone-sky md:text-3xl">
              {t("faqTitle")}
            </h2>
            <div className="mt-6 space-y-2">
              {FAQ_IDS.map((id) => {
                const open = openFaq === id;
                return (
                  <div
                    key={id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/25"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : id)}
                      className="flex w-full items-start gap-3 px-4 py-4 text-left md:px-5"
                      aria-expanded={open}
                    >
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0 text-metal-bronze-strong transition-transform",
                          !open && "-rotate-90",
                        )}
                        aria-hidden
                      />
                      <span className="font-semibold text-tone-strong md:text-lg">
                        {t(`faq${id}Q`)}
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-white/10 px-4 pb-4 pl-12 pr-4 pt-3 md:px-5 md:pb-5 md:pl-14 md:pt-3.5">
                        <p className="text-sm leading-relaxed text-tone-body md:text-base">
                          {t(`faq${id}A`)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/45 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 className="font-sans text-2xl font-bold tracking-[-0.02em] text-tone-strong md:text-3xl">
            {t("formTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-tone-body md:text-lg">{t("formDesc")}</p>

          <form
            onSubmit={handleSubmit}
            onInput={() => {
              setSubmitState((s) => (s === "success" || s === "error" ? "idle" : s));
              setFieldError(null);
            }}
            className="mt-8 space-y-5 rounded-3xl border border-metal-bronze/25 bg-surface/50 p-6 md:p-8"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="sup-name" className={labelCls}>
                  {t("fieldName")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
              <div>
                <label htmlFor="sup-phone" className={labelCls}>
                  {t("fieldPhone")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="sup-from" className={labelCls}>
                  {t("fieldDeparture")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-from"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
              <div>
                <label htmlFor="sup-to" className={labelCls}>
                  {t("fieldDestination")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-to"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="sup-date" className={labelCls}>
                  {t("fieldDate")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
              <div>
                <label htmlFor="sup-time" className={labelCls}>
                  {t("fieldTime")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-time"
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
              <div>
                <label htmlFor="sup-pax" className={labelCls}>
                  {t("fieldPassengers")}{" "}
                  <span className="text-brand-gold/90">({t("requiredHint")})</span>
                </label>
                <input
                  id="sup-pax"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  placeholder="예: 성인 2, 유아 1"
                  className={inputCls}
                  disabled={submitState === "loading"}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/12 bg-black/20 px-4 py-3">
              <input
                type="checkbox"
                checked={outOfMetro}
                onChange={(e) => setOutOfMetro(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-white/25 bg-black/40 text-brand-gold focus:ring-brand-gold/40"
                disabled={submitState === "loading"}
              />
              <span>
                <span className="font-medium text-tone-strong">{t("fieldOutOfMetro")}</span>
                <span className="mt-1 block text-sm text-tone-soft">
                  {t("fieldOutOfMetroHint")}
                </span>
              </span>
            </label>

            <div>
              <label htmlFor="sup-msg" className={labelCls}>
                {t("fieldMessage")}
              </label>
              <textarea
                id="sup-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("placeholderMessage")}
                rows={4}
                className="min-h-[120px] w-full resize-y rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-base text-tone-strong outline-none placeholder:text-tone-soft focus:border-metal-bronze-strong"
                disabled={submitState === "loading"}
              />
            </div>

            {fieldError && (
              <p className="text-sm font-medium text-red-300/95">{t(fieldError)}</p>
            )}
            {submitState === "success" && (
              <p className="text-sm font-medium text-emerald-300/95">{t("success")}</p>
            )}
            {submitState === "error" && (
              <p className="text-sm font-medium text-red-300/95">{t("errorGeneric")}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-14 w-full rounded-xl text-base font-semibold md:w-auto md:min-w-[200px]"
              disabled={submitState === "loading"}
            >
              {submitState === "loading" ? t("submitting") : t("submit")}
            </Button>
          </form>

          <div className="mt-12 rounded-3xl border border-metal-bronze/35 bg-gradient-to-r from-brand-deep/55 to-surface p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-metal-bronze-strong">
              {t("quickEyebrow")}
            </p>
            <h3 className="mt-3 font-sans text-2xl font-bold tracking-[-0.02em] text-tone-strong md:text-4xl">
              {t("quickTitle")}
            </h3>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a href={SITE_PHONE_TEL} className="block flex-1 sm:min-w-[240px]">
                <span className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-600 px-8 text-lg font-semibold text-emerald-50 shadow-lg transition-colors hover:bg-emerald-500">
                  {t("quickPhone")}
                </span>
              </a>
              <a
                href={SITE_KAKAO_CHAT_URL}
                target="_blank"
                rel="noreferrer"
                className="block flex-1 sm:min-w-[240px]"
              >
                <span className="inline-flex h-14 w-full items-center justify-center rounded-2xl border-2 border-[#FEE500]/90 bg-[#FEE500] px-8 text-lg font-semibold text-[#191919] shadow-lg transition-opacity hover:opacity-95">
                  {t("quickKakao")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
