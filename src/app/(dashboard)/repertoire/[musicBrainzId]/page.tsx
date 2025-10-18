import { PageContainer } from "@toolpad/core/PageContainer";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { redirect } from "next/navigation";

import PdfViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer";
import { api } from "~/trpc/server";

export default async function RepertoirePiecePage({
  params,
}: PageProps<"/repertoire/[musicBrainzId]">) {
  const { musicBrainzId } = await params;

  const piece = await api.repertoire.getPiece({ musicBrainzId });

  if (!piece) redirect("/repertoire");

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
        <CardActions>
          {piece.pdfUrl?.endsWith(".pdf") && <PdfViewer file={piece.pdfUrl} />}
        </CardActions>
      </Card>
    </PageContainer>
  );
}
