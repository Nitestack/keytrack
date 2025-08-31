"use client";

import Typography from "@mui/material/Typography";

import clsx from "clsx";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerNoteDisplay: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const tuningStatus = useTunerStore((state) => state.tuningStatus);
  const detectedNote = useTunerStore((state) => state.detectedNote);

  return (
    <Typography
      className={clsx(
        "font-bold text-center transition-all duration-300 text-6xl",
        {
          "opacity-30": !isListening,
        },
      )}
      variant="h1"
      color={tuningStatus ? tuningStatus.color : "textDisabled"}
      role="status"
      aria-live="polite"
    >
      {detectedNote ? `${detectedNote.note}${detectedNote.octave}` : "—"}
    </Typography>
  );
};

export default TunerNoteDisplay;
