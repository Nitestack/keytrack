"use client";

import { useCallback, useEffect } from "react";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
let accentBuffer: AudioBuffer | null = null;
let clickBuffer: AudioBuffer | null = null;

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
  accentBuffer ??= generateClickSound(1200, 0.15);
  clickBuffer ??= generateClickSound(800, 0.1);
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
 * Generates a sharp click sound with quick decay
 * @param frequency The frequency in Hz
 * @param duration The duration
 */
function generateClickSound(frequency: number, duration: number): AudioBuffer {
  if (!audioContext)
    throw new Error("Please initialize the audio context first.");

  const sampleRate = audioContext.sampleRate;
  const samples = Math.floor(sampleRate * duration);
  const buffer = audioContext.createBuffer(1, samples, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 30);
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
  }

  return buffer;
}

/**
 * Plays the tick sound
 * @param isAccent Whether the tick is an accent tick
 */
async function playTick(isAccent = false) {
  if (!audioContext || !gainNode) return;

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const buffer = isAccent ? accentBuffer : clickBuffer;
  if (!buffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  source.start();
}

/**
 * Metronome hook for initializing and management
 */
export function useMetronome() {
  const beat = useMetronomeStore((state) => state.beat);
  const volume = useMetronomeStore((state) => state.volume);
  const isPlaying = useMetronomeStore((state) => state.isPlaying);
  const toggleIsPlaying = useMetronomeStore((state) => state.toggleIsPlaying);

  useEffect(() => {
    setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    if (isPlaying && beat !== 0) {
      void playTick(beat === 1);
    }
  }, [isPlaying, beat]);

  return useCallback(() => {
    if (!isPlaying) {
      initializeAudioContext(volume);
    }
    toggleIsPlaying();
  }, [isPlaying, volume]);
}

/**
 * Metronome hook for setting the current beat
 */
export function useMetronomeBeat() {
  const bpm = useMetronomeStore((state) => state.bpm);
  const isPlaying = useMetronomeStore((state) => state.isPlaying);
  const resetBeat = useMetronomeStore((state) => state.resetBeat);
  const loopBeat = useMetronomeStore((state) => state.loopBeat);

  useEffect(() => {
    resetBeat();

    if (isPlaying) {
      const intervalId = setInterval(loopBeat, (60 / bpm) * 1000);
      loopBeat();

      return () => clearInterval(intervalId);
    }
  }, [isPlaying, bpm]);
}
