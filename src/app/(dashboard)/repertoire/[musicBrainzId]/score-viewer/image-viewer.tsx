import { Image } from "@heroui/image";

import EmblaCarouselStructure from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/embla-carousel-structure";
import NavigationButtons from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/navigation-buttons";
import { useCarouselViewer } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/use-carousel-viewer";

import type { FC } from "react";

const ImageViewer: FC<{
  imageUrls: string[];
}> = ({ imageUrls }) => {
  const {
    containerRef,
    emblaRef,
    emblaApi,
    slides,
    currentSlideIndex,
    itemDimensions,
    pagesToShow,
  } = useCarouselViewer(imageUrls.length);

  return (
    <div
      className="size-full relative overflow-hidden flex items-center justify-center"
      ref={containerRef}
    >
      <EmblaCarouselStructure emblaRef={emblaRef} slides={slides}>
        {(imageIndices) =>
          imageIndices.map((index) => (
            <div
              key={index}
              className="flex items-center justify-center h-full"
              style={{
                maxHeight: itemDimensions.height,
                maxWidth: itemDimensions.width,
              }}
            >
              <Image
                src={imageUrls[index]}
                alt={`Page ${index + 1}`}
                classNames={{
                  wrapper: "size-full",
                  img: "size-full object-contain rounded-none",
                }}
                style={{
                  maxHeight: itemDimensions.height,
                  maxWidth: itemDimensions.width,
                }}
              />
            </div>
          ))
        }
      </EmblaCarouselStructure>

      <NavigationButtons
        emblaApi={emblaApi}
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        pagesToShow={pagesToShow}
      />
    </div>
  );
};

export default ImageViewer;
