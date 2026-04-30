import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveSupportInquiry, type SupportInquiryRecord } from "@/lib/support-inquiry-store";

type Payload = {
  locale?: string;
  name?: string;
  phone?: string;
  departure?: string;
  destination?: string;
  travelDate?: string;
  travelTime?: string;
  passengers?: string;
  message?: string;
  outOfMetroArea?: boolean;
};

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

async function sendInquiryMail(record: SupportInquiryRecord) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to =
    process.env.SUPPORT_NOTIFY_TO ?? process.env.RESERVATION_NOTIFY_TO;
  const from = process.env.RESERVATION_NOTIFY_FROM ?? user;

  if (!host || !port || !user || !pass || !to || !from) {
    return { delivered: false as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const extra = record.outOfMetroArea ? "예 (수도권 외/기타 지역)" : "아니오";

  await transporter.sendMail({
    from,
    to,
    subject: `[고객 문의] ${record.name} (${record.phone})`,
    text: [
      `문의 ID: ${record.id}`,
      `접수: ${record.createdAt}`,
      `로케일: ${record.locale}`,
      `성함: ${record.name}`,
      `연락처: ${record.phone}`,
      `기타 지역 문의: ${extra}`,
      `출발지: ${record.departure}`,
      `도착지: ${record.destination}`,
      `날짜: ${record.travelDate}`,
      `시간: ${record.travelTime}`,
      `인원: ${record.passengers}`,
      `추가 요청: ${record.message || "-"}`,
    ].join("\n"),
  });

  return { delivered: true as const };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const locale =
      typeof body.locale === "string" && body.locale.trim()
        ? body.locale.trim()
        : "ko";

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const departure = typeof body.departure === "string" ? body.departure.trim() : "";
    const destination =
      typeof body.destination === "string" ? body.destination.trim() : "";
    const travelDate =
      typeof body.travelDate === "string" ? body.travelDate.trim() : "";
    const travelTime =
      typeof body.travelTime === "string" ? body.travelTime.trim() : "";
    const passengers =
      typeof body.passengers === "string" ? body.passengers.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (
      !name ||
      !phone ||
      !departure ||
      !destination ||
      !travelDate ||
      !travelTime ||
      !passengers
    ) {
      return NextResponse.json(
        { ok: false, message: "missing_fields" },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { ok: false, message: "invalid_phone" },
        { status: 400 }
      );
    }

    const record: SupportInquiryRecord = {
      id: `sup_${randomUUID()}`,
      createdAt: new Date().toISOString(),
      locale,
      name,
      phone,
      departure,
      destination,
      travelDate,
      travelTime,
      passengers,
      message,
      outOfMetroArea: Boolean(body.outOfMetroArea),
    };

    await saveSupportInquiry(record);
    const mail = await sendInquiryMail(record);

    return NextResponse.json({
      ok: true,
      mailDelivered: mail.delivered,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
