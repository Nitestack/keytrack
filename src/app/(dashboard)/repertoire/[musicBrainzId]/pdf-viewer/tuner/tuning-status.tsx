"use client";

import { Chip } from "@heroui/chip";

import { CircleArrowDown, CircleArrowUp, CircleCheck } from "lucide-react";

import { useShallow } from "zustand/react/shallow";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerStatus: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);
  const tuningStatus = useTunerStore(
    useShallow((state) => state.tuningStatus()),
  );

  if (isListening && tuningStatus)
    return (
      <Chip
        startContent={
          tuningStatus.color === "success" ? (
            <CircleCheck />
          ) : tuningStatus.cents > 0 ? (
            <CircleArrowUp />
          ) : (
            <CircleArrowDown />
          )
        }
        color={tuningStatus.color}
        variant="flat"
      >
        <span className="font-bold">{tuningStatus.text.toUpperCase()}</span>
      </Chip>
    );
};

export default TunerStatus;
