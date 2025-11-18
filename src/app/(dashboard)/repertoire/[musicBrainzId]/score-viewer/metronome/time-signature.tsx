"use client";

import { Button } from "@heroui/button";

import { Minus, Plus } from "lucide-react";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/metronome/store";

import type { FC } from "react";

const MetronomeTimeSignature: FC = () => {
  const num = useMetronomeStore((state) => state.numerator);
  const increaseNum = useMetronomeStore((state) => state.increaseNumerator);
  const decreaseNum = useMetronomeStore((state) => state.decreaseNumerator);
  const isIncreasingNumDisabled = useMetronomeStore((state) =>
    state.isIncreasingNumeratorDisabled(),
  );
  const isDecreasingNumDisabled = useMetronomeStore((state) =>
    state.isDecreasingNumeratorDisabled(),
  );
  const denom = useMetronomeStore((state) => state.denominator());
  const increaseDenom = useMetronomeStore((state) => state.increaseDenominator);
  const decreaseDenom = useMetronomeStore((state) => state.decreaseDenominator);
  const isIncreasingDenomDisabled = useMetronomeStore((state) =>
    state.isIncreasingDenominatorDisabled(),
  );
  const isDecreasingDenomDisabled = useMetronomeStore((state) =>
    state.isDecreasingDenominatorDisabled(),
  );

  return (
    <div className="flex justify-center">
      <div className="flex items-center select-none">
        <div className="flex flex-col">
          <Button
            isIconOnly
            variant="light"
            isDisabled={isDecreasingNumDisabled}
            onPress={decreaseNum}
          >
            <Minus />
          </Button>
          <h4 className="text-center font-bold text-3xl">{num}</h4>
          <Button
            isIconOnly
            variant="light"
            isDisabled={isIncreasingNumDisabled}
            onPress={increaseNum}
          >
            <Plus />
          </Button>
        </div>
        <h4 className="text-3xl">/</h4>
        <div className="flex flex-col">
          <Button
            isIconOnly
            variant="light"
            isDisabled={isDecreasingDenomDisabled}
            onPress={decreaseDenom}
          >
            <Minus />
          </Button>
          <h4 className="text-center font-bold text-3xl">{denom}</h4>
          <Button
            isIconOnly
            variant="light"
            isDisabled={isIncreasingDenomDisabled}
            onPress={increaseDenom}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetronomeTimeSignature;
