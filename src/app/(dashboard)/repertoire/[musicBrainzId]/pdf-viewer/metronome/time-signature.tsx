"use client";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeTimeSignature: FC = () => {
  const num = useMetronomeStore((state) => state.numerator);
  const increaseNum = useMetronomeStore((state) => state.increaseNumerator);
  const decreaseNum = useMetronomeStore((state) => state.decreaseNumerator);
  const isIncreasingNumDisabled = useMetronomeStore(
    (state) => state.isIncreasingNumeratorDisabled,
  );
  const isDecreasingNumDisabled = useMetronomeStore(
    (state) => state.isDecreasingNumeratorDisabled,
  );
  const denom = useMetronomeStore((state) => state.denominator);
  const increaseDenom = useMetronomeStore((state) => state.increaseDenominator);
  const decreaseDenom = useMetronomeStore((state) => state.decreaseDenominator);
  const isIncreasingDenomDisabled = useMetronomeStore(
    (state) => state.isIncreasingDenominatorDisabled,
  );
  const isDecreasingDenomDisabled = useMetronomeStore(
    (state) => state.isDecreasingDenominatorDisabled,
  );

  return (
    <div className="flex justify-center">
      <div className="flex items-center select-none">
        <div className="flex flex-col">
          <IconButton disabled={isDecreasingNumDisabled} onClick={decreaseNum}>
            <RemoveIcon />
          </IconButton>
          <Typography className="text-center font-bold" variant="h4">
            {num}
          </Typography>
          <IconButton disabled={isIncreasingNumDisabled} onClick={increaseNum}>
            <AddIcon />
          </IconButton>
        </div>
        <Typography variant="h4">/</Typography>
        <div className="flex flex-col">
          <IconButton
            disabled={isDecreasingDenomDisabled}
            onClick={decreaseDenom}
          >
            <RemoveIcon />
          </IconButton>
          <Typography className="text-center font-bold" variant="h4">
            {denom}
          </Typography>
          <IconButton
            disabled={isIncreasingDenomDisabled}
            onClick={increaseDenom}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MetronomeTimeSignature;
