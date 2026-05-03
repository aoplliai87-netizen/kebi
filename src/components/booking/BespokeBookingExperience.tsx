"use client";

import { motion } from "framer-motion";
import {
  ArrowDownUp,
  BriefcaseBusiness,
  CalendarDays,
  Car,
  Clock3,
  Crown,
  PlaneTakeoff,
  Trophy,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  BOOKING_PRIMARY_ORDER,
  composeRouteLine,
  deriveLegacyAirportField,
  getBookingSubOptions,
  isBookingAirportPrimary,
  type BookingPrimaryArea,
} from "@/lib/booking-locations";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;
const LUX_TRANSITION = { duration: 0.8, ease: LUX_EASE } as const;

type ServiceType = "airport" | "city" | "golf" | "vip";

type Props = {
  locale: string;
  title: string;
  description: string;
};

const serviceOptions: {
  id: ServiceType;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "airport", label: "샌딩/픽업", detail: "인천/김포", icon: PlaneTakeoff },
  { id: "city", label: "일반 이동", detail: "시내/근교", icon: Car },
  { id: "golf", label: "골프 이동", detail: "라운딩 일정", icon: Trophy },
  { id: "vip", label: "의전 이동", detail: "비즈니스/VIP", icon: Crown },
];

const vehicleOptions = ["스타리아", "카니발", "쏠라티"];

const completionMessage: Record<string, string> = {
  ko: "We will check your reservation and contact you via your preferred messenger after a short wait. (운전 중일 경우 확인 후 연락드리겠습니다)",
  en: "We will check your reservation and contact you via your preferred messenger after a short wait. (If we are driving, we will contact you after checking.)",
};

const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatDisplayDate = (value: string, locale: string) => {
  if (!value) return locale === "ko" ? "연도-월-일" : "YYYY-MM-DD";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: locale === "ko" ? undefined : "short",
  }).format(date);
};

const buildTimeOptions = () => {
  const out: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 10) {
      out.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return out;
};

const TIME_OPTIONS = buildTimeOptions();

/** 00:00–11:50 → AM 열, 12:00–23:50 → PM 열 (10분 간격, 구역만 구분·각 줄은 12시각만) */
const AM_TIME_OPTIONS = TIME_OPTIONS.filter((t) => Number(t.slice(0, 2)) < 12);
const PM_TIME_OPTIONS = TIME_OPTIONS.filter((t) => Number(t.slice(0, 2)) >= 12);

/** 선택된 값 표시용 — 예: AM 3:30 / PM 4:00 */
const formatTimeDisplay = (value: string) => {
  if (!value) return "--:--";
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return value;
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${hour12}:${String(m).padStart(2, "0")}`;
};

/** 구역 안 목록 줄 — 오전/오후 레이블 없이 12시각만 (예: 3:30) */
const formatTimeSlotRow = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return value;
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}`;
};

