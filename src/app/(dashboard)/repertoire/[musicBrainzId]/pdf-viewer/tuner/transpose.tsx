"use client";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerTranspose: FC = () => {
  const selectedTransposeKey = useTunerStore(
    (state) => state.selectedTransposeKey,
  );
  const increaseTransposeKey = useTunerStore(
    (state) => state.increaseTransposeKey,
  );
  const decreaseTransposeKey = useTunerStore(
    (state) => state.decreaseTransposeKey,
  );
  const isIncreasingTransposeKeyDisabled = useTunerStore(
    (state) => state.isIncreasingTransposeKeyDisabled,
  );
  const isDecreasingTransposeKeyDisabled = useTunerStore(
    (state) => state.isDecreasingTransposeKeyDisabled,
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <IconButton
        disabled={isDecreasingTransposeKeyDisabled}
        onClick={decreaseTransposeKey}
      >
        <RemoveIcon />
      </IconButton>
      <Typography className="select-none font-bold" variant="h6">
        {selectedTransposeKey}
      </Typography>
      <IconButton
        disabled={isIncreasingTransposeKeyDisabled}
        onClick={increaseTransposeKey}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default TunerTranspose;
