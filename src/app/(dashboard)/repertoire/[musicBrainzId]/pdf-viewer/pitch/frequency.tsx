"use client";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

import type { FC } from "react";

const PitchFrequency: FC = () => {
  const baseFrequency = usePitchStore((state) => state.baseFrequency);
  const increaseBaseFrequency = usePitchStore(
    (state) => state.increaseBaseFrequency,
  );
  const decreaseBaseFrequency = usePitchStore(
    (state) => state.decreaseBaseFrequency,
  );
  const isIncreasingBaseFrequencyDisabled = usePitchStore(
    (state) => state.isIncreasingBaseFrequencyDisabled,
  );
  const isDecreasingBaseFrequencyDisabled = usePitchStore(
    (state) => state.isDecreasingBaseFrequencyDisabled,
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <IconButton
        disabled={isDecreasingBaseFrequencyDisabled}
        onClick={decreaseBaseFrequency}
      >
        <RemoveIcon />
      </IconButton>
      <Typography className="select-none font-bold" variant="h6">
        {baseFrequency}
      </Typography>
      <IconButton
        disabled={isIncreasingBaseFrequencyDisabled}
        onClick={increaseBaseFrequency}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default PitchFrequency;
