"use client";

import { cn } from "@heroui/react";

import { useShallow } from "zustand/react/shallow";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerNoteDisplay: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const tuningStatus = useTunerStore(
    useShallow((state) => state.tuningStatus()),
  );
  const detectedNote = useTunerStore((state) => state.detectedNote);

  return (
    <h1
      className={cn(
        "font-bold text-center transition-all duration-300 text-6xl",
        {
          "opacity-30": !isListening,
        },
        tuningStatus ? `text-${tuningStatus.color}` : "text-default",
      )}
      role="status"
      aria-live="polite"
    >
      {detectedNote ? `${detectedNote.note}${detectedNote.octave}` : "—"}
    </h1>
  );
};

export default TunerNoteDisplay;
