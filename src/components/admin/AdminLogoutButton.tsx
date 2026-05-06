"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-black/25 px-4 text-sm font-semibold text-tone-strong hover:border-metal-bronze-strong disabled:opacity-60"
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
