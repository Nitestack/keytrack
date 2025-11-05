"use client";

import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Modal, ModalContent } from "@heroui/modal";
import { cn } from "@heroui/react";
import { Tab, Tabs } from "@heroui/tabs";
import { useDisclosure } from "@heroui/use-disclosure";

import {
  AudioLines,
  Ellipsis,
  EllipsisVertical,
  Music3,
  Timer,
} from "lucide-react";

import { useState } from "react";

import Metronome from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome";
import Pitch from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch";
import Tuner from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner";

import type { Key } from "@react-types/shared";
import type { FC } from "react";

const PdfToolbar: FC<{ isMobile: boolean; fullScreenEl?: Element }> = ({
  isMobile,
  fullScreenEl,
}) => {
  const [activeTool, setActiveTool] = useState<Key>("metronome");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleOnAction(key: Key | null) {
    if (!key) return;
    onOpen();
    setActiveTool(key);
  }

  return (
    <>
      <Dropdown portalContainer={fullScreenEl}>
        <DropdownTrigger>
          <Button
            color="primary"
            className={cn(
              "absolute bottom-4 z-50",
              isMobile ? "-translate-x-1/2 left-1/2" : "right-4",
            )}
            isIconOnly
          >
            {isMobile ? <EllipsisVertical /> : <Ellipsis />}
          </Button>
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
        portalContainer={fullScreenEl}
      >
        <ModalContent>
          <Tabs
            fullWidth
            aria-label="pdf-toolbar"
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
              <Tuner fullScreenEl={fullScreenEl} />
            </Tab>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PdfToolbar;
