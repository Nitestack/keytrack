import { PageContainer } from "@toolpad/core/PageContainer";

import PdfViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer";
import { getPdfUrlByIndex } from "~/services/imslp";
import { api } from "~/trpc/server";

import type { DocumentProps } from "react-pdf";

export default async function RepertoirePiecePage({
  params,
}: {
  params: Promise<{ musicBrainzId: string }>;
}) {
  const { musicBrainzId } = await params;

  const piece = await api.repertoire.getPiece({ musicBrainzId });

  let pdfFile: DocumentProps["file"] = piece.pdfUrl;

  if (pdfFile.startsWith("https://imslp.org/wiki/Special:ImagefromIndex")) {
    pdfFile = await getPdfUrlByIndex(pdfFile);
  }

  return (
    <PageContainer title={piece.title}>
      {pdfFile && <PdfViewer file={pdfFile} />}
    </PageContainer>
  );
}
