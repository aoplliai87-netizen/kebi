import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "#kebi7621";
const ADMIN_COOKIE_NAME = "kebi_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  exp: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_RESERVATIONS_KEY ?? "kebi-admin-secret";
}

function toBase64Url(input: string) {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function sign(input: string) {
  return createHmac("sha256", getSessionSecret()).update(input).digest("base64url");
}

export function verifyAdminCredentials(id: string, password: string) {
  return id === ADMIN_ID && password === ADMIN_PASSWORD;
}

export function createAdminSessionToken() {
  const payload: SessionPayload = {
    sub: ADMIN_ID,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token || !token.includes(".")) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (payload.sub !== ADMIN_ID) return false;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS;
}

export function isAdminAuthenticated() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function isAdminRequestAuthenticated(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return verifyAdminSessionToken(token ?? null);
}
