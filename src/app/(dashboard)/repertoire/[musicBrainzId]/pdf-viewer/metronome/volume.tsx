"use client";

import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeVolume: FC = () => {
  const volume = useMetronomeStore((state) => state.volume);
  const setVolume = useMetronomeStore((state) => state.setVolume);

  return (
    <div className="flex items-center w-full gap-2">
      {volume === 0 ? (
        <VolumeMuteIcon fontSize="small" />
      ) : (
        <VolumeUpIcon fontSize="small" />
      )}
      <Slider
        aria-label="volume"
        value={volume}
        onChange={(_, newVolume) => setVolume(newVolume)}
        min={0}
        max={100}
        size="small"
      />
      <Typography variant="caption" className="min-w-8">
        {volume}%
      </Typography>
    </div>
  );
};

export default MetronomeVolume;
