"use client";

import { cn } from "@heroui/react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerFrequencyDisplay: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const detectedNote = useTunerStore((state) => state.detectedNote);

  return (
    <h4
      className={cn("font-bold select-none text-3xl", {
        "opacity-30": !isListening,
      })}
    >
      {detectedNote?.frequency.toFixed(1).replace(/\.0$/i, "") ?? 0}{" "}
      <span className="text-sm">Hz</span>
    </h4>
  );
};

export default TunerFrequencyDisplay;
