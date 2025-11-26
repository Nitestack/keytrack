"use client";

import type { FC, ReactNode } from "react";

const RENDER_WINDOW = 2; // Number of slides to render around current slide

const EmblaCarouselStructure: FC<{
  emblaRef: (node: HTMLElement | null) => void;
  slides: number[][];
  currentSlideIndex: number;
  children: (itemIndices: number[], isCloseToView: boolean) => ReactNode;
}> = ({ emblaRef, slides, currentSlideIndex, children }) => {
  return (
    <div
      className="embla size-full cursor-grab overflow-hidden active:cursor-grabbing"
      ref={emblaRef}
    >
      <div className="embla__container flex h-full">
        {slides.map((itemIndices, slideIndex) => {
          const isCloseToView =
            Math.abs(currentSlideIndex - slideIndex) < RENDER_WINDOW;

          return (
            <div
              className="embla__slide flex-[0_0_100%] min-w-0 flex items-center justify-center h-full"
              key={slideIndex}
            >
              <div className="flex items-center justify-center gap-0.5 size-full">
                {children(itemIndices, isCloseToView)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmblaCarouselStructure;
