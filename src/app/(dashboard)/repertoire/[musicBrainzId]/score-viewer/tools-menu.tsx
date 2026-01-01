"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Modal, ModalContent } from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";
import { useDisclosure } from "@heroui/use-disclosure";

import {
  AudioLines,
  Ellipsis,
  Music,
  Music3,
  SlidersVertical,
  Timer,
} from "lucide-react";

import { useState } from "react";

import { IconButton } from "yet-another-react-lightbox";

import Metronome from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/metronome";
import Pitch from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch";
import Tuner from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner";
import { useLightboxPortalTarget } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/use-lightbox-portal";

import type { Key } from "@react-types/shared";
import type { FC } from "react";

declare module "yet-another-react-lightbox" {
  interface Labels {
    "Show tools"?: string;
  }
}

const ScoreViewerToolsMenu: FC = () => {
  const [activeTool, setActiveTool] = useState<Key>("metronome");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const portalContainer = useLightboxPortalTarget();

  function handleOnAction(key: Key | null) {
    if (!key) return;
    onOpen();
    setActiveTool(key);
  }

  return (
    <>
      <Dropdown portalContainer={portalContainer}>
        <DropdownTrigger>
          <IconButton label="Show tools" icon={SlidersVertical} />
        </DropdownTrigger>
        <DropdownMenu onAction={handleOnAction}>
          <DropdownItem key="metronome" startContent={<Timer />}>
            Metronome
          </DropdownItem>
          <DropdownItem key="pitch" startContent={<Music3 />}>
            Pitch
          </DropdownItem>
          <DropdownItem key="tuner" startContent={<AudioLines />}>
            Tuner
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        portalContainer={portalContainer}
      >
        <ModalContent>
          <Tabs
            fullWidth
            aria-label="tool-menu"
            selectedKey={activeTool}
            onSelectionChange={setActiveTool}
          >
            <Tab key="metronome" title="Metronome">
              <Metronome />
            </Tab>
            <Tab key="pitch" title="Pitch">
              <Pitch />
            </Tab>
            <Tab key="tuner" title="Tuner">
              <Tuner />
            </Tab>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScoreViewerToolsMenu;
