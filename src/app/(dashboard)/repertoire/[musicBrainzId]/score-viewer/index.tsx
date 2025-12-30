"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/use-disclosure";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { useWindowSize } from "usehooks-ts";

import ImageViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/image-viewer";

import type { FC } from "react";
import type { GenericSlide } from "yet-another-react-lightbox";
import type { ScoreType } from "~/services/file-storage";

interface ScoreSlide extends GenericSlide {
  type: "score";
  pageIndex: number;
  nextPageIndex?: number;
}

declare module "yet-another-react-lightbox" {
  interface SlideTypes {
    score: ScoreSlide;
  }
}

const PdfDocument = dynamic(() => import("./pdf-document"), { ssr: false });

const Lightbox = dynamic(() => import("./lightbox"), { ssr: false });

const ASSUMED_PAGE_RATIO = 210 / 297;

const ScoreViewer: FC<{ scoreUrls: string[]; scoreType: ScoreType }> = ({
  scoreUrls,
  scoreType,
}) => {
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (scoreType !== "pdf" || !scoreUrls[0]) return;
    const loadMetadata = async () => {
      try {
        const { pdfjs } = await import("react-pdf");

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjs.getDocument(scoreUrls[0]).promise;
        setPdfPageCount(pdf.numPages);
      } catch (error) {
        console.error("Failed to load PDF metadata", error);
      }
    };

    void loadMetadata();
  }, [scoreUrls, scoreType]);

  const { width = 0, height = 0 } = useWindowSize();
  const pageCount = scoreType === "pdf" ? pdfPageCount : scoreUrls.length;
  const screenRatio = height > 0 ? width / height : 0;
  const showTwoPages = screenRatio > 1.2; // safe middle ground between portrait and landscape
  const pagesToShow = showTwoPages ? 2 : 1;

  const slides = useMemo<ScoreSlide[]>(() => {
    if (pageCount === 0) return [];

    const chunks: number[][] = [];

    for (let i = 1; i <= pageCount; i += pagesToShow) {
      const chunk = [i];
      if (showTwoPages && i + 1 <= pageCount) {
        chunk.push(i + 1);
      }
      chunks.push(chunk);
    }

    return chunks.map((chunk) => ({
      type: "score",
      pageIndex: chunk[0]!,
      nextPageIndex: chunk[1],
    }));
  }, [pageCount, pagesToShow, showTwoPages]);

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Open Score
      </Button>
      <Lightbox
        open={isOpen}
        close={onClose}
        carousel={{
          finite: true,
          preload: 2,
        }}
        slides={slides}
        render={{
          slide: ({ slide, rect }) => {
            if (slide.type !== "score") return null;

            const gap = pagesToShow > 1 ? 2 : 0; // gap of 4px between pages
            const maxHeight = rect.height;
            const maxWidth = rect.width / pagesToShow - gap;

            const dims =
              maxHeight * ASSUMED_PAGE_RATIO <= maxWidth
                ? {
                    primary: { height: maxHeight },
                    secondary: { width: "100%" },
                  }
                : {
                    primary: { width: maxWidth },
                    secondary: { height: "100%" },
                  };

            return scoreType === "pdf" ? (
              <PdfDocument {...slide} {...dims.primary} file={scoreUrls[0]} />
            ) : (
              <ImageViewer
                {...slide}
                {...dims.primary}
                {...dims.secondary}
                imageUrls={scoreUrls}
              />
            );
          },
        }}
      />
    </>
  );
};

export default ScoreViewer;
