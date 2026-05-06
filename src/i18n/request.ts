import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function deepMerge(base: unknown, override: unknown): unknown {
  if (
    base &&
    override &&
    typeof base === "object" &&
    typeof override === "object" &&
    !Array.isArray(base) &&
    !Array.isArray(override)
  ) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, val] of Object.entries(override as Record<string, unknown>)) {
      out[key] = deepMerge((base as Record<string, unknown>)[key], val);
    }
    return out;
  }
  return override ?? base;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const baseMessages = (await import(`../../messages/en.json`)).default;
  const localeMessages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: deepMerge(baseMessages, localeMessages) as Record<string, unknown>,
  };
});
