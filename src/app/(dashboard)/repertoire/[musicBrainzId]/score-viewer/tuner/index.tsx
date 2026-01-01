"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";

import { Play, Square } from "lucide-react";

import TunerFrequencyDisplay from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/frequency-display";
import TunerFrequencySetter from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/frequency-setter";
import TunerMicSelect from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/mic-select";
import TunerMicVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/mic-volume";
import TunerNeedle from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/needle";
import TunerNoteDisplay from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/note-display";
import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/store";
import TunerTranspose from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/transpose";
import TunerStatus from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/tuning-status";
import { useTuner } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/use-tuner";

import type { FC } from "react";

const Tuner: FC = () => {
  const isListening = useTunerStore((state) => state.isListening);

  const { error, handleToggleListening } = useTuner();

  return (
    <Card shadow="none">
      <CardBody className="flex flex-col items-center gap-4 select-none">
        {error && <Alert color="danger" title={error.message} />}
        <TunerMicSelect />
        <TunerNoteDisplay />
        <TunerNeedle />
        <TunerFrequencyDisplay />
        <TunerMicVolume />
        <TunerStatus />
        <div className="grid grid-cols-2 gap-2 items-center justify-between w-full min-w-82">
          <TunerTranspose />
          <TunerFrequencySetter />
        </div>
      </CardBody>
      <CardFooter>
        <Button
          fullWidth
          color={isListening ? "danger" : "primary"}
          onPress={handleToggleListening}
          startContent={isListening ? <Square size={16} /> : <Play size={16} />}
        >
          {isListening ? "Stop" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Tuner;
