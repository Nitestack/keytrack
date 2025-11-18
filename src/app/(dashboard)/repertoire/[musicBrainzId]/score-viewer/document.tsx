"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "usehooks-ts";

import type { DocumentProps } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./document.scss";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { CircularProgress, Progress } from "@heroui/progress";
import { cn } from "@heroui/react";

import type { EmblaCarouselType } from "embla-carousel";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const assumedPageRatio = 210 / 297; // A4: 210mm x 297mm

export default function PdfViewerDocument({
  file,
}: {
  file: DocumentProps["file"];
}) {
  const [pageCount, setPageCount] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width = 0, height = 0 } = useResizeObserver({
    // @ts-expect-error wrong type definitions
    ref: containerRef,
  });

  const screenRatio = height > 0 ? width / height : 0;
  const showTwoPages = screenRatio > 1.2; // safe middle ground between portrait and landscape

  const slides = useMemo(() => {
    if (pageCount === 0) return [];

    const chunks: number[][] = [];
    const step = showTwoPages ? 2 : 1;

    for (let i = 1; i <= pageCount; i += step) {
      const chunk = [i];
      if (showTwoPages && i + 1 <= pageCount) {
        chunk.push(i + 1);
      }
      chunks.push(chunk);
    }
    return chunks;
  }, [pageCount, showTwoPages]);

  const pagesToShow = showTwoPages ? 2 : 1;
  const availableWidthPerPage = width / pagesToShow;

  const widthIfFullHeight = height * assumedPageRatio;
  const fitByHeight = widthIfFullHeight <= availableWidthPerPage;

  const pageProps = fitByHeight
    ? { height: height - 20 } // -20px margin
    : { width: availableWidthPerPage - 10 }; // min 2 (because of 2px gap)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setPageCount(numPages);
  }

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowRight" || e.key === " ") emblaApi.scrollNext();
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slides.length === 0) return;

    // TODO: This effect runs when 'slides' structure changes (e.g. rotate). Might track "lastViewedPageNumber" in a ref to calculate this more accurately.
    emblaApi.reInit();
  }, [slides, emblaApi]);

  return (
    <div
      className="size-full relative overflow-hidden flex items-center justify-center"
      ref={containerRef}
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="size-full"
        loading={
          <div className="flex items-center justify-center size-full">
            <Progress isIndeterminate size="sm" />
          </div>
        }
      >
        <div
          className="embla size-full cursor-grab overflow-hidden active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full">
            {slides.map((pageIds, index) => {
              const isCloseToView = Math.abs(currentSlideIndex - index) < 2;

              return (
                <div
                  className="embla__slide flex-[0_0_100%] min-w-0 flex items-center justify-center h-full"
                  key={`slide-${index}`}
                >
                  <div className="flex items-center justify-center gap-0.5 w-full">
                    {pageIds.map((pageNumber) => (
                      <div
                        key={pageNumber}
                        className="flex items-center justify-center bg-white shadow-2xl page-frame"
                        style={{
                          ...(pageProps.height
                            ? { height: pageProps.height }
                            : {}),
                          ...(pageProps.width
                            ? { width: pageProps.width }
                            : {}),
                          aspectRatio: assumedPageRatio,
                        }}
                      >
                        {isCloseToView && (
                          <Page
                            pageNumber={pageNumber}
                            {...pageProps}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={<CircularProgress size="lg" />}
                            error={
                              <Alert
                                className="light"
                                color="danger"
                                title={`Could not load page ${pageNumber}`}
                              />
                            }
                            noData={
                              <Alert
                                className="light"
                                color="warning"
                                title={`No data for page ${pageNumber}`}
                              />
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Document>
      <Button
        isIconOnly
        variant="flat"
        onPress={() => emblaApi?.scrollPrev()}
        className={cn(
          "absolute z-50 embla__prev left-4",
          pagesToShow === 1 ? "bottom-4" : "top-1/2 -translate-y-1/2",
        )}
        isDisabled={currentSlideIndex === 0}
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
        isDisabled={currentSlideIndex === slides.length - 1}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
