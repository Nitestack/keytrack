"use client";

import { Button } from "@heroui/button";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/store";
import { chromaticNotes } from "~/services/music-theory";

import type { FC } from "react";

const PitchSelector: FC = () => {
  const selectedPitch = usePitchStore((state) => state.selectedPitch);
  const setSelectedPitch = usePitchStore((state) => state.setSelectedPitch);

  return (
    <div className="grid grid-cols-4 gap-2 justify-center items-center">
      {chromaticNotes.map((pitch) => (
        <Button
          className="w-18 whitespace-nowrap"
          key={pitch}
          color={pitch === selectedPitch ? "primary" : "default"}
          variant={pitch === selectedPitch ? "bordered" : "light"}
          onPress={() => setSelectedPitch(pitch)}
        >
          {pitch}
        </Button>
      ))}
    </div>
  );
};

export default PitchSelector;
