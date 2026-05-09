"use client";

import type { ReactNode } from "react";
import type { LocaleKey } from "@/lib/site-settings-store";

const LOCALE_OPTIONS: LocaleKey[] = ["ko", "en", "ja", "zh"];

/** 공개 페이지 옆에 붙는 통일된 「수정」 버튼 */
export function BtnEdit({ onClick, label = "수정" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-brand-gold/50 bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-brand-gold shadow hover:bg-brand-gold/15"
    >
      {label}
    </button>
  );
}

type ToolbarProps = {
  previewLocale: LocaleKey;
  onPreviewLocale: (loc: LocaleKey) => void;
  onSave: () => void | Promise<void>;
  saving?: boolean;
  extra?: ReactNode;
  saveLabel?: string;
};

/** 미리보기 언어 + 저장 — 상단 공통 툴바 */
export function AdminVisualToolbar({
  previewLocale,
  onPreviewLocale,
  onSave,
  saving,
  extra,
  saveLabel = "저장",
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-tone-soft">미리보기 언어</span>
        <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-black/30 p-1">
          {LOCALE_OPTIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onPreviewLocale(loc)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                previewLocale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving}
          className="rounded-lg bg-brand-gold px-4 py-1.5 text-xs font-bold text-black disabled:opacity-50"
        >
          {saving ? "저장 중…" : saveLabel}
        </button>
      </div>
    </div>
  );
}

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  editLocale: LocaleKey;
  onEditLocale: (loc: LocaleKey) => void;
  children: ReactNode;
  onSave: () => void | Promise<void>;
  saving?: boolean;
  /** 현재 편집 패널의 해당 언어 오버라이드를 비우고 번역 기본값만 쓰도록 되돌립니다. */
  onReset?: () => void;
};

/** 섹션 편집용 모달 — 편집 탭 언어(ko/en/ja/zh) + 닫기/저장 */
export function AdminVisualModal({
  open,
  title,
  onClose,
  editLocale,
  onEditLocale,
  children,
  onSave,
  saving,
  onReset,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/70 p-4 md:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#0a1522] p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-tone-strong">{title}</p>
          <button
            type="button"
            onClick={onClose}
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
              onClick={() => onEditLocale(loc)}
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                editLocale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="space-y-3 text-sm">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2 text-sm">
            닫기
          </button>
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-white/25 px-4 py-2 text-sm text-tone-soft"
            >
              기본값으로 되돌리기
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={saving}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
