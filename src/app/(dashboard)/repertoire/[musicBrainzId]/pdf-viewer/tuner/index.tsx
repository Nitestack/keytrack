"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import { useState } from "react";

import type { FC } from "react";

const Tuner: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const open = Boolean(anchorEl);

  function toggleIsPlaying() {
    setIsPlaying((currentIsPlaying) => !currentIsPlaying);
  }

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
        <CardContent className="flex flex-col items-center gap-4 select-none"></CardContent>
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

export default Tuner;
