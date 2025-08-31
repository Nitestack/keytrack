"use client";

import { useCallback, useEffect } from "react";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

let audioContext: AudioContext | null = null;
let oscillatorNode: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

/**
 * Creates the audio context and the gain node
 */
function initializeAudioContext(initialVolume: number) {
  audioContext ??= new AudioContext();
  if (!gainNode) {
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    setVolume(initialVolume);
  }
}

/**
 * Sets the volume (from 0 to 1)
 */
function setVolume(newVolume: number) {
  if (gainNode && 0 <= newVolume && newVolume <= 1) {
    gainNode.gain.value = newVolume;
  }
}

/**
 * Plays the pitch sound
 * @param frequency The real frequency
 */
async function playPitch(frequency: number) {
  if (!audioContext || !gainNode) return;

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (oscillatorNode) {
    stopPitch();
  }

  oscillatorNode = audioContext.createOscillator();
  oscillatorNode.connect(gainNode);

  oscillatorNode.frequency.value = frequency;
  oscillatorNode.type = "sine";

  oscillatorNode.start();
}

/**
 * Updates frequency of currently playing oscillator
 */
function updateFrequency(newFrequency: number) {
  if (!oscillatorNode || !audioContext) return;

  oscillatorNode.frequency.setValueAtTime(
    newFrequency,
    audioContext.currentTime,
  );
}

/**
 * Stops the pitch sound
 */
function stopPitch() {
  if (!oscillatorNode) return;

  oscillatorNode.stop();
  oscillatorNode = null;
}

/**
 * Pitch creator hook for initializing and management
 */
export default function usePitch() {
  const frequency = usePitchStore((state) => state.frequency);
  const volume = usePitchStore((state) => state.volume);
  const isPlaying = usePitchStore((state) => state.isPlaying);
  const toggleIsPlaying = usePitchStore((state) => state.toggleIsPlaying);

  useEffect(() => {
    setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      if (oscillatorNode) {
        updateFrequency(frequency);
      } else {
        void playPitch(frequency);
      }
    } else {
      void stopPitch();
    }
  }, [isPlaying, frequency]);

  return useCallback(() => {
    if (!isPlaying) {
      initializeAudioContext(volume);
    }
    toggleIsPlaying();
  }, [isPlaying, volume]);
}
