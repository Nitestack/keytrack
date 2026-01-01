"use client";

import dynamic from "next/dynamic";

import ImageViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/image-viewer";

import type { FC } from "react";
import type { ContainerRect, Slide } from "yet-another-react-lightbox";
import type { ScoreType } from "~/services/file-storage";

const ASSUMED_PAGE_RATIO = 210 / 297;

const PdfDocument = dynamic(() => import("./pdf-document"), { ssr: false });

const ScoreViewerSlide: FC<{
  slide: Slide;
  rect: ContainerRect;
  pagesToShow: number;
  scoreType: ScoreType;
  scoreUrls: string[];
  isThumbnail?: boolean;
}> = ({ slide, rect, pagesToShow, scoreType, scoreUrls, isThumbnail }) => {
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
    <PdfDocument
      pageIndex={slide.pageIndex}
      nextPageIndex={slide.nextPageIndex}
      {...dims.primary}
      file={scoreUrls[0]}
      isThumbnail={isThumbnail}
    />
  ) : (
    <ImageViewer
      pageIndex={slide.pageIndex}
      nextPageIndex={slide.nextPageIndex}
      {...dims.primary}
      {...dims.secondary}
      imageUrls={scoreUrls}
      isThumbnail={isThumbnail}
    />
  );
};

export default ScoreViewerSlide;
