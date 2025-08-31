"use client";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

import type { FC } from "react";

const PitchOctave: FC = () => {
  const octave = usePitchStore((state) => state.octave);
  const increaseOctave = usePitchStore((state) => state.increaseOctave);
  const decreaseOctave = usePitchStore((state) => state.decreaseOctave);
  const isIncreasingOctaveDisabled = usePitchStore(
    (state) => state.isIncreasingOctaveDisabled,
  );
  const isDecreasingOctaveDisabled = usePitchStore(
    (state) => state.isDecreasingOctaveDisabled,
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <IconButton
        disabled={isDecreasingOctaveDisabled}
        onClick={decreaseOctave}
      >
        <RemoveIcon />
      </IconButton>
      <Typography className="select-none font-bold" variant="h6">
        {octave}
      </Typography>
      <IconButton
        disabled={isIncreasingOctaveDisabled}
        onClick={increaseOctave}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default PitchOctave;
