"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";

import { Play, Square } from "lucide-react";

import PitchFrequency from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/frequency";
import PitchOctave from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/octave";
import PitchSelector from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/pitch";
import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/store";
import usePitch from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/use-pitch";
import PitchVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/pitch/volume";

import type { FC } from "react";

const Pitch: FC = () => {
  const isPlaying = usePitchStore((state) => state.isPlaying);
  const toggleIsPlaying = usePitchStore((state) => state.toggleIsPlaying);

  usePitch();

  return (
    <Card shadow="none">
      <CardBody className="flex flex-col items-center gap-4">
        <PitchSelector />
        <div className="grid grid-cols-2 gap-4 items-center justify-between w-full">
          <PitchOctave />
          <PitchFrequency />
        </div>
        <PitchVolume />
      </CardBody>
      <CardFooter>
        <Button
          fullWidth
          color={isPlaying ? "danger" : "primary"}
          onPress={toggleIsPlaying}
          startContent={isPlaying ? <Square size={16} /> : <Play size={16} />}
        >
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Pitch;
