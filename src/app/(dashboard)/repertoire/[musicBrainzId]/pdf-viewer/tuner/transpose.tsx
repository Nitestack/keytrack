"use client";

import { Button } from "@heroui/button";

import { Minus, Plus } from "lucide-react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { FC } from "react";

const TunerTranspose: FC = () => {
  const selectedTransposeKey = useTunerStore(
    (state) => state.selectedTransposeKey,
  );
  const increaseTransposeKey = useTunerStore(
    (state) => state.increaseTransposeKey,
  );
  const decreaseTransposeKey = useTunerStore(
    (state) => state.decreaseTransposeKey,
  );
  const isIncreasingTransposeKeyDisabled = useTunerStore((state) =>
    state.isIncreasingTransposeKeyDisabled(),
  );
  const isDecreasingTransposeKeyDisabled = useTunerStore((state) =>
    state.isDecreasingTransposeKeyDisabled(),
  );

  return (
    <div className="flex justify-between items-center gap-1">
      <Button
        isIconOnly
        variant="light"
        disabled={isDecreasingTransposeKeyDisabled}
        onPress={decreaseTransposeKey}
      >
        <Minus />
      </Button>
      <h6 className="select-none font-bold text-xl">{selectedTransposeKey}</h6>
      <Button
        isIconOnly
        variant="light"
        disabled={isIncreasingTransposeKeyDisabled}
        onPress={increaseTransposeKey}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default TunerTranspose;
