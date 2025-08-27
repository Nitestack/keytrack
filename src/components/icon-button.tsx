import MuiIconButton from "@mui/material/IconButton";

import clsx from "clsx";

import type { IconButtonProps } from "@mui/material/IconButton";
import type { FC } from "react";

const IconButton: FC<IconButtonProps> = ({ className, ...props }) => {
  return (
    <MuiIconButton
      {...props}
      className={clsx("py-2.5 px-3.5 rounded-2xl transition", className)}
    />
  );
};

export default IconButton;
