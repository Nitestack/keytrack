"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import TunerFrequency from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/frequency";
import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";
import TunerTranspose from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/transpose";

import type { FC } from "react";

const Tuner: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const isListening = useTunerStore((state) => state.isListening);
  const toggleIsListening = useTunerStore((state) => state.toggleIsListening);

  const open = Boolean(anchorEl);

  return (
    <Popover
      id="tuner"
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
          title="Tuner"
          slotProps={{
            title: {
              textAlign: "center",
            },
          }}
        />
        <CardContent className="flex flex-col items-center gap-4 select-none">
          <div className="grid grid-cols-2 gap-4 items-center justify-between w-92">
            <TunerTranspose />
            <TunerFrequency />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            color={isListening ? "error" : "primary"}
            onClick={toggleIsListening}
            startIcon={isListening ? <StopIcon /> : <PlayArrowIcon />}
          >
            {isListening ? "Stop" : "Start"}
          </Button>
        </CardActions>
      </Card>
    </Popover>
  );
};

export default Tuner;
