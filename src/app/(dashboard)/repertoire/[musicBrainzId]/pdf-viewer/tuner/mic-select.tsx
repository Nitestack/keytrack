"use client";

import { Select, SelectItem } from "@heroui/select";

import { Mic } from "lucide-react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

import type { SharedSelection } from "@heroui/react";
import type { FC } from "react";

const TunerMicSelect: FC<{
  fullScreenEl?: Element;
}> = ({ fullScreenEl }) => {
  const audioDevices = useTunerStore((state) => state.audioDevices);
  const selectedDeviceId = useTunerStore((state) => state.selectedDeviceId);
  const setSelectedDeviceId = useTunerStore(
    (state) => state.setSelectedDeviceId,
  );
  const isListening = useTunerStore((state) => state.isListening);

  function handleSelectionChange(keys: SharedSelection) {
    const selectedKey =
      "values" in keys
        ? (keys.values().next().value as string | undefined)
        : undefined;
    if (selectedKey) setSelectedDeviceId(selectedKey);
  }

  if (audioDevices.length > 1)
    return (
      <Select
        fullWidth
        label="Microphone"
        selectedKeys={
          selectedDeviceId ? new Set([selectedDeviceId]) : undefined
        }
        onSelectionChange={handleSelectionChange}
        isDisabled={isListening}
        popoverProps={{
          portalContainer: fullScreenEl,
        }}
        items={audioDevices}
        startContent={<Mic size={16} />}
      >
        {(device) => (
          <SelectItem key={device.deviceId}>
            {device.label || device.deviceId}
          </SelectItem>
        )}
      </Select>
    );
  else return null;
};

export default TunerMicSelect;
