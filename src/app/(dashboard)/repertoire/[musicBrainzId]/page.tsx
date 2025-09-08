import { PageContainer } from "@toolpad/core/PageContainer";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { redirect } from "next/navigation";

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

  if (!piece) redirect("/repertoire");

  let pdfFile: DocumentProps["file"] = piece.pdfUrl;

  if (pdfFile.startsWith("https://imslp.org/wiki/Special:ImagefromIndex")) {
    pdfFile = await getPdfUrlByIndex(pdfFile);
  }

  return (
    <PageContainer title={piece.musicBrainzPiece.title}>
      <Card>
        <CardHeader
          title="Information"
          subheader={
            piece.musicBrainzPiece.arrangement
              ? `Arrangement ${piece.musicBrainzPiece.arrangement}`
              : undefined
          }
        />
        <CardContent>
          <Typography>
            Composer: {piece.musicBrainzPiece.composer.name}
          </Typography>
          <Typography>Type: </Typography>
          <Typography>Genre: </Typography>
          <Typography>Key: </Typography>
          <Typography>Status: </Typography>
        </CardContent>
        <CardActions>{pdfFile && <PdfViewer file={pdfFile} />}</CardActions>
      </Card>
    </PageContainer>
  );
}
