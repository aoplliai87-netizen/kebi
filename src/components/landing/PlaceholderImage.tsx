import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AspectPreset = "square" | "video" | "wide" | "portrait" | "hero";

const aspectClass: Record<AspectPreset, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
  hero: "aspect-[5/3]",
};

export interface PlaceholderImageProps extends HTMLAttributes<HTMLDivElement> {
  /** 고정 비율 프리셋. `className`으로 `aspect-*`를 넣으면 함께 적용 가능 */
  aspect?: AspectPreset;
}

/**
 * 회색 톤 플레이스홀더. 실제 이미지 자산 전까지 레이아웃·비율 확보용.
 */
export function PlaceholderImage({
  className,
  aspect = "video",
  role = "img",
  "aria-label": ariaLabel = "이미지 영역",
  ...props
}: PlaceholderImageProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-muted/25",
        "ring-1 ring-inset ring-white/5",
        aspectClass[aspect],
        className
      )}
      {...props}
    />
  );
}
