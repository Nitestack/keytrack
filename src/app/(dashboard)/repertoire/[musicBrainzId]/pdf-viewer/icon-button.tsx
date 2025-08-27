import clsx from "clsx";

import IconButton from "~/components/icon-button";

import type { IconButtonProps } from "@mui/material/IconButton";
import type { FC } from "react";

const PdfIconButton: FC<IconButtonProps> = ({ className, ...props }) => {
  return (
    <IconButton
      {...props}
      className={clsx("absolute z-50 bg-black/15 text-white", className)}
    />
  );
};

export default PdfIconButton;
