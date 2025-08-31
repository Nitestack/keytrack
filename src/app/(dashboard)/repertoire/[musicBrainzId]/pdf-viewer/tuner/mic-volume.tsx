"use client";

import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerMicVolume: FC = () => {
  const volume = useTunerStore((state) => state.volume);
  const isListening = useTunerStore((state) => state.isListening);
  return (
    <div className="flex items-center gap-2 w-full">
      {volume > 1 ? (
        <MicIcon fontSize="small" color={volume > 70 ? "error" : "primary"} />
      ) : (
        <MicOffIcon
          fontSize="small"
          color={isListening ? "error" : "disabled"}
        />
      )}
      <LinearProgress
        variant="determinate"
        value={volume}
        className="flex-1"
        color={volume > 70 ? "error" : volume > 30 ? "primary" : "inherit"}
      />
      <Typography className="min-w-8 text-right" variant="caption">
        {Math.round(volume)}%
      </Typography>
    </div>
  );
};

export default TunerMicVolume;
