"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import TunerFrequencyDisplay from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/frequency-display";
import TunerFrequencySetter from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/frequency-setter";
import TunerMicSelect from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/mic-select";
import TunerMicVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/mic-volume";
import TunerNeedle from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/needle";
import TunerNoteDisplay from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/note-display";
import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";
import TunerTranspose from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/transpose";
import TunerStatus from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/tuning-status";
import { useTuner } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/use-tuner";

import type { FC } from "react";

const Tuner: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const isListening = useTunerStore((state) => state.isListening);

  const { error, handleToggleListening } = useTuner();

  const open = Boolean(anchorEl);

  return (
    <Popover
      id="tuner"
      container={fullScreenEl}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
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
        <CardContent className="flex flex-col items-center gap-4 select-none max-w-90">
          {error && <Alert severity="error">{error.message}</Alert>}
          <TunerMicSelect fullScreenEl={fullScreenEl} />
          <TunerNoteDisplay />
          <TunerNeedle />
          <TunerFrequencyDisplay />
          <TunerMicVolume />
          <TunerStatus />
          <div className="grid grid-cols-2 gap-2 items-center justify-between w-full min-w-82">
            <TunerTranspose />
            <TunerFrequencySetter />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            color={isListening ? "error" : "primary"}
            onClick={handleToggleListening}
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
