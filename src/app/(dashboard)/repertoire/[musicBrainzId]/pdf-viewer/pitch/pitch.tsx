"use client";

import Button from "@mui/material/Button";

import {
  chromaticPitches,
  usePitchStore,
} from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

import type { FC } from "react";

const PitchSelector: FC = () => {
  const selectedPitch = usePitchStore((state) => state.selectedPitch);
  const setSelectedPitch = usePitchStore((state) => state.setSelectedPitch);

  return (
    <div className="grid grid-cols-4 gap-2 justify-center items-center">
      {chromaticPitches.map((pitch) => (
        <Button
          className="w-18 whitespace-nowrap"
          key={pitch}
          variant={pitch === selectedPitch ? "outlined" : "text"}
          onClick={() => setSelectedPitch(pitch)}
        >
          {pitch}
        </Button>
      ))}
    </div>
  );
};

export default PitchSelector;
