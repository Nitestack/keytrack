"use client";

import { memo } from "react";

import type { FC, ReactNode } from "react";

const Slide = memo(function Slide({
  itemIndices,
  children,
}: {
  itemIndices: number[];
  children: (itemIndices: number[]) => ReactNode;
}) {
  return (
    <div className="embla__slide flex-[0_0_100%] min-w-0 flex items-center justify-center h-full">
      <div className="flex items-center justify-center gap-0.5 size-full">
        {children(itemIndices)}
      </div>
    </div>
  );
});

const EmblaCarouselStructure: FC<{
  emblaRef: (node: HTMLElement | null) => void;
  slides: number[][];
  children: (itemIndices: number[]) => ReactNode;
}> = ({ emblaRef, slides, children }) => {
  return (
    <div
      className="embla size-full cursor-grab overflow-hidden active:cursor-grabbing"
      ref={emblaRef}
    >
      <div className="embla__container flex h-full">
        {slides.map((itemIndices, slideIndex) => (
          <Slide key={slideIndex} itemIndices={itemIndices}>
            {children}
          </Slide>
        ))}
      </div>
    </div>
  );
};

export default EmblaCarouselStructure;
