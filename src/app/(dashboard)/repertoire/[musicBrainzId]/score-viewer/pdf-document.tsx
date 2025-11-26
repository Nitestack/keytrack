"use client";

import { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";

import type { DocumentProps } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./pdf-document.scss";

import { Alert } from "@heroui/alert";
import { CircularProgress, Progress } from "@heroui/progress";

import EmblaCarouselStructure from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/embla-carousel-structure";
import NavigationButtons from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/navigation-buttons";
import { useCarouselViewer } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/use-carousel-viewer";

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
  const {
    containerRef,
    emblaRef,
    emblaApi,
    slides,
    currentSlideIndex,
    itemDimensions,
    pagesToShow,
  } = useCarouselViewer(pageCount);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setPageCount(numPages);
  }

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
        <EmblaCarouselStructure
          emblaRef={emblaRef}
          slides={slides}
          currentSlideIndex={currentSlideIndex}
        >
          {(pageIds, isCloseToView) =>
            pageIds.map((pageIndex) => (
              <div
                key={pageIndex + 1}
                className="flex items-center justify-center bg-white shadow-2xl page-frame"
                style={{
                  ...itemDimensions,
                  aspectRatio: assumedPageRatio,
                }}
              >
                {isCloseToView && (
                  <Page
                    pageNumber={pageIndex + 1}
                    {...itemDimensions}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<CircularProgress size="lg" />}
                    error={
                      <Alert
                        className="light"
                        color="danger"
                        title={`Could not load page ${pageIndex + 1}`}
                      />
                    }
                    noData={
                      <Alert
                        className="light"
                        color="warning"
                        title={`No data for page ${pageIndex + 1}`}
                      />
                    }
                  />
                )}
              </div>
            ))
          }
        </EmblaCarouselStructure>
      </Document>
      <NavigationButtons
        emblaApi={emblaApi}
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        pagesToShow={pagesToShow}
      />
    </div>
  );
}
