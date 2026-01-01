"use client";

import { createContext, useContext, useRef } from "react";

import type { ForwardedRef, ReactNode } from "react";
import type { FullscreenRef, ThumbnailsRef } from "yet-another-react-lightbox";

interface ScoreViewerContextType {
  fullscreenRef: ForwardedRef<FullscreenRef>;
  thumbnailsRef: ForwardedRef<ThumbnailsRef>;
  toggleFullscreen: () => void;
  toggleThumbnails: () => void;
}

const ScoreViewerContext = createContext<ScoreViewerContextType | null>(null);

export const ScoreViewerProvider = ({ children }: { children: ReactNode }) => {
  const fullscreenRef = useRef<FullscreenRef>(null);
  const thumbnailsRef = useRef<ThumbnailsRef>(null);

  function toggleFullscreen() {
    const api = fullscreenRef.current;
    if (!api) return;

    if (api.fullscreen) api.exit();
    else api.enter();
  }

  function toggleThumbnails() {
    const api = thumbnailsRef.current;
    if (!api) return;

    if (api.visible) api.hide();
    else api.show();
  }

  return (
    <ScoreViewerContext.Provider
      value={{
        fullscreenRef,
        thumbnailsRef,
        toggleFullscreen,
        toggleThumbnails,
      }}
    >
      {children}
    </ScoreViewerContext.Provider>
  );
};

export const useScoreViewerControls = () => {
  const context = useContext(ScoreViewerContext);
  if (!context)
    throw new Error("useScoreControls must be used within a ScoreProvider");
  return context;
};
