"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import PitchFrequency from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/frequency";
import PitchOctave from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/octave";
import PitchSelector from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/pitch";
import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";
import usePitch from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/use-pitch";
import PitchVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/volume";

import type { FC } from "react";

const Pitch: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const isPlaying = usePitchStore((state) => state.isPlaying);
  const toggleIsPlaying = usePitchStore((state) => state.toggleIsPlaying);

  const open = Boolean(anchorEl);

  usePitch();

  return (
    <Popover
      id="pitch"
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
      <Card>
        <CardHeader
          title="Pitch"
          slotProps={{
            title: {
              textAlign: "center",
            },
          }}
        />
        <CardContent className="flex flex-col items-center gap-4 select-none">
          <PitchSelector />
          <div className="grid grid-cols-2 gap-8 items-center justify-between w-full">
            <PitchOctave />
            <PitchFrequency />
          </div>
          <PitchVolume />
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

export default Pitch;
