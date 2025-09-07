"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import dynamic from "next/dynamic";
import { useRef } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { browserName, isIOS, isMacOs, isSafari } from "react-device-detect";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import PdfIconButton from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/icon-button";
import PdfToolbar from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer/toolbar";

import type { FC } from "react";
import type { DocumentProps } from "react-pdf";

const PdfDocument = dynamic(() => import("./document"), { ssr: false });

const PdfViewer: FC<Required<Pick<DocumentProps, "file">>> = ({ file }) => {
  const handle = useFullScreenHandle();

  const theme = useTheme();
  const breakpoint = theme.breakpoints.down("lg");
  const isMobile = useMediaQuery(breakpoint);

  const fullScreenRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      slidesToScroll: 2,
      breakpoints: {
        [breakpoint.split("@media ")[1]!]: {
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
      <Card variant="outlined" className="w-full">
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Score Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the &quot;Open Score&quot; button to view the full musical score
            in an optimized view.
          </Typography>
          <Box sx={{ mt: 2 }} className="space-y-2" />
        </CardContent>
        <CardActions>
          <Button
            onClick={handle.enter}
            variant="contained"
            startIcon={<MusicNoteIcon />}
            sx={{ ml: 1 }}
          >
            Open Score
          </Button>
        </CardActions>
      </Card>
      <FullScreen handle={handle}>
        {handle.active && (
          <div className="bg-white relative h-full" ref={fullScreenRef}>
            {!hasNativeCloseButton && (
              <PdfIconButton className="top-4 left-4" onClick={handle.exit}>
                <CloseIcon />
              </PdfIconButton>
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
