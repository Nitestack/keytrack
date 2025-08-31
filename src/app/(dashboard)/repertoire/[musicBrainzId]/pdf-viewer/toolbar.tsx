"use client";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import AvTimerIcon from "@mui/icons-material/AvTimer";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { useState } from "react";

import clsx from "clsx";

import Metronome from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome";
import Pitch from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch";
import Tuner from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner";

import type { SpeedDialActionProps } from "@mui/material/SpeedDialAction";
import type { FC, MouseEvent } from "react";

const PdfToolbar: FC<{ isMobile: boolean; fullScreenEl?: Element }> = ({
  isMobile,
  fullScreenEl,
}) => {
  const [open, setOpen] = useState(false);
  const [metronomeEl, setMetronomeEl] = useState<HTMLElement | null>(null);
  const [pitchEl, setPitchEl] = useState<HTMLElement | null>(null);
  const [tunerEl, setTunerEl] = useState<HTMLElement | null>(null);

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleMetronomeClick = (event: MouseEvent<HTMLDivElement>) => {
    setMetronomeEl(event.currentTarget);
  };
  function handleMetronomeClose() {
    setMetronomeEl(null);
  }

  function handlePitchClick(event: MouseEvent<HTMLDivElement>) {
    setPitchEl(event.currentTarget);
  }
  function handlePitchClose() {
    setPitchEl(null);
  }

  function handleTunerClick(event: MouseEvent<HTMLDivElement>) {
    setTunerEl(event.currentTarget);
  }
  function handleTunerClose() {
    setTunerEl(null);
  }

  const actions: (Omit<SpeedDialActionProps, "key"> & { name: string })[] = [
    {
      name: "Metronome",
      icon: <AvTimerIcon />,
      onClick: handleMetronomeClick,
    },
    {
      name: "Pitch",
      icon: <MusicNoteIcon />,
      onClick: handlePitchClick,
    },
    {
      name: "Tuner",
      icon: <GraphicEqIcon />,
      onClick: handleTunerClick,
    },
  ];

  return (
    <>
      <SpeedDial
        className={clsx(
          "absolute bottom-4 z-50",
          isMobile ? "-translate-x-1/2 left-1/2" : "right-4",
        )}
        direction={isMobile ? "up" : "left"}
        ariaLabel="pdf-toolbar"
        icon={isMobile ? <MoreVertIcon /> : <MoreHorizIcon />}
        open={open}
        onClick={handleToggle}
        // Disable default hover behavior
        onMouseEnter={undefined}
        onMouseLeave={undefined}
      >
        {actions.map(({ name, onClick, ...action }) => (
          <SpeedDialAction
            key={name}
            {...action}
            slotProps={{
              tooltip: {
                title: name,
                slotProps: {
                  popper: {
                    container: fullScreenEl,
                  },
                },
              },
            }}
            onClick={(ev) => {
              ev.stopPropagation();
              onClick?.(ev);
            }}
          />
        ))}
      </SpeedDial>
      <Metronome
        anchorEl={metronomeEl}
        handleClose={handleMetronomeClose}
        fullScreenEl={fullScreenEl}
      />
      <Pitch
        anchorEl={pitchEl}
        handleClose={handlePitchClose}
        fullScreenEl={fullScreenEl}
      />
      <Tuner
        anchorEl={tunerEl}
        handleClose={handleTunerClose}
        fullScreenEl={fullScreenEl}
      />
    </>
  );
};

export default PdfToolbar;
