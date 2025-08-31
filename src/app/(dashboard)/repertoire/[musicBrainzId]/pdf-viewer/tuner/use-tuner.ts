"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PitchDetector } from "pitchy";
import { Analyser, getContext, Meter, start, UserMedia } from "tone";

import { useTunerStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/tuner/store";
import {
  frequencyToNote,
  getSemitonesByTransposeKey,
} from "~/services/music-theory";

const ANALYZER_FFT_SIZE = 4096;
const CLARITY_THRESHOLD = 0.96; // (0 to 1) Higher is more selective
const STABILITY_THRESHOLD = 5; // Number of consecutive frames to confirm a note
const MIN_VOLUME_DB = -60;
const MAX_VOLUME_DB = -10;

interface TunerError {
  type: "permission" | "device" | "unknown";
  message: string;
}

function detectPitch(
  audioData: Float32Array,
  sampleRate: number,
  detector: PitchDetector<Float32Array>,
): { pitch: number; clarity: number } {
  let rms = 0;
  for (const audioDataElement of audioData) {
    rms += Math.pow(audioDataElement, 2);
  }
  rms = Math.sqrt(rms / audioData.length);
  if (rms < 0.005) return { pitch: 0, clarity: 0 };

  const [pitch, clarity] = detector.findPitch(audioData, sampleRate);
  if (pitch === -1 || !isFinite(pitch) || pitch <= 0) {
    return { pitch: 0, clarity: 0 };
  }
  return { pitch, clarity };
}

/**
 * A tuner powered by pitchy and tone.js
 */
export function useTuner() {
  const isListening = useTunerStore((state) => state.isListening);
  const toggleIsListening = useTunerStore((state) => state.toggleIsListening);
  const baseFrequency = useTunerStore((state) => state.baseFrequency);
  const selectedTransposeKey = useTunerStore(
    (state) => state.selectedTransposeKey,
  );
  const setDetectedNote = useTunerStore((state) => state.setDetectedNote);
  const setVolume = useTunerStore((state) => state.setVolume);
  const setAudioDevices = useTunerStore((state) => state.setAudioDevices);
  const selectedDeviceId = useTunerStore((state) => state.selectedDeviceId);
  const setSelectedDeviceId = useTunerStore(
    (state) => state.setSelectedDeviceId,
  );

  const [error, setError] = useState<TunerError | null>(null);

  const userMediaRef = useRef<UserMedia | null>(null);
  const analyserRef = useRef<Analyser | null>(null);
  const meterRef = useRef<Meter | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pitchDetectorRef = useRef<PitchDetector<Float32Array> | null>(null);

  const lastNoteRef = useRef<string | null>(null);
  const stableNoteCounterRef = useRef<number>(0);

  const stopTuner = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    userMediaRef.current?.close();
    userMediaRef.current?.dispose();
    analyserRef.current?.dispose();
    meterRef.current?.dispose();
    userMediaRef.current = null;
    analyserRef.current = null;
    meterRef.current = null;
    pitchDetectorRef.current = null;
    setDetectedNote(undefined);
    setVolume(0);
  }, []);

  const startTuner = useCallback(async () => {
    stopTuner();
    setError(null);

    try {
      userMediaRef.current ??= new UserMedia();
      await userMediaRef.current.open(selectedDeviceId);

      const meter = new Meter();
      meterRef.current = meter;

      const analyser = new Analyser("waveform", ANALYZER_FFT_SIZE);
      analyserRef.current = analyser;

      const detector = PitchDetector.forFloat32Array(analyser.size);
      pitchDetectorRef.current = detector;

      userMediaRef.current.connect(meter);
      userMediaRef.current.connect(analyser);

      const transposeOffset = getSemitonesByTransposeKey(selectedTransposeKey);

      const updatePitch = () => {
        if (
          !analyserRef.current ||
          !meterRef.current ||
          !pitchDetectorRef.current
        )
          return;

        const db = meterRef.current.getValue() as number;
        const volumeLevel = Math.min(
          100,
          Math.max(
            0,
            ((db - MIN_VOLUME_DB) / (MAX_VOLUME_DB - MIN_VOLUME_DB)) * 100,
          ),
        );
        setVolume(isFinite(volumeLevel) ? volumeLevel : 0);

        const dataArray = analyserRef.current.getValue();
        if (!(dataArray instanceof Float32Array)) {
          animationFrameRef.current = requestAnimationFrame(updatePitch);
          return;
        }

        const pitchResult = detectPitch(
          dataArray,
          getContext().sampleRate,
          pitchDetectorRef.current,
        );

        if (pitchResult.pitch > 0 && pitchResult.clarity > CLARITY_THRESHOLD) {
          const transposedFreq =
            pitchResult.pitch * Math.pow(2, transposeOffset / 12);
          const noteInfo = frequencyToNote(transposedFreq, baseFrequency);

          if (noteInfo && noteInfo.octave >= 0 && noteInfo.octave <= 8) {
            const noteName = `${noteInfo.note}${noteInfo.octave}`;
            if (noteName === lastNoteRef.current) {
              stableNoteCounterRef.current++;
            } else {
              lastNoteRef.current = noteName;
              stableNoteCounterRef.current = 1;
            }
            if (stableNoteCounterRef.current >= STABILITY_THRESHOLD) {
              setDetectedNote(noteInfo);
            }
          }
        } else {
          if (stableNoteCounterRef.current > 0) {
            stableNoteCounterRef.current--;
          } else {
            lastNoteRef.current = null;
          }
        }
        animationFrameRef.current = requestAnimationFrame(updatePitch);
      };
      updatePitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
          case "PermissionDeniedError":
            setError({
              type: "permission",
              message:
                "Microphone access was denied. Please allow access in your browser settings and refresh the page.",
            });
            break;
          case "NotFoundError":
            setError({
              type: "device",
              message:
                "No microphone found. Please connect a microphone and try again.",
            });
            break;
          case "NotReadableError":
            setError({
              type: "device",
              message:
                "Microphone is being used by another application. Please close other applications and try again.",
            });
            break;
          default:
            setError({
              type: "unknown",
              message:
                "Could not access the microphone. Please ensure it's not being used by another application.",
            });
        }
      } else {
        setError({
          type: "unknown",
          message:
            "An unexpected error occurred while accessing the microphone.",
        });
      }
    }
  }, [selectedDeviceId, baseFrequency, selectedTransposeKey]);

  useEffect(() => {
    if (isListening) {
      void startTuner();
    } else {
      stopTuner();
    }
  }, [isListening, startTuner]);

  // Get available audio input devices
  useEffect(() => {
    userMediaRef.current ??= new UserMedia();

    void userMediaRef.current.open().then(async () => {
      const devices = await navigator.mediaDevices?.enumerateDevices();
      const audioInputDevices = devices.filter((d) => d.kind === "audioinput");
      setAudioDevices(audioInputDevices);
      if (audioInputDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioInputDevices[0]!.deviceId);
      }
    });
  }, []);

  async function handleToggleListening() {
    if (getContext().state !== "running") {
      try {
        await start();
      } catch (e) {
        console.error("Error starting AudioContext:", e);
        setError({
          type: "unknown",
          message: "Could not initialize audio. Please try again.",
        });
        return;
      }
    }
    toggleIsListening();
  }

  return {
    error,
    setSelectedDeviceId,
    handleToggleListening,
  };
}
