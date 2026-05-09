/** 화면에 실제로 보이는 문구(저장값 없으면 fallback) */
export function effectiveText(saved: string, fallback: string): string {
  const s = saved.trim();
  if (s) return saved;
  return fallback;
}

/**
 * 저장 시: 입력 문구가 번역 기본값과 동일하면 빈 문자열로 저장해 오버라이드를 제거합니다.
 */
export function persistIfDiffersFromFallback(draft: string, fallback: string): string {
  if (draft.trim() === fallback.trim()) return "";
  return draft;
}

export function msgAt(messages: Record<string, unknown> | undefined, path: string[]): string {
  let cur: unknown = messages;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur : "";
}
