"use client";

import { Progress } from "@heroui/progress";

import { Mic, MicOff } from "lucide-react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/store";

import type { FC } from "react";

const TunerMicVolume: FC = () => {
  const volume = useTunerStore((state) => state.volume);
  const isListening = useTunerStore((state) => state.isListening);
  return (
    <div className="flex items-center gap-2 w-full">
      {volume > 1 ? (
        <Mic
          className={volume > 70 ? "text-danger" : "text-primary"}
          size={16}
        />
      ) : (
        <MicOff
          size={16}
          className={isListening ? "text-danger" : "text-default"}
        />
      )}
      <Progress
        size="sm"
        value={volume}
        className="flex-1"
        color={volume > 70 ? "danger" : volume > 30 ? "primary" : "default"}
      />
      <span className="min-w-8 text-right text-sm">{Math.round(volume)}%</span>
    </div>
  );
};

export default TunerMicVolume;
