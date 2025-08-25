import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { Document, Page } from "react-pdf";

import type { EmblaCarouselType } from "embla-carousel";
import type { EmblaViewportRefType } from "embla-carousel-react";
import type { FC } from "react";
import type { DocumentProps } from "react-pdf";

const PDF_ASPECT_RATIO = 1 / Math.sqrt(2);

const PdfDocument: FC<
  Required<Pick<DocumentProps, "file">> & {
    emblaRef: EmblaViewportRefType;
    emblaApi: EmblaCarouselType | undefined;
    isMobile: boolean;
  }
> = ({ file, emblaRef, emblaApi, isMobile }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const container = emblaApi.containerNode().getBoundingClientRect();
      setContainerWidth(container.width);
      setContainerHeight(container.height);
    }
  }, [emblaApi]);

  // Calculate the optimal page dimensions
  const calculatePageSize = useCallback(() => {
    if (!containerWidth || !containerHeight) {
      return { width: undefined, height: undefined };
    }

    const availableWidth = isMobile ? containerWidth : (containerWidth - 8) / 2;
    const availableHeight = containerHeight;

    if (availableWidth / PDF_ASPECT_RATIO <= availableHeight) {
      // Width is the limiting factor - use width constraint
      return { width: availableWidth, height: undefined };
    } else {
      // Height is the limiting factor - use height constraint
      return { width: undefined, height: availableHeight };
    }
  }, [containerWidth, containerHeight, isMobile]);

  const { width: pageWidth, height: pageHeight } = calculatePageSize();

  return (
    <div className="embla h-full overflow-hidden" ref={emblaRef}>
      <Document
        className={clsx(
          "embla__container flex h-full items-center",
          isMobile ? "space-x-2" : "gap-2",
        )}
        file={file}
      >
        {({ pdf }) =>
          Array(pdf.numPages)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={clsx(
                  "embla__slide flex items-center h-full w-full",
                  !isMobile &&
                    index + 1 !== pdf.numPages && {
                      "flex-[0_0_50%]": true,
                      "justify-end": index % 2 === 0,
                      "justify-start": index % 2 !== 0,
                    },
                  {
                    "flex-[0_0_100%] justify-center":
                      isMobile || index + 1 === pdf.numPages,
                  },
                )}
              >
                <Page
                  className="shadow-md border border-gray-200"
                  pageIndex={index}
                  width={pageWidth}
                  height={pageHeight}
                />
              </div>
            ))
        }
      </Document>
    </div>
  );
};

export default PdfDocument;
