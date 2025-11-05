"use client";

import { cn } from "@heroui/react";

import { useShallow } from "zustand/react/shallow";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const INDICATOR_RANGE_PERCENT = 45;
const INDICATOR_SCALE_FACTOR = 0.8;

const TunerNeedle: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const detectedNote = useTunerStore((state) => state.detectedNote);
  const tuningStatus = useTunerStore(
    useShallow((state) => state.tuningStatus()),
  );
  return (
    <div
      className={cn("transition-opacity relative w-full", {
        "opacity-30": !isListening || !detectedNote,
      })}
      role="img"
    >
      <div className="relative flex items-end justify-between">
        {Array.from({ length: 21 }).map((_, i) => {
          const isMiddleNeedle = i === 10;
          const isBigNeedle = !isMiddleNeedle && (i - 10) % 5 === 0;
          const isSmallNeedle = !isMiddleNeedle && (i - 10) % 5 !== 0;
          return (
            <div
              key={i}
              className={cn(
                "w-1 rounded-sm transition-all",
                {
                  "h-12": isMiddleNeedle,
                  "h-8": isBigNeedle,
                  "h-6": isSmallNeedle,
                },
                isMiddleNeedle
                  ? "bg-primary"
                  : isBigNeedle
                    ? "bg-secondary"
                    : "bg-default",
              )}
            />
          );
        })}
        {detectedNote && tuningStatus && (
          <div
            className="absolute top-0 transition-all duration-150 ease-out"
            style={{
              left: `calc(50% + ${Math.max(-INDICATOR_RANGE_PERCENT, Math.min(INDICATOR_RANGE_PERCENT, detectedNote.cents)) * INDICATOR_SCALE_FACTOR}%)`,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className={`w-2 h-16 rounded-sm shadow-lg transition-colors bg-${tuningStatus.color}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TunerNeedle;
