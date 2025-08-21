"use client";

import dynamic from "next/dynamic";

import type { FC } from "react";
import type { PdfViewerProps } from "~/components/pdf-viewer";

const PdfViewerComponent = dynamic(
  () => import("../../../../components/pdf-viewer"),
  { ssr: false },
);

const PdfViewer: FC<PdfViewerProps> = ({ pdfUrl, title }) => {
  return <PdfViewerComponent title={title} pdfUrl={pdfUrl} />;
};

export default PdfViewer;