const formatPhoneValue = (raw: string, locale: string) => {
  const trimmed = raw.replace(/[^\d+]/g, "");
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (hasPlus || locale !== "ko") {
    const chunks = (hasPlus ? digits : digits).match(/\d{1,3}/g) ?? [];
    return `${hasPlus ? "+" : ""}${chunks.join("-")}`.slice(0, 22);
  }

  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

type RouteEndState = {
  primary: BookingPrimaryArea | "";
  sub: string;
  detail: string;
};

type WaypointState = RouteEndState & { id: string };

const emptyRoute = (): RouteEndState => ({ primary: "", sub: "", detail: "" });

function isRouteEndComplete(end: RouteEndState): boolean {
  if (!end.primary || !end.sub.trim()) return false;
  if (isBookingAirportPrimary(end.primary)) return true;
  return end.detail.trim().length > 0;
}

const primaryTKey = (p: BookingPrimaryArea): string => {
  const map: Record<BookingPrimaryArea, string> = {
    incheon_airport: "primary_incheon_airport",
    gimpo_airport: "primary_gimpo_airport",
    seoul: "primary_seoul",
    gyeonggi: "primary_gyeonggi",
    other: "primary_other",
  };
  return map[p];
};

export function BespokeBookingExperience({ locale, title, description }: Props) {
  const t = useTranslations("BookingExperience");
  const tb = useTranslations("HomePage.booking");
  const datePanelRef = useRef<HTMLDivElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("airport");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [departure, setDeparture] = useState<RouteEndState>(() => emptyRoute());
  const [destination, setDestination] = useState<RouteEndState>(() => emptyRoute());
  const [flightNo, setFlightNo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [adultPassengers, setAdultPassengers] = useState(2);
  const [childPassengers, setChildPassengers] = useState(0);
  const [luggage, setLuggage] = useState(4);
  const [golfBags, setGolfBags] = useState(0);
  const [preferredMessenger, setPreferredMessenger] = useState("");
  const [waypoints, setWaypoints] = useState<WaypointState[]>([]);
  const [waypointModalOpen, setWaypointModalOpen] = useState(false);
  const [waypointDraft, setWaypointDraft] = useState<RouteEndState>(() => emptyRoute());

  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState<string>("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const startPoint = useMemo(() => {
    if (!departure.primary) return "";
    return composeRouteLine(departure.primary, departure.sub, departure.detail);
  }, [departure]);

  const destPoint = useMemo(() => {
    if (!destination.primary) return "";
    return composeRouteLine(destination.primary, destination.sub, destination.detail);
  }, [destination]);

  const airportField = useMemo(
    () => deriveLegacyAirportField(departure.primary, destination.primary),
    [departure.primary, destination.primary],
  );

  const showFlightRow = useMemo(
    () =>
      (departure.primary && isBookingAirportPrimary(departure.primary)) ||
      (destination.primary && isBookingAirportPrimary(destination.primary)),
    [departure.primary, destination.primary],
  );

  const serviceLabel = useMemo(
    () => serviceOptions.find((option) => option.id === serviceType)?.label ?? "샌딩/픽업",
    [serviceType],
  );
  const totalPassengers = useMemo(
    () => adultPassengers + childPassengers,
    [adultPassengers, childPassengers],
  );

  const waypointsSummary = useMemo(
    () =>
      waypoints
        .map((w) => (w.primary ? composeRouteLine(w.primary, w.sub, w.detail) : ""))
        .filter(Boolean)
        .join(" → "),
    [waypoints],
  );

  const confirmAndOpen = (url: string, message: string) => {
    if (typeof window === "undefined") return;
    const ok = window.confirm(message);
    if (!ok) return;
    const isHttp = url.startsWith("http://") || url.startsWith("https://");
    if (isHttp) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = url;
  };

  const swapRoutes = () => {
    setDeparture(destination);
    setDestination(departure);
  };

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (datePanelRef.current && !datePanelRef.current.contains(target)) setIsDateOpen(false);
      if (timePanelRef.current && !timePanelRef.current.contains(target)) setIsTimeOpen(false);
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDateOpen(false);
        setIsTimeOpen(false);
        setWaypointModalOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const start = new Date(year, month, 1);
    const startWeekday = start.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];

    for (let i = 0; i < 42; i += 1) {
      const dayOffset = i - startWeekday;
      const cellDate = new Date(year, month, dayOffset + 1);
      cells.push({
        iso: toISODate(cellDate),
        day: cellDate.getDate(),
        inMonth: cellDate.getMonth() === month,
      });
    }
    if (daysInMonth === 0) return [];
    return cells;
  }, [viewMonth]);

  const registerWaypoint = () => {
    if (!isRouteEndComplete(waypointDraft) || !waypointDraft.primary) return;
    setWaypoints((prev) => [
      ...prev,
      {
        id: `wp_${Math.random().toString(36).slice(2, 11)}`,
        primary: waypointDraft.primary,
        sub: waypointDraft.sub,
        detail: waypointDraft.detail,
      },
    ]);
    setWaypointDraft(emptyRoute());
  };

  const submitBooking = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !travelDate ||
      !travelTime ||
      !isRouteEndComplete(departure) ||
      !isRouteEndComplete(destination) ||
      !vehicle.trim()
    ) {
      setWarning(t("validationRoute"));
      return;
    }
    if (!preferredMessenger.trim()) {
      setWarning(t("validationMessenger"));
      return;
    }
    setSubmitting(true);
    fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        name,
        phone,
        serviceType: serviceLabel,
        travelDate,
        travelTime,
        startPoint,
        destination: destPoint,
        airport: airportField,
        flightNo,
        vehicle,
        passengers: totalPassengers,
        adultPassengers,
        childPassengers,
        luggage,
        golfBags,
        waypointsSummary: waypointsSummary || undefined,
        preferredMessenger,
      }),
    })
      .then(async (response) => {
        const result = (await response.json()) as { ok: boolean; message?: string };
        if (!result.ok) {
          setWarning(result.message ?? "예약 저장 중 오류가 발생했습니다.");
          return;
        }
        setWarning(completionMessage[locale] ?? completionMessage.ko);
      })
      .catch(() => {
        setWarning("예약 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      })
      .finally(() => setSubmitting(false));
  };

  const renderRouteFields = (
    label: string,
    value: RouteEndState,
    onChange: (next: RouteEndState) => void,
    idPrefix: string,
  ) => {
    const subOptions = value.primary ? getBookingSubOptions(value.primary) : [];
    return (
      <div className="space-y-3 rounded-2xl border border-metal-bronze/25 bg-black/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-metal-bronze-strong">{label}</p>
        <label className="sr-only" htmlFor={`${idPrefix}-primary`}>
          {t("primaryPlaceholder")}
        </label>
        <select
          id={`${idPrefix}-primary`}
          value={value.primary}
          onChange={(e) => {
            const v = e.target.value as BookingPrimaryArea | "";
            onChange({ primary: v, sub: "", detail: "" });
          }}
          className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none"
        >
          <option value="" className="bg-[#0a1324]">
            {t("primaryPlaceholder")}
          </option>
          {BOOKING_PRIMARY_ORDER.map((p) => (
            <option key={p} value={p} className="bg-[#0a1324]">
              {t(primaryTKey(p))}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`${idPrefix}-sub`}>
          {t("subPlaceholder")}
        </label>
        <select
          id={`${idPrefix}-sub`}
          value={value.sub}
          disabled={!value.primary}
          onChange={(e) => onChange({ ...value, sub: e.target.value })}
          className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          <option value="" className="bg-[#0a1324]">
            {t("subPlaceholder")}
          </option>
          {subOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0a1324]">
              {opt}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`${idPrefix}-detail`}>
          {t("detailPlaceholder")}
        </label>
        <input
          id={`${idPrefix}-detail`}
          value={value.detail}
          onChange={(e) => onChange({ ...value, detail: e.target.value })}
          placeholder={t("detailPlaceholder")}
          className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
        />
      </div>
    );
  };

  const subDraftOptions = waypointDraft.primary ? getBookingSubOptions(waypointDraft.primary) : [];

  return (
    <div className="bg-[radial-gradient(circle_at_15%_15%,rgba(97,138,196,0.12),transparent_38%),linear-gradient(180deg,#04070d_0%,#071224_55%,#05080f_100%)]">
      <section className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={LUX_TRANSITION}
            className="rounded-3xl border border-metal-bronze/35 bg-surface/65 p-6 md:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-gold/90 md:text-xs">
              {tb("eyebrow")}
            </p>
            <h1 className="mt-3 font-sans text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-brand-gold md:text-4xl lg:text-5xl">
              {t("onlineTitle")}
            </h1>
            <p className="mt-4 text-lg font-semibold text-tone-body">{title}</p>
            <p className="mt-4 text-base leading-relaxed text-tone-body md:text-lg">{description}</p>

            <div className="mt-8 space-y-3">
              {[t("steps.s1"), t("steps.s2"), t("steps.s3"), t("steps.s4")].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-tone-body">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-metal-bronze/35 bg-white/[0.03] p-4">
              <p className="text-sm text-tone-soft">빠른 상담</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    confirmAndOpen(
                      SITE_PHONE_TEL,
                      "전화 연결을 하시겠습니까?\n확인을 누르면 통화 화면으로 이동합니다.",
                    )
                  }
                  className="h-11 w-full rounded-xl text-sm font-semibold"
                >
                  <img src="/icons/phone.svg" alt="" className="h-4 w-4" />
                  전화 상담
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    confirmAndOpen(
                      SITE_KAKAO_CHAT_URL,
                      "카카오톡 오픈채팅방으로 연결됩니다.\n이동하시겠습니까?",
                    )
                  }
                  className="h-11 w-full rounded-xl border-metal-bronze/40 text-sm font-semibold text-tone-sky"
                >
                  <img src="/icons/kakao.svg" alt="" className="h-4 w-4" />
                  카카오톡 상담
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    confirmAndOpen(
                      SITE_WHATSAPP_URL,
                      "WhatsApp 채팅으로 연결됩니다.\n이동하시겠습니까?",
                    )
                  }
                  className="h-11 w-full rounded-xl border-metal-bronze/40 text-sm font-semibold text-tone-sky"
                >
                  <img src="/icons/whatsapp.svg" alt="" className="h-4 w-4" />
                  WhatsApp (왓츠앱)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    confirmAndOpen(SITE_LINE_URL, "LINE 채팅으로 연결됩니다.\n이동하시겠습니까?")
                  }
                  className="h-11 w-full rounded-xl border-metal-bronze/40 text-sm font-semibold text-tone-sky"
                >
                  <img src="/icons/line.svg" alt="" className="h-4 w-4" />
                  LINE (라인)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    confirmAndOpen(
                      SITE_INSTAGRAM_DM_URL,
                      "Instagram DM으로 이동합니다.\n연결하시겠습니까?",
                    )
                  }
                  className="h-11 w-full rounded-xl border-metal-bronze/40 text-sm font-semibold text-tone-sky"
                >
                  <img src="/icons/instagram.svg" alt="" className="h-4 w-4" />
                  Instagram DM
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    confirmAndOpen(
                      SITE_FACEBOOK_MESSENGER_URL,
                      "Facebook Messenger로 연결됩니다.\n이동하시겠습니까?",
                    )
                  }
                  className="h-11 w-full rounded-xl border-metal-bronze/40 text-sm font-semibold text-tone-sky"
                >
                  <img src="/icons/messenger.svg" alt="" className="h-4 w-4" />
                  Facebook Messenger
                </Button>
              </div>
            </div>
          </motion.aside>

          <motion.form
            onSubmit={submitBooking}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={LUX_TRANSITION}
            className="space-y-5 overflow-visible"
          >
            <section className="relative z-30 rounded-3xl border border-metal-bronze/30 bg-black/30 p-5 backdrop-blur-md md:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-metal-bronze-strong md:text-base">Step 1. 기본 정보</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="성함 *"
                  className="h-12 rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneValue(e.target.value, locale))}
                  placeholder="연락처 *"
                  className="h-12 rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
                />
              </div>
              <p className="mt-3 text-xs text-tone-soft">{t("dateHint")}</p>
            </section>

            <section
              className={cn(
                "relative overflow-visible rounded-3xl border border-metal-bronze/30 bg-black/30 p-5 backdrop-blur-md md:p-6",
                isDateOpen || isTimeOpen ? "z-[100]" : "z-40",
              )}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-metal-bronze-strong md:text-base">Step 2. 일정 및 유형</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((option) => {
                  const Icon = option.icon;
                  const active = serviceType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setServiceType(option.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        active
                          ? "border-metal-bronze-strong bg-metal-bronze-soft text-tone-strong shadow-[0_6px_16px_rgba(140,96,66,0.22)]"
                          : "border-white/15 bg-black/25 text-tone-soft hover:border-metal-bronze/45"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="text-base font-semibold">{option.label}</p>
                          <p className={`text-xs ${active ? "text-tone-body" : "text-tone-soft"}`}>{option.detail}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div ref={datePanelRef} className="relative">
                  <label htmlFor="booking-travel-date" className="mb-2 block text-sm text-tone-soft">
                    날짜
                  </label>
                  <input id="booking-travel-date" type="hidden" value={travelDate} />
                  <button
                    type="button"
                    aria-label="여행 날짜 선택"
                    aria-haspopup="dialog"
                    aria-expanded={isDateOpen}
                    onClick={() => {
                      setIsDateOpen((v) => !v);
                      setIsTimeOpen(false);
                    }}
                    className="flex h-12 w-full items-center rounded-xl border border-metal-bronze/30 bg-black/30 pl-10 pr-4 text-left text-base text-tone-strong transition-colors hover:border-metal-bronze-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-metal-bronze/45"
                  >
                    <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-metal-bronze-strong" />
                    <span>{formatDisplayDate(travelDate, locale)}</span>
                  </button>
                  {isDateOpen && (
                    <div
                      role="dialog"
                      aria-label="달력 날짜 선택기"
                      className="absolute z-[110] mt-2 w-full min-w-[19rem] rounded-2xl border border-metal-bronze/30 bg-[#0b1424] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-tone-soft hover:bg-white/10"
                          onClick={() =>
                            setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                          }
                          aria-label="이전 달"
                        >
                          {"<"}
                        </button>
                        <p className="text-sm font-semibold text-tone-strong">
                          {viewMonth.getFullYear()}-{String(viewMonth.getMonth() + 1).padStart(2, "0")}
                        </p>
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-tone-soft hover:bg-white/10"
                          onClick={() =>
                            setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                          }
                          aria-label="다음 달"
                        >
                          {">"}
                        </button>
                      </div>
                      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-tone-soft">
                        {WEEKDAY_LABELS_KO.map((w) => (
                          <span key={w}>{w}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((cell) => {
                          const selected = travelDate === cell.iso;
                          return (
                            <button
                              key={cell.iso}
                              type="button"
                              onClick={() => {
                                setTravelDate(cell.iso);
                                setIsDateOpen(false);
                              }}
                              className={`h-10 rounded-lg text-sm transition-colors ${
                                selected
                                  ? "bg-brand-gold text-black font-semibold"
                                  : cell.inMonth
                                    ? "text-tone-body hover:bg-white/10"
                                    : "text-tone-soft/40 hover:bg-white/5"
                              }`}
                              aria-label={`${cell.iso} 선택`}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div ref={timePanelRef} className="relative">
                  <label htmlFor="booking-travel-time" className="mb-2 block text-sm text-tone-soft">
                    시간
                  </label>
                  <input id="booking-travel-time" type="hidden" value={travelTime} />
                  <button
                    type="button"
                    aria-label="여행 시간 선택"
                    aria-haspopup="listbox"
                    aria-expanded={isTimeOpen}
                    onClick={() => {
                      setIsTimeOpen((v) => !v);
                      setIsDateOpen(false);
                    }}
                    className="flex h-12 w-full items-center rounded-xl border border-metal-bronze/30 bg-black/30 pl-10 pr-4 text-left text-base text-tone-strong transition-colors hover:border-metal-bronze-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-metal-bronze/45"
                  >
                    <Clock3 className="pointer-events-none absolute left-3 h-4 w-4 text-metal-bronze-strong" />
                    <span>{formatTimeDisplay(travelTime)}</span>
                  </button>
                  {isTimeOpen && (
                    <div
                      role="listbox"
                      aria-label="시간 선택 목록"
                      className="absolute z-[110] mt-2 w-full min-w-[17rem] rounded-2xl border border-metal-bronze/30 bg-[#0b1424] shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:min-w-[19rem]"
                    >
                      <div className="grid max-h-[min(22rem,70vh)] grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                        <div className="flex min-h-0 flex-col">
                          <div className="shrink-0 bg-[#0b1424] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-metal-bronze-strong">
                            AM
                          </div>
                          <div className="max-h-52 min-h-0 overflow-y-auto overscroll-contain p-1.5 sm:max-h-60">
                            {AM_TIME_OPTIONS.map((time) => (
                              <button
                                key={time}
                                type="button"
                                role="option"
                                aria-selected={travelTime === time}
                                onClick={() => {
                                  setTravelTime(time);
                                  setIsTimeOpen(false);
                                }}
                                className={`block h-10 w-full rounded-lg px-3 text-left text-sm ${
                                  travelTime === time
                                    ? "bg-brand-gold font-semibold text-black"
                                    : "text-tone-body hover:bg-white/10"
                                }`}
                              >
                                {formatTimeSlotRow(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex min-h-0 flex-col border-t border-white/10 sm:border-t-0">
                          <div className="shrink-0 bg-[#0b1424] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-metal-bronze-strong">
                            PM
                          </div>
                          <div className="max-h-52 min-h-0 overflow-y-auto overscroll-contain p-1.5 sm:max-h-60">
                            {PM_TIME_OPTIONS.map((time) => (
                              <button
                                key={time}
                                type="button"
                                role="option"
                                aria-selected={travelTime === time}
                                onClick={() => {
                                  setTravelTime(time);
                                  setIsTimeOpen(false);
                                }}
                                className={`block h-10 w-full rounded-lg px-3 text-left text-sm ${
                                  travelTime === time
                                    ? "bg-brand-gold font-semibold text-black"
                                    : "text-tone-body hover:bg-white/10"
                                }`}
                              >
                                {formatTimeSlotRow(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWaypointModalOpen(true)}
                  className="h-11 rounded-xl border-metal-bronze/45 px-5 text-sm font-semibold text-tone-sky"
                >
                  {t("waypointCta")}
                  {waypoints.length > 0 ? ` (${waypoints.length})` : ""}
                </Button>
                {waypoints.length > 0 ? (
                  <p className="text-sm text-tone-soft">
                    {t("waypointListLabel")}: {waypointsSummary}
                  </p>
                ) : null}
              </div>
            </section>

            <section
              className={cn(
                "relative rounded-3xl border border-metal-bronze/30 bg-black/30 p-5 backdrop-blur-md md:p-6",
                isDateOpen || isTimeOpen ? "z-[8]" : "z-20",
              )}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-metal-bronze-strong md:text-base">Step 3. 구간 정보</p>
              <div className="mt-4 space-y-4">
                {renderRouteFields(t("routeDeparture"), departure, setDeparture, "dep")}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapRoutes}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-metal-bronze/40 bg-black/30 px-5 text-sm font-semibold text-metal-bronze-strong transition-colors hover:border-metal-bronze-strong hover:bg-white/5"
                    aria-label={t("swapRoute")}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                    {t("swapRoute")}
                  </button>
                </div>
                {renderRouteFields(t("routeDestination"), destination, setDestination, "dest")}
                {showFlightRow ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="hidden md:block" aria-hidden />
                    <input
                      value={flightNo}
                      onChange={(e) => setFlightNo(e.target.value)}
                      placeholder={t("flightOptional")}
                      className="h-12 rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none md:col-span-1 md:col-start-2"
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-metal-bronze/30 bg-black/30 p-5 backdrop-blur-md md:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-metal-bronze-strong md:text-base">Step 4. 상세 옵션</p>
              <p className="mt-2 rounded-lg border border-brand-gold/35 bg-brand-gold-soft px-3 py-2 text-sm font-semibold text-[#f2d9aa]">
                6인 이상 탑승 시 추가 요금이 발생할 수 있습니다.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  required
                  className="h-12 rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none"
                >
                  <option value="" className="bg-[#0a1324]">
                    {t("vehiclePlaceholder")}
                  </option>
                  {vehicleOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#0a1324]">
                      {option}
                    </option>
                  ))}
                </select>

                <div className="flex h-12 items-center justify-between rounded-xl border border-metal-bronze/30 bg-black/30 px-3">
                  <span className="text-sm text-tone-soft">성인</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdultPassengers((v) => Math.max(1, v - 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-tone-strong">{adultPassengers}</span>
                    <button
                      type="button"
                      onClick={() => setAdultPassengers((v) => Math.min(20, v + 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex min-h-12 items-center justify-between rounded-xl border border-metal-bronze/30 bg-black/30 px-3 py-2">
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm text-tone-soft">{t("childLabelMain")}</span>
                    <span className="text-[11px] text-tone-soft/90">{t("childLabelSub")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildPassengers((v) => Math.max(0, v - 1))}
                      className="h-7 w-7 shrink-0 rounded-md border border-white/20 text-tone-strong"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-tone-strong">{childPassengers}</span>
                    <button
                      type="button"
                      onClick={() => setChildPassengers((v) => Math.min(20, v + 1))}
                      className="h-7 w-7 shrink-0 rounded-md border border-white/20 text-tone-strong"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="hidden md:block" aria-hidden />
                <div className="flex h-12 items-center justify-between rounded-xl border border-metal-bronze/30 bg-black/30 px-3">
                  <span className="text-sm text-tone-soft">{t("luggage")}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLuggage((v) => Math.max(0, v - 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-tone-strong">{luggage}</span>
                    <button
                      type="button"
                      onClick={() => setLuggage((v) => Math.min(30, v + 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex h-12 items-center justify-between rounded-xl border border-metal-bronze/30 bg-black/30 px-3">
                  <span className="text-sm text-tone-soft">{t("golfBags")}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGolfBags((v) => Math.max(0, v - 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-tone-strong">{golfBags}</span>
                    <button
                      type="button"
                      onClick={() => setGolfBags((v) => Math.min(20, v + 1))}
                      className="h-7 w-7 rounded-md border border-white/20 text-tone-strong"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-2 block text-sm text-tone-soft">{t("messengerLabel")}</label>
                <select
                  value={preferredMessenger}
                  onChange={(e) => setPreferredMessenger(e.target.value)}
                  className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none"
                >
                  <option value="" className="bg-[#0a1324]">
                    {t("messengerSelectPlaceholder")}
                  </option>
                  {[
                    "전화 상담",
                    "카카오톡 상담",
                    "WhatsApp (왓츠앱)",
                    "LINE (라인)",
                    "Instagram DM",
                    "Facebook Messenger",
                  ].map((channel) => (
                    <option key={channel} value={channel} className="bg-[#0a1324]">
                      {channel}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="rounded-3xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
              <div className="flex items-center gap-2 text-metal-bronze-strong">
                <BriefcaseBusiness className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em]">예약 요약</p>
              </div>
              <div className="mt-4 grid gap-2 text-base text-tone-body md:grid-cols-2 md:text-lg">
                <p>
                  성함: <span className="text-tone-strong">{name || "-"}</span>
                </p>
                <p>
                  연락처: <span className="text-tone-strong">{phone || "-"}</span>
                </p>
                <p>
                  서비스: <span className="text-tone-strong">{serviceLabel}</span>
                </p>
                <p>
                  일정:{" "}
                  <span className="text-tone-strong">
                    {travelDate || "-"} {travelTime || ""}
                  </span>
                </p>
                <p className="md:col-span-2">
                  {t("summaryRoute")}:{" "}
                  <span className="text-tone-strong">
                    {startPoint || "-"} → {destPoint || "-"}
                  </span>
                </p>
                {waypoints.length > 0 ? (
                  <p className="md:col-span-2">
                    {t("summaryWaypoints")}: <span className="text-tone-strong">{waypointsSummary}</span>
                  </p>
                ) : null}
                <p>
                  공항 요약: <span className="text-tone-strong">{airportField}</span>
                </p>
                <p>
                  비행 편명: <span className="text-tone-strong">{flightNo || "-"}</span>
                </p>
                <p>
                  차량: <span className="text-tone-strong">{vehicle || "-"}</span>
                </p>
                <p>
                  인원(성인/소아):{" "}
                  <span className="text-tone-strong">
                    {adultPassengers}명 / {childPassengers}명
                  </span>
                </p>
                <p>
                  총 탑승 인원: <span className="text-tone-strong">{totalPassengers}명</span>
                </p>
                <p>
                  {t("luggage")}: <span className="text-tone-strong">{luggage}개</span>
                </p>
                <p>
                  {t("summaryGolf")}: <span className="text-tone-strong">{golfBags}개</span>
                </p>
                <p>
                  {t("messengerLabel")}:{" "}
                  <span className="text-tone-strong">{preferredMessenger || "-"}</span>
                </p>
              </div>
              {warning ? (
                <p
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    warning.includes("We will check")
                      ? "border-[#5e8f5f]/40 bg-[#17301c]/50 text-[#b4e0b6]"
                      : "border-metal-bronze/45 bg-black/35 text-[#f2d0be]"
                  }`}
                >
                  {warning}
                </p>
              ) : null}
              <p className="mt-4 text-sm text-tone-soft">
                모든 예약은 상담 후 확정됩니다. 온라인 결제는 제공하지 않습니다.
              </p>
              <Button type="submit" size="lg" disabled={submitting} className="mt-5 h-14 w-full rounded-2xl text-base font-semibold">
                {submitting ? "예약 접수 중..." : "예약 상담 신청하기"}
              </Button>
            </section>
          </motion.form>
        </div>
      </section>

      {waypointModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setWaypointModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="waypoint-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-metal-bronze/35 bg-[#0b1424] p-5 shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="waypoint-modal-title" className="text-lg font-semibold text-tone-strong">
                {t("waypointModalTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setWaypointModalOpen(false)}
                className="rounded-lg p-1 text-tone-soft hover:bg-white/10 hover:text-tone-strong"
                aria-label={t("modalClose")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {waypoints.length > 0 ? (
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {waypoints.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-tone-body"
                  >
                    <span className="text-tone-strong">
                      {w.primary ? composeRouteLine(w.primary, w.sub, w.detail) : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWaypoints((prev) => prev.filter((x) => x.id !== w.id))}
                      className="shrink-0 text-xs font-semibold text-[#f2d0be] hover:underline"
                    >
                      {t("waypointRemove")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-tone-soft">{t("waypointEmpty")}</p>
            )}

            <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-metal-bronze-strong">{t("waypointAdd")}</p>
              <select
                value={waypointDraft.primary}
                onChange={(e) => {
                  const v = e.target.value as BookingPrimaryArea | "";
                  setWaypointDraft({ primary: v, sub: "", detail: "" });
                }}
                className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none"
              >
                <option value="">{t("primaryPlaceholder")}</option>
                {BOOKING_PRIMARY_ORDER.map((p) => (
                  <option key={p} value={p} className="bg-[#0a1324]">
                    {t(primaryTKey(p))}
                  </option>
                ))}
              </select>
              <select
                value={waypointDraft.sub}
                disabled={!waypointDraft.primary}
                onChange={(e) => setWaypointDraft((d) => ({ ...d, sub: e.target.value }))}
                className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong focus:border-metal-bronze-strong focus:outline-none disabled:opacity-45"
              >
                <option value="">{t("subPlaceholder")}</option>
                {subDraftOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0a1324]">
                    {opt}
                  </option>
                ))}
              </select>
              <input
                value={waypointDraft.detail}
                onChange={(e) => setWaypointDraft((d) => ({ ...d, detail: e.target.value }))}
                placeholder={t("detailPlaceholder")}
                className="h-12 w-full rounded-xl border border-metal-bronze/30 bg-black/30 px-4 text-base text-tone-strong placeholder:text-tone-soft focus:border-metal-bronze-strong focus:outline-none"
              />
              <Button
                type="button"
                onClick={registerWaypoint}
                disabled={!isRouteEndComplete(waypointDraft)}
                className="h-11 w-full rounded-xl text-sm font-semibold disabled:opacity-40"
              >
                {t("waypointAppend")}
              </Button>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setWaypointModalOpen(false)} className="rounded-xl border-metal-bronze/45 px-6">
                {t("modalClose")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
