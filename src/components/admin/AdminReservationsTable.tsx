"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import type { ReservationRecord } from "@/lib/reservation-store";

type Props = {
  reservations: ReservationRecord[];
};

export function AdminReservationsTable({ reservations }: Props) {
  const [copiedId, setCopiedId] = useState<string>("");

  const copyForTranslation = async (row: ReservationRecord) => {
    const text = [
      `고객명: ${row.name}`,
      `연락처: ${row.phone}`,
      `서비스 유형: ${row.serviceType}`,
      `일정: ${row.travelDate} ${row.travelTime}`,
      `출발지: ${row.startPoint}`,
      `목적지: ${row.destination}`,
      `공항 선택: ${row.airport}`,
      `비행 편명: ${row.flightNo || "-"}`,
      `희망 차량: ${row.vehicle}`,
      `인원/수하물: ${row.passengers}명 / ${row.luggage}개`,
      `희망 메신저: ${row.preferredMessenger}`,
      `상태: ${row.status}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedId(row.id);
    setTimeout(() => setCopiedId(""), 1400);
  };

  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-tone-body">
        아직 접수된 예약이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#081121]/80">
      <table className="min-w-[1080px] w-full text-left">
        <thead className="bg-brand-deep/60 text-xs uppercase tracking-[0.14em] text-metal-bronze-strong">
          <tr>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">고객 정보</th>
            <th className="px-4 py-3">구간 정보</th>
            <th className="px-4 py-3">옵션</th>
            <th className="px-4 py-3">메신저</th>
            <th className="px-4 py-3">번역 편의</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-sm text-tone-body">
          {reservations.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-4 py-4">
                <span className="rounded-full border border-metal-bronze/40 bg-metal-bronze-soft px-3 py-1 text-xs font-semibold text-tone-strong">
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-tone-strong">{row.name}</p>
                <p>{row.phone}</p>
                <p className="text-xs text-tone-soft">{new Date(row.createdAt).toLocaleString("ko-KR")}</p>
              </td>
              <td className="px-4 py-4">
                <p>{row.startPoint} → {row.destination}</p>
                <p className="text-xs text-tone-soft">{row.travelDate} {row.travelTime} / {row.serviceType}</p>
                <p className="text-xs text-tone-soft">공항: {row.airport} / 편명: {row.flightNo || "-"}</p>
              </td>
              <td className="px-4 py-4">
                <p>{row.vehicle}</p>
                <p className="text-xs text-tone-soft">{row.passengers}명 / 수하물 {row.luggage}개</p>
              </td>
              <td className="px-4 py-4">{row.preferredMessenger}</td>
              <td className="px-4 py-4">
                <button
                  type="button"
                  onClick={() => copyForTranslation(row)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-metal-bronze/40 bg-black/30 px-4 text-sm font-semibold text-tone-sky hover:border-metal-bronze-strong"
                >
                  <Copy className="h-4 w-4" />
                  {copiedId === row.id ? "복사 완료" : "텍스트 복사"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
