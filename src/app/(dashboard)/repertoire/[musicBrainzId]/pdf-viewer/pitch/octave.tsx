"use client";

import { Button } from "@heroui/button";

import { Minus, Plus } from "lucide-react";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

import type { FC } from "react";

const PitchOctave: FC = () => {
  const octave = usePitchStore((state) => state.octave);
  const increaseOctave = usePitchStore((state) => state.increaseOctave);
  const decreaseOctave = usePitchStore((state) => state.decreaseOctave);
  const isIncreasingOctaveDisabled = usePitchStore((state) =>
    state.isIncreasingOctaveDisabled(),
  );
  const isDecreasingOctaveDisabled = usePitchStore((state) =>
    state.isDecreasingOctaveDisabled(),
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <Button
        isIconOnly
        variant="light"
        disabled={isDecreasingOctaveDisabled}
        onPress={decreaseOctave}
      >
        <Minus />
      </Button>
      <h6 className="select-none font-bold text-xl">{octave}</h6>
      <Button
        isIconOnly
        variant="light"
        disabled={isIncreasingOctaveDisabled}
        onPress={increaseOctave}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default PitchOctave;
