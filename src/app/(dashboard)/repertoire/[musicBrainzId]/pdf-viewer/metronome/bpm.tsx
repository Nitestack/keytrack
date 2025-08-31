"use client";

import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  maxBpm,
  minBpm,
  useMetronomeStore,
} from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeBpm: FC = () => {
  const bpm = useMetronomeStore((state) => state.bpm);
  const setBpm = useMetronomeStore((state) => state.setBpm);
  const increaseBpm = useMetronomeStore((state) => state.increaseBpm);
  const decreaseBpm = useMetronomeStore((state) => state.decreaseBpm);
  const isIncreasingBpmDisabled = useMetronomeStore(
    (state) => state.isIncreasingBpmDisabled,
  );
  const isDecreasingBpmDisabled = useMetronomeStore(
    (state) => state.isDecreasingBpmDisabled,
  );

  return (
    <>
      <Typography className="font-bold select-none" variant="h4">
        {bpm} <Typography variant="caption">BPM</Typography>
      </Typography>
      <div className="flex items-center w-full gap-4">
        <IconButton disabled={isDecreasingBpmDisabled} onClick={decreaseBpm}>
          <RemoveIcon />
        </IconButton>
        <Slider
          aria-label="bpm"
          value={bpm}
          onChange={(_, newBpm) => setBpm(newBpm)}
          min={minBpm}
          max={maxBpm}
        />
        <IconButton disabled={isIncreasingBpmDisabled} onClick={increaseBpm}>
          <AddIcon />
        </IconButton>
      </div>
    </>
  );
};

export default MetronomeBpm;
