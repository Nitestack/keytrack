"use client";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import clsx from "clsx";

import type { FC } from "react";

const PdfToolbar: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <SpeedDial
      className={clsx(
        "absolute bottom-4",
        isMobile ? "-translate-x-1/2 left-1/2" : "right-4",
      )}
      direction={isMobile ? "up" : "left"}
      ariaLabel="pdf-toolbar"
      icon={<MoreHorizIcon />}
    >
      <SpeedDialAction></SpeedDialAction>
    </SpeedDial>
  );
};

export default PdfToolbar;
