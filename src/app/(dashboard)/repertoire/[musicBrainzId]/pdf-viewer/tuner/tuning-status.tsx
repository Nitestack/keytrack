"use client";

import Chip from "@mui/material/Chip";

import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerStatus: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const tuningStatus = useTunerStore((state) => state.tuningStatus);

  if (isListening && tuningStatus)
    return (
      <Chip
        icon={
          tuningStatus.color === "success" ? (
            <CheckCircleIcon />
          ) : tuningStatus.cents > 0 ? (
            <ArrowCircleUpIcon />
          ) : (
            <ArrowCircleDownIcon />
          )
        }
        color={tuningStatus.color}
        label={tuningStatus.text.toUpperCase()}
        slotProps={{
          label: {
            className: "font-bold",
          },
        }}
      />
    );
};

export default TunerStatus;
