import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveReservation, type ReservationRecord } from "@/lib/reservation-store";

type ReservationPayload = Omit<ReservationRecord, "id" | "createdAt" | "status">;

const REQUIRED_FIELDS: (keyof ReservationPayload)[] = [
  "locale",
  "name",
  "phone",
  "serviceType",
  "travelDate",
  "travelTime",
  "startPoint",
  "destination",
  "airport",
  "vehicle",
  "passengers",
  "luggage",
  "preferredMessenger",
];

function isPayloadValid(payload: Partial<ReservationPayload>) {
  return REQUIRED_FIELDS.every((field) => {
    const value = payload[field];
    if (typeof value === "number") return Number.isFinite(value);
    return typeof value === "string" && value.trim().length > 0;
  });
}

async function sendReservationMail(record: ReservationRecord) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.RESERVATION_NOTIFY_TO;
  const from = process.env.RESERVATION_NOTIFY_FROM ?? user;

  if (!host || !port || !user || !pass || !to || !from) {
    return { delivered: false, reason: "SMTP not configured" as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: `[신규 예약 알림] ${record.name} (${record.phone})`,
    text: [
      `예약 ID: ${record.id}`,
      `접수시각: ${record.createdAt}`,
      `상태: ${record.status}`,
      `로케일: ${record.locale}`,
      `고객명: ${record.name}`,
      `연락처: ${record.phone}`,
      `서비스 유형: ${record.serviceType}`,
      `일정: ${record.travelDate} ${record.travelTime}`,
      `출발지: ${record.startPoint}`,
      `목적지: ${record.destination}`,
      `공항 선택: ${record.airport}`,
      `비행 편명: ${record.flightNo || "-"}`,
      `희망 차량: ${record.vehicle}`,
      `인원수: ${record.passengers}`,
      `수하물: ${record.luggage}`,
      `희망 메신저: ${record.preferredMessenger}`,
    ].join("\n"),
  });

  return { delivered: true as const };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ReservationPayload>;
    if (!isPayloadValid(payload)) {
      return NextResponse.json(
        { ok: false, message: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const record: ReservationRecord = {
      id: `resv_${randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: "대기",
      locale: payload.locale!,
      name: payload.name!.trim(),
      phone: payload.phone!.trim(),
      serviceType: payload.serviceType!.trim(),
      travelDate: payload.travelDate!.trim(),
      travelTime: payload.travelTime!.trim(),
      startPoint: payload.startPoint!.trim(),
      destination: payload.destination!.trim(),
      airport: payload.airport!.trim(),
      flightNo: payload.flightNo?.trim(),
      vehicle: payload.vehicle!.trim(),
      passengers: Number(payload.passengers),
      luggage: Number(payload.luggage),
      preferredMessenger: payload.preferredMessenger!.trim(),
    };

    await saveReservation(record);
    const mailResult = await sendReservationMail(record);

    return NextResponse.json({
      ok: true,
      message: "예약 상담 신청이 접수되었습니다.",
      mailDelivered: mailResult.delivered,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "예약 저장 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
