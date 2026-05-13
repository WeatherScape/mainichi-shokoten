import type { ReactNode } from "react";
import type { FrameStyle } from "@/lib/types";
import { cn, frameClassName } from "@/lib/utils";

export function FrameShell({
  frameStyle,
  children,
  className
}: {
  frameStyle: FrameStyle;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("frame-base", frameClassName(frameStyle), className)}>
      {children}
    </div>
  );
}
