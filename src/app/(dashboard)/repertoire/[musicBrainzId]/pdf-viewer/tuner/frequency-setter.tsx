"use client";

import { Button } from "@heroui/button";

import { Minus, Plus } from "lucide-react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerFrequencySetter: FC = () => {
  const baseFrequency = useTunerStore((state) => state.baseFrequency);
  const increaseBaseFrequency = useTunerStore(
    (state) => state.increaseBaseFrequency,
  );
  const decreaseBaseFrequency = useTunerStore(
    (state) => state.decreaseBaseFrequency,
  );
  const isIncreasingBaseFrequencyDisabled = useTunerStore((state) =>
    state.isIncreasingBaseFrequencyDisabled(),
  );
  const isDecreasingBaseFrequencyDisabled = useTunerStore((state) =>
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

export default TunerFrequencySetter;
