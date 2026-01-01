"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/use-disclosure";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { useWindowSize } from "usehooks-ts";

import { useScoreViewerControls } from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/context";
import ScoreViewerSettingsMenu from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/settings-menu";
import ScoreViewerSlide from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/slide";
import ScoreViewerToolsMenu from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/tools-menu";

import type { FC } from "react";
import type { Slide } from "yet-another-react-lightbox";
import type { ScoreType } from "~/services/file-storage";

declare module "yet-another-react-lightbox" {
  interface ScoreSlide extends GenericSlide {
    type: "score";
    pageIndex: number;
    nextPageIndex?: number;
  }

  interface SlideTypes {
    score: ScoreSlide;
  }
}

const Lightbox = dynamic(() => import("./lightbox"), { ssr: false });

const ScoreViewer: FC<{
  fileName: string;
  musicBrainzId: string;
  userId: string;
  scoreUrls: string[];
  scoreType: ScoreType;
}> = ({ fileName, musicBrainzId, userId, scoreUrls, scoreType }) => {
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { fullscreenRef, thumbnailsRef } = useScoreViewerControls();

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

  const downloadUrl = `/api/files/${userId}/${musicBrainzId}/download?filename=${fileName}`;

  const slides = useMemo<Slide[]>(() => {
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
      download: downloadUrl,
    }));
  }, [pageCount, pagesToShow, showTwoPages, downloadUrl]);

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
        fullscreen={{
          ref: fullscreenRef,
        }}
        thumbnails={{
          ref: thumbnailsRef,
        }}
        toolbar={{
          buttons: [
            "download",
            <ScoreViewerToolsMenu key="tools" />,
            <ScoreViewerSettingsMenu key="settings" />,
            "close",
          ],
        }}
        slides={slides}
        render={{
          slide: ({ slide, rect }) => (
            <ScoreViewerSlide
              slide={slide}
              rect={rect}
              pagesToShow={pagesToShow}
              scoreType={scoreType}
              scoreUrls={scoreUrls}
            />
          ),
          thumbnail: ({ slide, rect }) => (
            <ScoreViewerSlide
              slide={slide}
              rect={rect}
              pagesToShow={pagesToShow}
              scoreType={scoreType}
              scoreUrls={scoreUrls}
              isThumbnail
            />
          ),
          buttonFullscreen: () => null,
          buttonNext: slides.length <= 1 ? () => null : undefined,
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonThumbnails: () => null,
        }}
      />
    </>
  );
};

export default ScoreViewer;
