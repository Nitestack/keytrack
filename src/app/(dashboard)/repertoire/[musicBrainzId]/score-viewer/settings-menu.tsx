"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Switch } from "@heroui/switch";

import { Settings2 } from "lucide-react";

import { IconButton } from "yet-another-react-lightbox";

import { useScoreViewerControls } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/context";
import { useLightboxPortalTarget } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/use-lightbox-portal";

import type { FC } from "react";

declare module "yet-another-react-lightbox" {
  interface Labels {
    "Show settings"?: string;
  }
}

const ScoreViewerSettingsMenu: FC = () => {
  const { toggleFullscreen, toggleThumbnails } = useScoreViewerControls();

  const portalContainer = useLightboxPortalTarget();

  return (
    <Popover portalContainer={portalContainer}>
      <PopoverTrigger>
        <IconButton label="Show settings" icon={Settings2} />
      </PopoverTrigger>
      <PopoverContent className="items-start gap-2 p-2.5">
        <Switch onValueChange={toggleFullscreen}>Fullscreen</Switch>
        <Switch defaultSelected onValueChange={toggleThumbnails}>
          Thumbnails
        </Switch>
      </PopoverContent>
    </Popover>
  );
};

export default ScoreViewerSettingsMenu;
