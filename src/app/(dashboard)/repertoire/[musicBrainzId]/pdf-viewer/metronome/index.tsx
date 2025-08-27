"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RemoveIcon from "@mui/icons-material/Remove";
import StopIcon from "@mui/icons-material/Stop";

import { useEffect, useState } from "react";

import clsx from "clsx";

import type { FC } from "react";

const minBpm = 30;
const maxBpm = 280;

const minNum = 2;
const maxNum = 32;
const minDenomExponent = 0;
const maxDenominatorExponent = 6;

function getFeltCount(num: number) {
  if (num % 3 === 0 && num !== 3) return num / 3;
  else return num;
}

const Metronome: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  fullScreenEl?: Element;
}> = ({ anchorEl, handleClose, fullScreenEl }) => {
  const [bpm, setBpm] = useState(100);

  const [num, setNum] = useState(4);
  const [denomExponent, setDenomExponent] = useState(2);

  const [isPlaying, setIsPlaying] = useState(false);
  const [count, setCount] = useState(0);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (isPlaying) {
      function stepMetronome() {
        setCount((prevCount) =>
          prevCount < getFeltCount(num) ? prevCount + 1 : 1,
        );
      }

      const period = Math.round((60 / bpm) * 1000);
      const intervalId = setInterval(stepMetronome, period);
      stepMetronome();

      return () => clearInterval(intervalId);
    } else {
      setCount(0);
    }
  }, [isPlaying]);

  function increaseBpm() {
    if (isPlaying || bpm >= maxBpm) return;
    setBpm((currentBpm) => currentBpm + 1);
  }
  function decreaseBpm() {
    if (isPlaying || bpm <= minBpm) return;
    setBpm((currentBpm) => currentBpm - 1);
  }

  function increaseNumerator() {
    if (isPlaying || num >= maxNum) return;
    setNum((currentNum) => currentNum + 1);
  }
  function decreaseNumerator() {
    if (isPlaying || num <= minNum) return;
    setNum((currentNum) => currentNum - 1);
  }
  function increaseDenominator() {
    if (isPlaying || denomExponent >= maxDenominatorExponent) return;
    setDenomExponent((currentDenom) => currentDenom + 1);
  }
  function decreaseDenominator() {
    if (isPlaying || denomExponent <= minDenomExponent) return;
    setDenomExponent((currentDenom) => currentDenom - 1);
  }

  function togglePlaying() {
    setIsPlaying((currentIsPlaying) => !currentIsPlaying);
  }

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
          <Typography className="font-bold select-none" variant="h4">
            {bpm} <Typography variant="caption">BPM</Typography>
          </Typography>
          {!isPlaying && (
            <div className="flex items-center w-full gap-4">
              <IconButton disabled={bpm <= minBpm} onClick={decreaseBpm}>
                <RemoveIcon />
              </IconButton>
              <Slider
                aria-label="bpm"
                value={bpm}
                onChange={(_, newBpm) => setBpm(newBpm)}
                min={minBpm}
                max={maxBpm}
              />
              <IconButton disabled={bpm >= maxBpm} onClick={increaseBpm}>
                <AddIcon />
              </IconButton>
            </div>
          )}
          <div className="flex justify-center">
            <div className="flex items-center">
              <div className="flex flex-col">
                {!isPlaying && (
                  <IconButton
                    disabled={num <= minNum}
                    onClick={decreaseNumerator}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
                <Typography
                  className="text-center font-bold select-none"
                  variant="h4"
                >
                  {num}
                </Typography>
                {!isPlaying && (
                  <IconButton
                    disabled={num >= maxNum}
                    onClick={increaseNumerator}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </div>
              <Typography variant="h4">/</Typography>
              <div className="flex flex-col">
                {!isPlaying && (
                  <IconButton
                    disabled={denomExponent <= minDenomExponent}
                    onClick={decreaseDenominator}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
                <Typography
                  className="text-center font-bold select-none"
                  variant="h4"
                >
                  {Math.pow(2, denomExponent)}
                </Typography>
                {!isPlaying && (
                  <IconButton
                    disabled={denomExponent >= maxDenominatorExponent}
                    onClick={increaseDenominator}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
          {isPlaying && (
            <div
              className={clsx(
                "flex gap-1 flex-wrap items-center w-35",
                getFeltCount(num) > 8 ? "justify-start" : "justify-center",
              )}
            >
              {Array.from({ length: getFeltCount(num) }, (_, index) => (
                <Box
                  key={index}
                  className="size-3.5 rounded-full transition-colors duration-100"
                  sx={{
                    backgroundColor:
                      index + 1 === count ? "primary.main" : "grey.300",
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            color={isPlaying ? "error" : "primary"}
            onClick={togglePlaying}
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
