"use client";

import { useState } from "react";

export function AdminLoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? "로그인에 실패했습니다.");
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:p-8"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-metal-bronze-strong">Admin Access</p>
      <h1 className="mt-2 text-2xl font-bold text-tone-strong md:text-3xl">관리자 로그인</h1>
      <p className="mt-2 text-sm text-tone-body">관리자 계정으로 로그인 후 대시보드에 접근할 수 있습니다.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-tone-soft">아이디</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/35 px-3 text-sm text-tone-strong"
            placeholder="admin"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-tone-soft">비밀번호</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/35 px-3 text-sm text-tone-strong"
            placeholder="비밀번호 입력"
            autoComplete="current-password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg border border-metal-bronze/45 bg-metal-bronze-soft px-4 text-sm font-semibold text-tone-strong disabled:opacity-60"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
