"use client";

import { useEffect, useRef } from "react";

import { Context, Oscillator, setContext, start } from "tone";

import { usePitchStore } from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/pitch/store";

/**
 * An efficient pitch creator hook using a single, persistent Tone.js oscillator
 */
export default function usePitch() {
  const frequency = usePitchStore((state) => state.frequency);
  const volume = usePitchStore((state) => state.volume);
  const isPlaying = usePitchStore((state) => state.isPlaying);

  const oscillatorRef = useRef<Oscillator | null>(null);

  // Initialization: creates audio nodes and sets up audio graph
  useEffect(() => {
    function setupAudio() {
      // Set context with performance optimizations
      setContext(new Context({ latencyHint: "balanced" }));

      oscillatorRef.current = new Oscillator({
        type: "sine",
      }).toDestination();
    }

    setupAudio();

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.dispose();
      }
    };
  }, []);

  // Frequency control
  useEffect(() => {
    if (!oscillatorRef.current) return;

    oscillatorRef.current.frequency.value = frequency;
  }, [frequency]);

  // Volume control
  useEffect(() => {
    if (!oscillatorRef.current) return;

    // Calculate volume in decibels (Tone.js uses dB scale)
    // Convert 0-100 range to dB range (-Infinity to ~0dB)
    const volumeDb = volume === 0 ? -Infinity : 20 * Math.log10(volume / 100);

    oscillatorRef.current.volume.value = volumeDb;
  }, [volume]);

  // Play/pause control
  useEffect(() => {
    if (!oscillatorRef.current) return;

    if (isPlaying) void start().then(() => oscillatorRef.current?.start());
    else oscillatorRef.current.stop();
  }, [isPlaying]);
}
