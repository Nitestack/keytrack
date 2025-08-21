"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { useCallback, useEffect, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { Document, Page, pdfjs } from "react-pdf";

import type { FC } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import Paper from "@mui/material/Paper";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PDF_ASPECT_RATIO = Math.sqrt(2);
const APP_BAR_HEIGHT = 48;
const PAGINATION_HEIGHT = 52;

interface PageDimensions {
  width: number;
  height: number;
}

export interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
}

const PdfViewer: FC<PdfViewerProps> = ({ pdfUrl, title }) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [fullScreenDimensions, setFullScreenDimensions] =
    useState<PageDimensions>({ width: 0, height: 0 });

  const fullScreenContainerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const pagesPerView = isMobile ? 1 : 2;

  const emblaOptions = {
    align: "start" as const,
    slidesToScroll: 1,
    containScroll: "trimSnaps" as const,
  };

  const [emblaFullScreenRef, emblaFullScreenApi] =
    useEmblaCarousel(emblaOptions);

  useEffect(() => {
    const loadPdfInfo = async () => {
      try {
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error("Error loading PDF info:", error);
      }
    };

    void loadPdfInfo();
  }, [pdfUrl]);

  const pageToSlideIndex = useCallback(
    (pageNumber: number): number => {
      return isMobile ? pageNumber - 1 : Math.floor((pageNumber - 1) / 2);
    },
    [isMobile],
  );

  const slideIndexToFirstPage = useCallback(
    (slideIndex: number): number => {
      return isMobile ? slideIndex + 1 : slideIndex * 2 + 1;
    },
    [isMobile],
  );

  const onSlideChange = useCallback(
    (api: typeof emblaFullScreenApi) => {
      if (!api) return;

      const slideIndex = api.selectedScrollSnap();
      const firstPageInSlide = slideIndexToFirstPage(slideIndex);
      setCurrentPage(firstPageInSlide);
    },
    [slideIndexToFirstPage],
  );

  useEffect(() => {
    if (!emblaFullScreenApi) return;

    emblaFullScreenApi.on("select", () => onSlideChange(emblaFullScreenApi));

    return () => {
      emblaFullScreenApi.off("select", () => onSlideChange(emblaFullScreenApi));
    };
  }, [emblaFullScreenApi, onSlideChange]);

  useEffect(() => {
    const updateFullScreenDimensions = () => {
      if (!fullScreenContainerRef.current || !isFullScreen) return;

      const container = fullScreenContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const availableHeight = containerHeight - PAGINATION_HEIGHT - 8; // 8px padding
      const horizontalGap = isMobile ? 0 : 8; // Gap between pages in two-page view
      const availableWidth = containerWidth;

      const maxWidthPerPage = isMobile
        ? availableWidth
        : (availableWidth - horizontalGap) / 2;

      const heightAtMaxWidth = maxWidthPerPage * PDF_ASPECT_RATIO;

      let finalWidth, finalHeight;

      if (heightAtMaxWidth <= availableHeight) {
        finalWidth = maxWidthPerPage;
        finalHeight = heightAtMaxWidth;
      } else {
        finalHeight = availableHeight;
        finalWidth = finalHeight / PDF_ASPECT_RATIO;
      }

      setFullScreenDimensions({ width: finalWidth, height: finalHeight });
    };

    if (isFullScreen) {
      const timer = setTimeout(updateFullScreenDimensions, 100);
      window.addEventListener("resize", updateFullScreenDimensions);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateFullScreenDimensions);
      };
    }
  }, [isMobile, isFullScreen]);

  const handleFullScreenOpen = () => setIsFullScreen(true);
  const handleFullScreenClose = () => setIsFullScreen(false);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    if (!emblaFullScreenApi) return;

    const slideIndex = pageToSlideIndex(page);
    emblaFullScreenApi.scrollTo(slideIndex);
    setCurrentPage(page);
  };

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setNumPages(numPages);
      setCurrentPage(1);

      if (emblaFullScreenApi) emblaFullScreenApi.scrollTo(0);
    },
    [emblaFullScreenApi],
  );

  const generateSlides = useCallback(() => {
    if (!numPages) return [];

    const totalSlides = Math.ceil(numPages / pagesPerView);
    const slides = [];

    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
      const pagesInSlide = [];
      const startPageIndex = slideIndex * pagesPerView;

      for (let j = 0; j < pagesPerView; j++) {
        const pageIndex = startPageIndex + j;
        if (pageIndex < numPages) {
          pagesInSlide.push(pageIndex);
        }
      }

      slides.push(pagesInSlide);
    }

    return slides;
  }, [numPages, pagesPerView]);

  const renderFullScreenViewer = () => {
    const slides = generateSlides();

    return (
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="h-full flex flex-col"
      >
        <div className="embla overflow-hidden flex-1" ref={emblaFullScreenRef}>
          <div className="embla__container flex h-full">
            {slides.map((pagesInSlide, slideIndex) => (
              <div
                key={`slide_${slideIndex}`}
                className={`embla__slide flex-none flex items-center justify-center py-1 ${isMobile ? "" : "gap-2"}`}
                style={{ width: "100%", height: "100%" }}
              >
                {pagesInSlide.map((pageIndex) => (
                  <Page
                    key={`page_${pageIndex + 1}`}
                    pageNumber={pageIndex + 1}
                    width={
                      fullScreenDimensions.width > 0
                        ? fullScreenDimensions.width
                        : undefined
                    }
                    height={
                      fullScreenDimensions.height > 0
                        ? fullScreenDimensions.height
                        : undefined
                    }
                    className="shadow-md border border-gray-200 bg-white"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {numPages && numPages > 1 && (
          <Paper className="flex justify-center items-center py-2 rounded-none">
            <Pagination
              count={numPages}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          </Paper>
        )}
      </Document>
    );
  };

  const renderInfoPanel = () => {
    return (
      <Card variant="outlined" className="w-full">
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Score Information
          </Typography>

          {numPages && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This score contains {numPages} page{numPages !== 1 ? "s" : ""}.
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            Use the "Open Score" button to view the full musical score in an
            optimized view.
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
    );
  };

  return (
    <>
      <div className="w-full">{renderInfoPanel()}</div>
      <Dialog fullScreen open={isFullScreen} onClose={handleFullScreenClose}>
        <AppBar
          position="static"
          sx={{ height: APP_BAR_HEIGHT, minHeight: APP_BAR_HEIGHT }}
        >
          <Toolbar variant="dense">
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {title ?? "PDF Viewer"}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleFullScreenClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          ref={fullScreenContainerRef}
          className="flex-1 h-full overflow-hidden"
          style={{ height: `calc(100vh - ${APP_BAR_HEIGHT}px)` }}
        >
          {renderFullScreenViewer()}
        </div>
      </Dialog>
    </>
  );
};

export default PdfViewer;
