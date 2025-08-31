"use client";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerFrequency: FC = () => {
  const baseFrequency = useTunerStore((state) => state.baseFrequency);
  const increaseBaseFrequency = useTunerStore(
    (state) => state.increaseBaseFrequency,
  );
  const decreaseBaseFrequency = useTunerStore(
    (state) => state.decreaseBaseFrequency,
  );
  const isIncreasingBaseFrequencyDisabled = useTunerStore(
    (state) => state.isIncreasingBaseFrequencyDisabled,
  );
  const isDecreasingBaseFrequencyDisabled = useTunerStore(
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
      <Typography className="font-bold select-none" variant="h6">
        {baseFrequency} <Typography variant="caption">Hz</Typography>
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

export default TunerFrequency;
