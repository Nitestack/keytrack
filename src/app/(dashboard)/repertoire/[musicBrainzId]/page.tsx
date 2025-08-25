import { PageContainer } from "@toolpad/core/PageContainer";

import PdfViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer";
import { getPdfUrlByIndex } from "~/services/imslp";
import { api } from "~/trpc/server";

export default async function RepertoirePiecePage({
  params,
}: {
  params: Promise<{ musicBrainzId: string }>;
}) {
  const { musicBrainzId } = await params;

  const piece = await api.repertoire.getPiece({ musicBrainzId });

  const imslpPdfUrl = await getPdfUrlByIndex(piece.imslpUrl);

  return (
    <PageContainer title={piece.title}>
      {imslpPdfUrl && <PdfViewer pdfUrl={imslpPdfUrl} />}
    </PageContainer>
  );
}
