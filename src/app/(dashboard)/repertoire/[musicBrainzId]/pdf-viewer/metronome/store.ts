"use client";

import { create } from "zustand";
import { createComputed } from "zustand-computed";

import type { NonFunction } from "~/utils/types";

export const minBpm = 30;
export const maxBpm = 280;

export const minNumerator = 2;
export const maxNumerator = 32;

export const minDenominatorExponent = 0; // 2^0 = 1
export const maxDenominatorExponent = 6; // 2^6 = 64

export const defaultValues: NonFunction<MetronomeStoreBaseProps> = {
  bpm: 100,
  numerator: 4,
  denominatorExponent: 2,
  beat: 0,
  volume: 50,
  isPlaying: false,
};

/**
 * The metronome base store properties
 */
interface MetronomeStoreBaseProps {
  /**
   * The beats per minute (speed) (beats `60/bpm` a second)
   * @example 120 // `60/120 = 1/2`, meaning beats twice a second
   */
  bpm: number;
  /**
   * Sets the beats per minute
   * @param newBpm The new bpm to set
   */
  setBpm: (newBpm: number) => void;
  /**
   * Increments the beats per minute by 1
   */
  increaseBpm: () => void;
  /**
   * Decrements the beats per minute by 1
   */
  decreaseBpm: () => void;
  /**
   * The numerator of the time signature
   */
  numerator: number;
  /**
   * Increments the numerator by 1
   */
  increaseNumerator: () => void;
  /**
   * Decrements the numerator by 1
   */
  decreaseNumerator: () => void;
  /**
   * The exponent of the denominator of the time signature (every denominator is a result of basis 2 to the power)
   * @example 2 // which is 4 (because `2^2 = 4`)
   */
  denominatorExponent: number;
  /**
   * Increments the exponent of the denominator by 1
   */
  increaseDenominator: () => void;
  /**
   * Decrements the exponent of the denominator by 1
   */
  decreaseDenominator: () => void;
  /**
   * The current beat the metronome is on. The initial beat is `0`, but the beat starts at `1`
   */
  beat: number;
  /**
   * Sets the beat
   */
  setBeat: (newBeat: number) => void;
  /**
   * The current volume of the metronome (0-100)
   */
  volume: number;
  /**
   * Sets the volume
   * @param newVolume The new volume to set
   */
  setVolume: (newVolume: number) => void;
  /**
   * Whether the metronome is currently playing
   */
  isPlaying: boolean;
  /**
   * Toggles the playing state of the metronome
   */
  toggleIsPlaying: () => void;
  /**
   * Resets the store
   */
  resetStore: () => void;
}

/**
 * Computed properties for the metronome store
 */
interface MetronomeStoreComputedProps {
  /**
   * The max beat depending on the numerator
   */
  maxBeat: number;
  /**
   * The denominator of the time signature (calculated from the exponent)
   */
  denominator: number;
  /**
   * Whether increasing the bpm is disabled (if bpm is at maxBpm)
   */
  isIncreasingBpmDisabled: boolean;
  /**
   * Whether decreasing the bpm is disabled (if bpm is at minBpm)
   */
  isDecreasingBpmDisabled: boolean;
  /**
   * Whether increasing the numerator is disabled (if numerator is at maxNumerator)
   */
  isIncreasingNumeratorDisabled: boolean;
  /**
   * Whether decreasing the numerator is disabled (if numerator is at minNumerator)
   */
  isDecreasingNumeratorDisabled: boolean;
  /**
   * Whether increasing the denominator is disabled (if denominator exponent is at maxDenominatorExponent)
   */
  isIncreasingDenominatorDisabled: boolean;
  /**
   * Whether decreasing the denominator is disabled (if denominator exponent is at minDenominatorExponent)
   */
  isDecreasingDenominatorDisabled: boolean;
}

/**
 * The metronome store properties
 */
export type MetronomeStoreProps = MetronomeStoreBaseProps &
  MetronomeStoreComputedProps;

const computedMetronomeStore = createComputed<
  MetronomeStoreBaseProps,
  MetronomeStoreComputedProps
>(
  (state) => ({
    maxBeat:
      state.numerator % 3 === 0 && state.numerator !== 3
        ? state.numerator / 3
        : state.numerator,
    denominator: Math.pow(2, state.denominatorExponent),
    isIncreasingBpmDisabled: state.bpm >= maxBpm,
    isDecreasingBpmDisabled: state.bpm <= minBpm,
    isIncreasingNumeratorDisabled: state.numerator >= maxNumerator,
    isDecreasingNumeratorDisabled: state.numerator <= minNumerator,
    isIncreasingDenominatorDisabled:
      state.denominatorExponent >= maxDenominatorExponent,
    isDecreasingDenominatorDisabled:
      state.denominatorExponent <= minDenominatorExponent,
  }),
  {
    keys: ["numerator", "denominatorExponent", "bpm"],
  },
);

export const useMetronomeStore = create<MetronomeStoreBaseProps>()(
  computedMetronomeStore((set, get) => ({
    ...defaultValues,
    setBpm: (newBpm: number) => {
      if (minBpm <= newBpm && newBpm <= maxBpm)
        set({
          bpm: newBpm,
        });
    },
    increaseBpm: () => {
      if (!get().isIncreasingBpmDisabled)
        set((state) => ({
          bpm: state.bpm + 1,
        }));
    },
    decreaseBpm: () => {
      if (!get().isDecreasingBpmDisabled)
        set((state) => ({
          bpm: state.bpm - 1,
        }));
    },
    increaseNumerator: () => {
      if (!get().isIncreasingNumeratorDisabled)
        set((state) => ({
          numerator: state.numerator + 1,
        }));
    },
    decreaseNumerator: () => {
      if (!get().isDecreasingNumeratorDisabled)
        set((state) => ({
          numerator: state.numerator - 1,
        }));
    },

    increaseDenominator: () => {
      if (!get().isIncreasingDenominatorDisabled)
        set((state) => ({
          denominatorExponent: state.denominatorExponent + 1,
        }));
    },
    decreaseDenominator: () => {
      if (!get().isDecreasingDenominatorDisabled)
        set((state) => ({
          denominatorExponent: state.denominatorExponent - 1,
        }));
    },

    setBeat: (newBeat) => {
      if (1 <= newBeat && newBeat <= get().maxBeat) {
        set({
          beat: newBeat,
        });
      }
    },

    setVolume: (newVolume: number) => {
      if (0 <= newVolume && newVolume <= 100)
        set({
          volume: newVolume,
        });
    },

    toggleIsPlaying: () =>
      set((state) => ({
        isPlaying: !state.isPlaying,
      })),

    resetStore: () => set(defaultValues),
  })),
);
