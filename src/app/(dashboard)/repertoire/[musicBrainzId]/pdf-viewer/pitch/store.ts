"use client";

import { create } from "zustand";
import { createComputed } from "zustand-computed";

import {
  chromaticNotes,
  maxFrequency,
  minFrequency,
  noteToFrequency,
} from "~/services/music-theory";

import type { ChromaticNote } from "~/services/music-theory";

export const minOctave = 2;
export const maxOctave = 6;

/**
 * The pitch creator base store properties
 */
interface PitchStoreBaseProps {
  /**
   * The selected pitch to be played
   */
  selectedPitch: ChromaticNote;
  /**
   * Sets the pitch
   */
  setSelectedPitch: (newPitch: ChromaticNote) => void;
  /**
   * The octave the pitch should be played in
   */
  octave: number;
  /**
   * Increases the octave
   */
  increaseOctave: () => void;
  /**
   * Decreases the octave
   */
  decreaseOctave: () => void;
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
   * The current volume of the pitch (0-100)
   */
  volume: number;
  /**
   * Sets the volume
   * @param newVolume The new volume to set
   */
  setVolume: (newVolume: number) => void;
  /**
   * Whether the pitch is currently playing
   */
  isPlaying: boolean;
  /**
   * Toggles the playing state of the pitch
   */
  toggleIsPlaying: () => void;
}

/**
 * Computed properties for pitch creator store
 */
interface PitchStoreComputedProps {
  /**
   * Whether increasing the octave is disabled (if octave is at `maxOctave`)
   */
  isIncreasingOctaveDisabled: boolean;
  /**
   * Whether decreasing the octave is disabled (if octave is at `minOctave`)
   */
  isDecreasingOctaveDisabled: boolean;
  /**
   * Whether increasing the base frequency is disabled (if frequency is at `maxFrequency`)
   */
  isIncreasingBaseFrequencyDisabled: boolean;
  /**
   * Whether decreasing the base frequency is disabled (if frequency is at `minFrequency`)
   */
  isDecreasingBaseFrequencyDisabled: boolean;
  /**
   * The frequency based on the base frequency, octave and pitch
   */
  frequency: number;
}

/**
 * The pitch creator store properties
 */
export type PitchStoreProps = PitchStoreBaseProps & PitchStoreComputedProps;

const computedPitchStore = createComputed<
  PitchStoreBaseProps,
  PitchStoreComputedProps
>(
  (state) => ({
    isIncreasingOctaveDisabled: state.octave >= maxOctave,
    isDecreasingOctaveDisabled: state.octave <= minOctave,
    isIncreasingBaseFrequencyDisabled: state.baseFrequency >= maxFrequency,
    isDecreasingBaseFrequencyDisabled: state.baseFrequency <= minFrequency,
    frequency: noteToFrequency(
      state.selectedPitch,
      state.octave,
      state.baseFrequency,
    ),
  }),
  {
    keys: ["octave", "baseFrequency", "selectedPitch"],
  },
);

export const usePitchStore = create<PitchStoreBaseProps>()(
  computedPitchStore((set, get) => ({
    selectedPitch: "A",
    setSelectedPitch: (newPitch) => {
      if (chromaticNotes.includes(newPitch))
        set(() => ({
          selectedPitch: newPitch,
        }));
    },

    octave: 4,
    increaseOctave: () => {
      if (!get().isIncreasingOctaveDisabled)
        set((state) => ({
          octave: state.octave + 1,
        }));
    },
    decreaseOctave: () => {
      if (!get().isDecreasingOctaveDisabled)
        set((state) => ({
          octave: state.octave - 1,
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

    volume: 50,
    setVolume: (newVolume: number) => {
      if (0 <= newVolume && newVolume <= 100)
        set(() => ({
          volume: newVolume,
        }));
    },

    isPlaying: false,
    toggleIsPlaying: () =>
      set((state) => ({
        isPlaying: !state.isPlaying,
      })),
  })),
);
