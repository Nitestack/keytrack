"use client";

import Box from "@mui/material/Box";

import clsx from "clsx";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeBeats: FC = () => {
  const beat = useMetronomeStore((state) => state.beat);
  const maxBeat = useMetronomeStore((state) => state.maxBeat);
  const isPlaying = useMetronomeStore((state) => state.isPlaying);

  if (isPlaying)
    return (
      <div
        className={clsx(
          "flex gap-1 flex-wrap items-center w-35",
          maxBeat > 8 ? "justify-start" : "justify-center",
        )}
      >
        {Array.from({ length: maxBeat }, (_, index) => (
          <Box
            key={index}
            className="size-3.5 rounded-full transition-colors duration-100"
            sx={{
              backgroundColor:
                index + 1 === beat
                  ? index === 0
                    ? "error.main"
                    : "primary.main"
                  : "grey.300",
            }}
          />
        ))}
      </div>
    );
  else return null;
};

export default MetronomeBeats;
