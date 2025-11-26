"use client";

import { Button } from "@heroui/button";

import { X } from "lucide-react";

import dynamic from "next/dynamic";
import { useState } from "react";

import { browserName, isIOS, isMacOs, isSafari } from "react-device-detect";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import ImageViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/image-viewer";
import PdfToolbar from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/toolbar";

import type { FC } from "react";
import type { ScoreType } from "~/services/file-storage";

const PdfDocument = dynamic(() => import("./pdf-document"), { ssr: false });

const ScoreViewer: FC<{ scoreUrls: string[]; scoreType: ScoreType }> = ({
  scoreUrls,
  scoreType,
}) => {
  const handle = useFullScreenHandle();

  const [fullScreenNode, setFullScreenNode] = useState<HTMLDivElement | null>(
    null,
  );

  const hasNativeCloseButton =
    isSafari || // Safari on any platform
    isIOS || // Any browser on iOS (they all use Safari engine)
    (browserName === "Safari" && isMacOs); // Explicitly Safari on macOS

  return (
    <>
      <Button color="primary" onPress={handle.enter}>
        Open Score
      </Button>
      <FullScreen handle={handle}>
        {handle.active && (
          <div
            className="bg-background relative h-full"
            ref={setFullScreenNode}
          >
            {!hasNativeCloseButton && (
              <Button
                isIconOnly
                className="absolute z-50 top-4 left-4"
                variant="flat"
                onPress={handle.exit}
              >
                <X />
              </Button>
            )}
            {scoreType === "pdf" ? (
              <PdfDocument file={scoreUrls[0]} />
            ) : (
              <ImageViewer imageUrls={scoreUrls} />
            )}
            <PdfToolbar fullScreenEl={fullScreenNode ?? undefined} />
          </div>
        )}
      </FullScreen>
    </>
  );
};

export default ScoreViewer;
