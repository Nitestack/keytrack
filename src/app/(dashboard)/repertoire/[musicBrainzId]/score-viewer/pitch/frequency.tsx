"use client";

import { Button } from "@heroui/button";

import { Minus, Plus } from "lucide-react";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/store";

import type { FC } from "react";

const PitchFrequency: FC = () => {
  const baseFrequency = usePitchStore((state) => state.baseFrequency);
  const increaseBaseFrequency = usePitchStore(
    (state) => state.increaseBaseFrequency,
  );
  const decreaseBaseFrequency = usePitchStore(
    (state) => state.decreaseBaseFrequency,
  );
  const isIncreasingBaseFrequencyDisabled = usePitchStore((state) =>
    state.isIncreasingBaseFrequencyDisabled(),
  );
  const isDecreasingBaseFrequencyDisabled = usePitchStore((state) =>
    state.isDecreasingBaseFrequencyDisabled(),
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <Button
        isIconOnly
        variant="light"
        disabled={isDecreasingBaseFrequencyDisabled}
        onPress={decreaseBaseFrequency}
      >
        <Minus />
      </Button>
      <h6 className="font-bold select-none text-xl">
        {baseFrequency} <span className="text-sm">Hz</span>
      </h6>
      <Button
        isIconOnly
        variant="light"
        disabled={isIncreasingBaseFrequencyDisabled}
        onPress={increaseBaseFrequency}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default PitchFrequency;
