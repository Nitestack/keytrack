"use client";

import { useEffect, useRef } from "react";

import {
  Context,
  getDraw,
  getTransport,
  Loop,
  setContext,
  start,
  Synth,
} from "tone";

import { useMetronomeStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/metronome/store";

const ACCENT_SYNTH_CONFIG: ConstructorParameters<typeof Synth>["0"] = {
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
};

const CLICK_SYNTH_CONFIG: ConstructorParameters<typeof Synth>["0"] = {
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 },
};

/**
 * Metronome hook for initializing and management using Tone.js
 */
export function useMetronome() {
  const maxBeat = useMetronomeStore((state) => state.maxBeat);
  const setBeat = useMetronomeStore((state) => state.setBeat);
  const bpm = useMetronomeStore((state) => state.bpm);
  const volume = useMetronomeStore((state) => state.volume);
  const isPlaying = useMetronomeStore((state) => state.isPlaying);

  const accentSynthRef = useRef<Synth | null>(null);
  const clickSynthRef = useRef<Synth | null>(null);

  const loop = useRef<Loop | null>(null);

  // Initialization: creates audio nodes and sets up audio graph
  useEffect(() => {
    function setupAudio() {
      // Set context with performance optimizations
      setContext(new Context({ latencyHint: "playback", lookAhead: 0.1 }));

      accentSynthRef.current = new Synth(ACCENT_SYNTH_CONFIG).toDestination();
      clickSynthRef.current = new Synth(CLICK_SYNTH_CONFIG).toDestination();
    }

    setupAudio();

    return () => {
      loop.current?.dispose();
      accentSynthRef.current?.dispose();
      clickSynthRef.current?.dispose();

      const transport = getTransport();

      if (transport.state !== "stopped") {
        transport.stop();
        transport.cancel(0);
      }
    };
  }, []);

  // BPM control
  useEffect(() => {
    getTransport().bpm.value = bpm;
  }, [bpm]);

  // Volume control
  useEffect(() => {
    if (!accentSynthRef.current || !clickSynthRef.current) return;

    // Calculate volume in decibels (Tone.js uses dB scale)
    // Convert 0-100 range to dB range (-Infinity to ~0dB)
    const volumeDb = volume === 0 ? -Infinity : 20 * Math.log10(volume / 100);

    accentSynthRef.current.volume.rampTo(volumeDb, 0.1);
    clickSynthRef.current.volume.rampTo(volumeDb, 0.1);
  }, [volume]);

  // Play/pause control (dependent on maxBeat)
  useEffect(() => {
    if (!accentSynthRef.current || !clickSynthRef.current) return;

    // Always dispose existing loop
    if (loop.current) {
      loop.current.dispose();
      loop.current = null;
    }

    setBeat(0);

    if (isPlaying) {
      getTransport().timeSignature = maxBeat;

      let currentBeat = 0;

      loop.current = new Loop((time) => {
        const beatNumber = (currentBeat % maxBeat) + 1;

        getDraw().schedule(() => {
          setBeat(beatNumber);
        }, time);

        // Play sound
        const isAccent = beatNumber === 1;
        const synth = isAccent ? accentSynthRef.current : clickSynthRef.current;
        const frequency = isAccent ? "C6" : "C5";
        synth?.triggerAttackRelease(frequency, "16n", time);

        currentBeat++;
      }, "4n").start(0);

      void start().then(() => getTransport().start());
    } else getTransport().pause();
  }, [isPlaying, maxBeat, setBeat]);
}
