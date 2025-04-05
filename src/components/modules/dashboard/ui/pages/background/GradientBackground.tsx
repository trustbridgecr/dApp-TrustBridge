"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  opacity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryPosition?: string;
  secondaryPosition?: string;
  primarySize?: string;
  secondarySize?: string;
  primaryBlur?: string;
  secondaryBlur?: string;
}

export function GradientBackground({
  children,
  className,
  opacity = 30,
  primaryColor = "bg-emerald-200",
  secondaryColor = "bg-teal-200",
  primaryPosition = "-top-40 -right-40",
  secondaryPosition = "top-1/2 -left-40",
  primarySize = "w-80 h-80",
  secondarySize = "w-80 h-80",
  primaryBlur = "blur-3xl",
  secondaryBlur = "blur-3xl",
}: GradientBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={`absolute inset-0 overflow-hidden opacity-${opacity} pointer-events-none`}
      >
        <div
          className={`absolute ${primaryPosition} ${primarySize} rounded-full ${primaryColor} ${primaryBlur}`}
        ></div>
        <div
          className={`absolute ${secondaryPosition} ${secondarySize} rounded-full ${secondaryColor} ${secondaryBlur}`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
