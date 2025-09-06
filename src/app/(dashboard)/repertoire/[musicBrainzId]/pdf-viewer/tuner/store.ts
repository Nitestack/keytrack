"use client";

import { create } from "zustand";
import { createComputed } from "zustand-computed";

import {
  maxFrequency,
  minFrequency,
  transposeKeys,
} from "~/services/music-theory";

import type { NoteInfo, TransposeKey } from "~/services/music-theory";
import type { NonFunction } from "~/utils/types";

const IN_TUNE_THRESHOLD_CENTS = 5; // +/- cents to be considered "in tune"
const CLOSE_THRESHOLD_CENTS = 10; // +/- cents to be considered "close"

const defaultValues: NonFunction<TunerStoreBaseProps> = {
  selectedTransposeKey: "C",
  baseFrequency: 440,
  volume: 0,
  selectedDeviceId: undefined,
  audioDevices: [],
  detectedNote: undefined,
  isListening: false,
};

type TuningStatus = {
  text: string;
  color: "success" | "warning" | "error";
  cents: number;
};

/**
 * The tuner base store properties
 */
interface TunerStoreBaseProps {
  /**
   * The selected transpose key
   */
  selectedTransposeKey: TransposeKey;
  /**
   * Selects the next available transpose key
   */
  increaseTransposeKey: () => void;
  /**
   * Selects the previous available transpose key
   */
  decreaseTransposeKey: () => void;
  /**
   * The base frequency (A4) in Hz
   */
  baseFrequency: number;
  /**
   * Increases the base frequency
   */
  increaseBaseFrequency: () => void;
  /**
   * Decreases the base frequency
   */
  decreaseBaseFrequency: () => void;
  /**
   * Whether the tuner is currently listening
   */
  isListening: boolean;
  /**
   * Toggles the listening state of the tuner
   */
  toggleIsListening: () => void;
  /**
   * Information about the detected note
   */
  detectedNote?: NoteInfo;
  /**
   * Sets detected note
   */
  setDetectedNote: (newNote?: NoteInfo) => void;
  /**
   * The volume of the microphone input (0 to 100)
   */
  volume: number;
  /**
   * Sets the volume of the microphone input (0 to 100)
   */
  setVolume: (newVolume: number) => void;
  /**
   * The id of the selected input device
   */
  selectedDeviceId?: string;
  /**
   * Sets the id of the selected input device
   */
  setSelectedDeviceId: (newDeviceId?: string) => void;
  /**
   * All available input devices
   */
  audioDevices: MediaDeviceInfo[];
  /**
   * Sets the available audio input devices
   */
  setAudioDevices: (audioDevices: MediaDeviceInfo[]) => void;
  /**
   * Resets the store
   */
  resetStore: () => void;
}

/**
 * Computed properties for tuner store
 */
interface TunerStoreComputedProps {
  /**
   * Whether increasing the transpose key is disabled
   */
  isIncreasingTransposeKeyDisabled: boolean;
  /**
   * Whether decreasing the octave is disabled
   */
  isDecreasingTransposeKeyDisabled: boolean;
  /**
   * Whether increasing the base frequency is disabled (if frequency is at `maxFrequency`)
   */
  isIncreasingBaseFrequencyDisabled: boolean;
  /**
   * Whether decreasing the base frequency is disabled (if frequency is at `minFrequency`)
   */
  isDecreasingBaseFrequencyDisabled: boolean;
  /**
   * Current status of the tuner (in tune, close, sharp or flat)
   */
  tuningStatus?: TuningStatus;
}

/**
 * The tuner store properties
 */
export type TunerStoreProps = TunerStoreBaseProps & TunerStoreComputedProps;

const computedTunerStore = createComputed<
  TunerStoreBaseProps,
  TunerStoreComputedProps
>(
  (state) => ({
    isIncreasingTransposeKeyDisabled:
      transposeKeys.findIndex(
        (pitch) => pitch === state.selectedTransposeKey,
      ) >=
      transposeKeys.length - 1,
    isDecreasingTransposeKeyDisabled:
      transposeKeys.findIndex(
        (pitch) => pitch === state.selectedTransposeKey,
      ) <= 0,
    isIncreasingBaseFrequencyDisabled: state.baseFrequency >= maxFrequency,
    isDecreasingBaseFrequencyDisabled: state.baseFrequency <= minFrequency,
    tuningStatus: (() => {
      if (!state.detectedNote) return undefined;
      const { cents } = state.detectedNote;
      if (Math.abs(cents) <= IN_TUNE_THRESHOLD_CENTS)
        return {
          text: "In Tune",
          color: "success",
          cents,
        } satisfies TuningStatus;
      if (Math.abs(cents) <= CLOSE_THRESHOLD_CENTS)
        return {
          text: "Close",
          color: "warning",
          cents,
        } satisfies TuningStatus;
      return {
        text: cents > 0 ? "Too Sharp" : "Too Flat",
        color: "error",
        cents,
      } satisfies TuningStatus;
    })() as TuningStatus | undefined,
  }),
  {
    keys: ["selectedTransposeKey", "baseFrequency", "detectedNote"],
  },
);

export const useTunerStore = create<TunerStoreBaseProps>()(
  computedTunerStore((set, get) => ({
    ...defaultValues,
    increaseTransposeKey: () => {
      if (!get().isIncreasingTransposeKeyDisabled)
        set((state) => ({
          selectedTransposeKey:
            transposeKeys[
              transposeKeys.findIndex(
                (pitch) => pitch === state.selectedTransposeKey,
              ) + 1
            ],
        }));
    },
    decreaseTransposeKey: () => {
      if (!get().isDecreasingTransposeKeyDisabled)
        set((state) => ({
          selectedTransposeKey:
            transposeKeys[
              transposeKeys.findIndex(
                (pitch) => pitch === state.selectedTransposeKey,
              ) - 1
            ],
        }));
    },

    increaseBaseFrequency: () => {
      if (!get().isIncreasingBaseFrequencyDisabled)
        set((state) => ({
          baseFrequency: state.baseFrequency + 1,
        }));
    },
    decreaseBaseFrequency: () => {
      if (!get().isDecreasingBaseFrequencyDisabled)
        set((state) => ({
          baseFrequency: state.baseFrequency - 1,
        }));
    },

    toggleIsListening: () =>
      set((state) => ({
        isListening: !state.isListening,
      })),

    setDetectedNote: (newNote?: NoteInfo) =>
      set({
        detectedNote: newNote,
      }),

    setVolume: (newVolume: number) => {
      if (0 <= newVolume && newVolume <= 100) set({ volume: newVolume });
    },

    setSelectedDeviceId: (newDeviceId) =>
      set({
        selectedDeviceId: newDeviceId,
      }),

    setAudioDevices: (audioDevices) =>
      set({
        audioDevices,
      }),

    resetStore: () => set(defaultValues),
  })),
);
