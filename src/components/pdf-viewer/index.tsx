"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { pdfjs } from "react-pdf";

import type { EmblaOptionsType } from "embla-carousel";
import type { FC } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import PdfDocument from "~/components/pdf-viewer/document";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface PdfViewerProps {
  pdfUrl: string;
}

const PdfViewer: FC<PdfViewerProps> = ({ pdfUrl }) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const theme = useTheme();
  const breakpoint = theme.breakpoints.down("lg");
  const isMobile = useMediaQuery(breakpoint);

  const emblaOptions: EmblaOptionsType = {
    align: "center",
    slidesToScroll: 2,
    breakpoints: {
      [breakpoint.split("@media ")[1]!]: {
        slidesToScroll: 1,
      },
    },
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const handleFullScreenOpen = () => setIsFullScreen(true);
  const handleFullScreenClose = () => setIsFullScreen(false);

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
            onClick={handleFullScreenOpen}
            variant="contained"
            startIcon={<MusicNoteIcon />}
            sx={{ ml: 1 }}
          >
            Open Score
          </Button>
        </CardActions>
      </Card>
      <Dialog
        classes={{
          container: "relative",
        }}
        fullScreen
        open={isFullScreen}
        onClose={handleFullScreenClose}
      >
        <IconButton
          onClick={handleFullScreenClose}
          className="absolute top-0 right-0 z-50"
        >
          <CloseIcon />
        </IconButton>
        <PdfDocument
          file={pdfUrl}
          emblaApi={emblaApi}
          emblaRef={emblaRef}
          isMobile={isMobile}
        />
      </Dialog>
    </>
  );
};

export default PdfViewer;
