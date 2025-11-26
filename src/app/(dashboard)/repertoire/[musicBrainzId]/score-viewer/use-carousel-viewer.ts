"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { useResizeObserver } from "usehooks-ts";

import type { EmblaCarouselType } from "embla-carousel";

const ASSUMED_PAGE_RATIO = 210 / 297;

export function useCarouselViewer(itemCount: number) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center" });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width = 0, height = 0 } = useResizeObserver({
    // @ts-expect-error wrong type definitions
    ref: containerRef,
  });

  const screenRatio = height > 0 ? width / height : 0;
  const showTwoPages = screenRatio > 1.2; // safe middle ground between portrait and landscape

  const slides = useMemo(() => {
    if (itemCount === 0) return [];

    const chunks: number[][] = [];
    const step = showTwoPages ? 2 : 1;

    for (let i = 0; i < itemCount; i += step) {
      const chunk = [i];
      if (showTwoPages && i + 1 < itemCount) {
        chunk.push(i + 1);
      }
      chunks.push(chunk);
    }
    return chunks;
  }, [itemCount, showTwoPages]);

  const pagesToShow = showTwoPages ? 2 : 1;
  const availableWidthPerPage = width / pagesToShow;

  const widthIfFullHeight = height * ASSUMED_PAGE_RATIO;
  const fitByHeight = widthIfFullHeight <= availableWidthPerPage;

  const itemDimensions = {
    height: fitByHeight ? height - 20 : undefined, // -20px margin
    width: !fitByHeight ? availableWidthPerPage - 10 : undefined, // min 2 (because of 2px gap)
  };

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCurrentSlideIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        emblaApi.scrollNext();
      } else if (e.key === "ArrowRight") {
        emblaApi.scrollNext();
      } else if (e.key === "ArrowLeft") {
        emblaApi.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slides.length === 0) return;

    // TODO: This effect runs when 'slides' structure changes (e.g. rotate). Might track "lastViewedPageNumber" in a ref to calculate this more accurately.
    emblaApi.reInit();
  }, [slides, emblaApi]);

  return {
    containerRef,
    emblaRef,
    emblaApi,
    slides,
    currentSlideIndex,
    pagesToShow,
    itemDimensions,
  };
}
