"use client";

import Typography from "@mui/material/Typography";

import clsx from "clsx";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerFrequencyDisplay: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const detectedNote = useTunerStore((state) => state.detectedNote);

  return (
    <Typography
      className={clsx("font-bold select-none", {
        "opacity-30": !isListening,
      })}
      variant="h4"
    >
      {detectedNote?.frequency.toFixed(1).replace(/\.0$/i, "") ?? 0}{" "}
      <Typography variant="caption">Hz</Typography>
    </Typography>
  );
};

export default TunerFrequencyDisplay;
