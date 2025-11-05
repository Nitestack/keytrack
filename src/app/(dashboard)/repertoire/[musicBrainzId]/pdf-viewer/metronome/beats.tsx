"use client";

import { cn } from "@heroui/react";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeBeats: FC = () => {
  const beat = useMetronomeStore((state) => state.beat);
  const maxBeat = useMetronomeStore((state) => state.maxBeat());
  const isPlaying = useMetronomeStore((state) => state.isPlaying);

  if (isPlaying)
    return (
      <div
        className={cn(
          "flex gap-1 flex-wrap items-center w-35",
          maxBeat > 8 ? "justify-start" : "justify-center",
        )}
      >
        {Array.from({ length: maxBeat }, (_, index) => (
          <div
            key={index}
            className={cn(
              "size-3.5 rounded-full transition-colors duration-100",
              index + 1 === beat
                ? index === 0
                  ? "bg-danger"
                  : "bg-primary"
                : "bg-default",
            )}
          ></div>
        ))}
      </div>
    );
  else return null;
};

export default MetronomeBeats;
