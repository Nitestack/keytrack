"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";

import { Play, Square } from "lucide-react";

import MetronomeBeats from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/beats";
import MetronomeBpm from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/bpm";
import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";
import MetronomeTimeSignature from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/time-signature";
import { useMetronome } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/use-metronome";
import MetronomeVolume from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/volume";

import type { FC } from "react";

const Metronome: FC = () => {
  const isPlaying = useMetronomeStore((state) => state.isPlaying);
  const toggleIsPlaying = useMetronomeStore((state) => state.toggleIsPlaying);

  useMetronome();

  return (
    <Card className="min-w-72" shadow="none">
      <CardBody className="flex flex-col items-center gap-4">
        <MetronomeBpm />
        <MetronomeTimeSignature />
        <MetronomeBeats />
        <MetronomeVolume />
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

export default Metronome;
