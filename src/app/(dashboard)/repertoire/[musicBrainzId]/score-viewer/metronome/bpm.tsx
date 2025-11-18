"use client";

import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";

import { Minus, Plus } from "lucide-react";

import {
  maxBpm,
  minBpm,
  useMetronomeStore,
} from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/metronome/store";

import type { FC } from "react";

const MetronomeBpm: FC = () => {
  const bpm = useMetronomeStore((state) => state.bpm);
  const setBpm = useMetronomeStore((state) => state.setBpm);
  const increaseBpm = useMetronomeStore((state) => state.increaseBpm);
  const decreaseBpm = useMetronomeStore((state) => state.decreaseBpm);
  const isIncreasingBpmDisabled = useMetronomeStore((state) =>
    state.isIncreasingBpmDisabled(),
  );
  const isDecreasingBpmDisabled = useMetronomeStore((state) =>
    state.isDecreasingBpmDisabled(),
  );

  return (
    <>
      <h4 className="font-bold select-none text-3xl">
        {bpm} <span className="text-sm">BPM</span>
      </h4>
      <Slider
        aria-label="bpm"
        startContent={
          <Button
            isIconOnly
            variant="light"
            isDisabled={isDecreasingBpmDisabled}
            onPress={decreaseBpm}
          >
            <Minus />
          </Button>
        }
        endContent={
          <Button
            isIconOnly
            variant="light"
            isDisabled={isIncreasingBpmDisabled}
            onPress={increaseBpm}
          >
            <Plus />
          </Button>
        }
        value={bpm}
        onChange={(value) => setBpm(value as number)}
        minValue={minBpm}
        maxValue={maxBpm}
      />
    </>
  );
};

export default MetronomeBpm;
