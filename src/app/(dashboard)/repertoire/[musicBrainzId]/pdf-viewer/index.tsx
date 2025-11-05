"use client";

import { Button } from "@heroui/button";

import { X } from "lucide-react";

import dynamic from "next/dynamic";
import { useRef } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { browserName, isIOS, isMacOs, isSafari } from "react-device-detect";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useMediaQuery } from "usehooks-ts";

import PdfToolbar from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/toolbar";

import type { FC } from "react";
import type { DocumentProps } from "react-pdf";

const PdfDocument = dynamic(() => import("./document"), { ssr: false });

const PdfViewer: FC<Required<Pick<DocumentProps, "file">>> = ({ file }) => {
  const handle = useFullScreenHandle();

  const breakpoint = "(max-width:1199.95px)";
  const isMobile = useMediaQuery(breakpoint);

  const fullScreenRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      slidesToScroll: 2,
      breakpoints: {
        [breakpoint]: {
          slidesToScroll: 1,
        },
      },
    },
    [
      WheelGesturesPlugin({
        forceWheelAxis: "y",
      }),
    ],
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
          <div className="bg-white relative h-full" ref={fullScreenRef}>
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
            <PdfDocument
              file={file}
              emblaApi={emblaApi}
              emblaRef={emblaRef}
              isMobile={isMobile}
            />
            <PdfToolbar
              isMobile={isMobile}
              fullScreenEl={fullScreenRef.current ?? undefined}
            />
          </div>
        )}
      </FullScreen>
    </>
  );
};

export default PdfViewer;
