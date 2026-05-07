"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  section: string;
  purpose: string;
  value: string;
  onChange: (nextUrl: string) => void;
  label?: string;
  hint?: string;
};

export function AdminImageUploader({
  section,
  purpose,
  value,
  onChange,
  label = "이미지",
  hint = "JPG/PNG/WebP 업로드 또는 URL 직접 입력",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const previewSrc = useMemo(() => value.trim(), [value]);

  const onUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("section", section);
      fd.set("purpose", purpose);
      const res = await fetch("/api/admin/image-upload", { method: "POST", body: fd });
      const result = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (!result.ok || !result.url) {
        setMessage(result.message ?? "업로드 실패");
        return;
      }
      onChange(result.url);
      setMessage("업로드 완료");
    } catch {
      setMessage("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-white/12 bg-black/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-tone-strong">{label}</p>
          <p className="text-[11px] text-tone-soft">{hint}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand-gold/35 bg-brand-gold/10 px-3 py-2 text-xs font-semibold text-brand-gold hover:bg-brand-gold/15">
          {uploading ? "업로드 중…" : "업로드"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/admin-uploads/..."
        className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong placeholder:text-tone-soft/50"
      />

      {previewSrc ? (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/30">
          <Image src={previewSrc} alt="" fill unoptimized className="object-cover" />
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-white/15 text-xs text-tone-soft">
          미리보기 없음
        </div>
      )}

      {message ? <p className="text-[11px] text-tone-sky">{message}</p> : null}
    </div>
  );
}

