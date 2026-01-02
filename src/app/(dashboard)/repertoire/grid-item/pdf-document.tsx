import { CircularProgress } from "@heroui/progress";

import "~/app/(dashboard)/repertoire/grid-item/pdf-document.scss";

import { Document, Page, pdfjs } from "react-pdf";

import type { FC } from "react";
import type { DocumentProps } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const RepertoireGridItemPdfDocument: FC<{ file: DocumentProps["file"] }> = ({
  file,
}) => {
  return (
    <Document
      file={file}
      loading={<CircularProgress aria-label="Loading PDF preview..." />}
    >
      <Page
        pageNumber={1}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
};

export default RepertoireGridItemPdfDocument;
