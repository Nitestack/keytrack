"use client";

import { Select, SelectItem } from "@heroui/select";

import { Mic } from "lucide-react";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tuner/store";
import { useLightboxPortalTarget } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/use-lightbox-portal";

import type { SharedSelection } from "@heroui/react";
import type { FC } from "react";

const TunerMicSelect: FC = () => {
  const audioDevices = useTunerStore((state) => state.audioDevices);
  const selectedDeviceId = useTunerStore((state) => state.selectedDeviceId);
  const setSelectedDeviceId = useTunerStore(
    (state) => state.setSelectedDeviceId,
  );
  const isListening = useTunerStore((state) => state.isListening);

  const portalContainer = useLightboxPortalTarget();

  function handleSelectionChange(keys: SharedSelection) {
    const selectedKey =
      "values" in keys
        ? (keys.values().next().value as string | undefined)
        : undefined;
    if (selectedKey) setSelectedDeviceId(selectedKey);
  }

  return audioDevices.length > 1 ? (
    <Select
      fullWidth
      label="Microphone"
      selectedKeys={selectedDeviceId ? new Set([selectedDeviceId]) : undefined}
      onSelectionChange={handleSelectionChange}
      isDisabled={isListening}
      popoverProps={{
        portalContainer,
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
  ) : null;
};

export default TunerMicSelect;
