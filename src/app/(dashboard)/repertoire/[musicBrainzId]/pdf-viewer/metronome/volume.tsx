"use client";

import { Slider } from "@heroui/slider";

import { Volume2, VolumeOff } from "lucide-react";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

import type { FC } from "react";

const MetronomeVolume: FC = () => {
  const volume = useMetronomeStore((state) => state.volume);
  const setVolume = useMetronomeStore((state) => state.setVolume);

  return (
    <Slider
      label="Volume"
      value={volume}
      onChange={(newVolume) => setVolume(newVolume as number)}
      startContent={
        volume === 0 ? (
          <VolumeOff className="text-danger" size={16} />
        ) : (
          <Volume2 size={16} />
        )
      }
      minValue={0}
      maxValue={100}
      size="sm"
      getValue={(percentage) => `${percentage as number}%`}
    />
  );
};

export default MetronomeVolume;
