"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { EmblaCarouselType } from "embla-carousel";
import type { FC } from "react";

const NavigationButtons: FC<{
  emblaApi?: EmblaCarouselType;
  currentSlideIndex: number;
  totalSlides: number;
  pagesToShow: number;
}> = ({ emblaApi, currentSlideIndex, totalSlides, pagesToShow }) => {
  const canScrollPrev = currentSlideIndex > 0;
  const canScrollNext = currentSlideIndex < totalSlides - 1;
  return (
    <>
      <Button
        isIconOnly
        variant="flat"
        onPress={() => emblaApi?.scrollPrev()}
        className={cn(
          "absolute z-50 embla__prev left-4",
          pagesToShow === 1 ? "bottom-4" : "top-1/2 -translate-y-1/2",
        )}
        isDisabled={!canScrollPrev}
      >
        <ChevronLeft />
      </Button>
      <Button
        isIconOnly
        variant="flat"
        onPress={() => emblaApi?.scrollNext()}
        className={cn(
          "absolute z-50 embla__next right-4",
          pagesToShow === 1 ? "bottom-4" : "top-1/2 -translate-y-1/2",
        )}
        isDisabled={!canScrollNext}
      >
        <ChevronRight />
      </Button>
    </>
  );
};

export default NavigationButtons;
