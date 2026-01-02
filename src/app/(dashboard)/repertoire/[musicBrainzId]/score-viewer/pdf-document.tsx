"use client";

import { Alert } from "@heroui/alert";
import { CircularProgress, Progress } from "@heroui/progress";

import { Document, Page, pdfjs } from "react-pdf";

import type { DocumentProps } from "react-pdf";

import "./pdf-document.scss";

import { memo } from "react";

import ScorePage from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/score-page";

import type { FC } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfViewerDocument: FC<{
  file: DocumentProps["file"];
  pageIndex: number;
  nextPageIndex?: number;
  height?: number;
  width?: number;
  isThumbnail?: boolean;
}> = ({ file, height, width, pageIndex, nextPageIndex, isThumbnail }) => {
  const indices = [pageIndex, nextPageIndex].filter(Boolean);

  return (
    <Document
      file={file}
      className="size-full"
      loading={
        <div className="flex items-center justify-center size-full">
          <Progress
            isIndeterminate
            size="sm"
            aria-label="Loading PDF document..."
          />
        </div>
      }
    >
      <div className="flex size-full items-center justify-center gap-1">
        {indices.map((pageNum) => (
          <ScorePage
            key={pageNum}
            pageNum={pageNum}
            isThumbnail={isThumbnail}
            className="flex items-center justify-center bg-white page-frame"
            style={{
              height,
              width,
            }}
          >
            <Page
              height={height}
              width={width}
              pageNumber={pageNum}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <CircularProgress
                  size="lg"
                  aria-label={`Loading page ${pageNum}...`}
                />
              }
              error={
                <Alert
                  className="light"
                  color="danger"
                  title={`Could not load page ${pageNum}`}
                />
              }
              noData={
                <Alert
                  className="light"
                  color="warning"
                  title={`No data for page ${pageNum}`}
                />
              }
            />
          </ScorePage>
        ))}
      </div>
    </Document>
  );
};

export default memo(PdfViewerDocument);
