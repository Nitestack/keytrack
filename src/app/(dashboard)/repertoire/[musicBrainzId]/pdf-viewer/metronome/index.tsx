"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import MetronomeBeats from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/beats";
import MetronomeBpm from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/bpm";
import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";
import MetronomeTimeSignature from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/time-signature";
import { useMetronome } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/use-metronome";
import MetronomeVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/volume";

import type { FC } from "react";

const Metronome: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const isPlaying = useMetronomeStore((state) => state.isPlaying);
  const toggleIsPlaying = useMetronomeStore((state) => state.toggleIsPlaying);

  const open = Boolean(anchorEl);

  useMetronome();

  return (
    <Popover
      id="metronome"
      container={fullScreenEl}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Card className="min-w-72">
        <CardHeader
          title="Metronome"
          slotProps={{
            title: {
              textAlign: "center",
            },
          }}
        />
        <CardContent className="flex flex-col items-center gap-4">
          <MetronomeBpm />
          <MetronomeTimeSignature />
          <MetronomeBeats />
          <MetronomeVolume />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            color={isPlaying ? "error" : "primary"}
            onClick={toggleIsPlaying}
            startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
          >
            {isPlaying ? "Stop" : "Start"}
          </Button>
        </CardActions>
      </Card>
    </Popover>
  );
};

export default Metronome;
