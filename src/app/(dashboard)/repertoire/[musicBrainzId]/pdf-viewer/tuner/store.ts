"use client";

import { create } from "zustand";
import { createComputed } from "zustand-computed";

import { chromaticPitches } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

export const minFrequency = 400;
export const maxFrequency = 480;

export const transposeKeys = [
  ...chromaticPitches.slice(1).map((pitch) => `-${pitch}`),
  ...chromaticPitches.map((pitch) => (pitch !== "C" ? `+${pitch}` : "C")),
];

/**
 * The tuner base store properties
 */
interface TunerStoreBaseProps {
  /**
   * The selected transpose key
   */
  selectedTransposeKey: string;
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
}

/**
 * The tuner store properties
 */
export type TunerStoreProps = TunerStoreBaseProps & TunerStoreComputedProps;

const computedTunerStore = createComputed<
  TunerStoreBaseProps,
  TunerStoreComputedProps
>((state) => ({
  isIncreasingTransposeKeyDisabled:
    transposeKeys.findIndex((pitch) => pitch === state.selectedTransposeKey) >=
    transposeKeys.length - 1,
  isDecreasingTransposeKeyDisabled:
    transposeKeys.findIndex((pitch) => pitch === state.selectedTransposeKey) <=
    0,
  isIncreasingBaseFrequencyDisabled: state.baseFrequency >= maxFrequency,
  isDecreasingBaseFrequencyDisabled: state.baseFrequency <= minFrequency,
}));

export const useTunerStore = create<TunerStoreBaseProps>()(
  computedTunerStore((set, get) => ({
    selectedTransposeKey: "C",
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

    baseFrequency: 440,
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

    isListening: false,
    toggleIsListening: () =>
      set((state) => ({
        isListening: !state.isListening,
      })),
  })),
);
