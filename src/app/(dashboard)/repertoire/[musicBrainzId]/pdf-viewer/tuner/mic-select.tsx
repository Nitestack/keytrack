"use client";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";

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

  if (audioDevices.length > 1)
    return (
      <FormControl fullWidth>
        <InputLabel>Microphone</InputLabel>
        <Select
          label="Microphone"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={isListening}
          MenuProps={{
            container: fullScreenEl,
          }}
        >
          {audioDevices.map((d) => (
            <MenuItem key={d.deviceId} value={d.deviceId}>
              {d.label || d.deviceId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  else return null;
};

export default TunerMicSelect;
