import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

import { redirect } from "next/navigation";

import PdfViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer";
import DashboardLayout from "~/components/dashboard-layout";
import { api } from "~/trpc/server";

export default async function RepertoirePiecePage({
  params,
}: PageProps<"/repertoire/[musicBrainzId]">) {
  const { musicBrainzId } = await params;

  const piece = await api.repertoire.getPiece({ musicBrainzId });

  if (!piece) redirect("/repertoire");

  return (
    <DashboardLayout
      title={piece.musicBrainzPiece.title}
      backHref="/repertoire"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600">
              {piece.musicBrainzPiece.title}
              {piece.musicBrainzPiece.arrangement
                ? ` (${piece.musicBrainzPiece.arrangement})`
                : ""}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {piece.musicBrainzPiece.composer.name}
            </h5>
          </div>
        </CardHeader>
        <CardFooter>
          {piece.pdfUrl?.endsWith(".pdf") && <PdfViewer file={piece.pdfUrl} />}
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
