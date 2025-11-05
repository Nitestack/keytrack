"use client";

import { Alert } from "@heroui/alert";
import { CircularProgress } from "@heroui/progress";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";

import type { EmblaCarouselType } from "embla-carousel";
import type { EmblaViewportRefType } from "embla-carousel-react";
import type { FC } from "react";
import type { DocumentProps } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/document.scss";

import { Button } from "@heroui/button";
import { cn } from "@heroui/react";

const PDF_ASPECT_RATIO = 1 / Math.sqrt(2);

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

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

  const calculatePageSize = useCallback(() => {
    if (!containerWidth || !containerHeight) {
      return { width: undefined, height: undefined };
    }

    const availableWidth = isMobile
      ? containerWidth
      : (containerWidth - 10) / 2; // 8px gap between pages + 1px border around each page
    const availableHeight = containerHeight - 2; // 1px border around the page

    if (availableWidth / PDF_ASPECT_RATIO <= availableHeight) {
      // Width is the limiting factor - use width constraint
      return { width: availableWidth, height: undefined };
    } else {
      // Height is the limiting factor - use height constraint
      return { width: undefined, height: availableHeight };
    }
  }, [containerWidth, containerHeight, isMobile]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const { width: pageWidth, height: pageHeight } = calculatePageSize();

  return (
    <div className="embla h-full relative">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <Document
          className={cn(
            "embla__container flex h-full items-center",
            isMobile ? "space-x-2" : "gap-2",
          )}
          file={file}
          loading={<CircularProgress size="lg" />}
          error={
            <Alert
              color="danger"
              title="Could not load the score. Please reload the site to try again."
            />
          }
          noData={
            <Alert
              color="warning"
              title="Invalid score URL. Please change the score URL to try again."
            />
          }
        >
          {({ pdf }) =>
            Array(pdf.numPages)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className={cn(
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
                    loading={<CircularProgress size="lg" />}
                    error={
                      <Alert
                        color="danger"
                        title={`Could not load this page ${index + 1}`}
                      />
                    }
                    noData={
                      <Alert
                        color="warning"
                        title={`No data for page ${index + 1}.`}
                      />
                    }
                  />
                </div>
              ))
          }
        </Document>
      </div>
      <Button
        isIconOnly
        variant="flat"
        onPress={scrollPrev}
        className={cn(
          "absolute z-50 embla__prev left-4",
          isMobile ? "bottom-4" : "top-1/2 -translate-y-1/2",
        )}
      >
        <ChevronLeft />
      </Button>
      <Button
        isIconOnly
        variant="flat"
        onPress={scrollNext}
        className={cn(
          "absolute z-50 embla__next right-4",
          isMobile ? "bottom-4" : "top-1/2 -translate-y-1/2",
        )}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PdfDocument;
