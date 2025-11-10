import { Card, CardFooter, CardHeader } from "@heroui/card";

import { redirect, unauthorized } from "next/navigation";

import PdfViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/pdf-viewer";
import DashboardLayout from "~/components/dashboard-layout";
import { auth } from "~/server/auth";
import { getScoreUrls } from "~/services/file-storage";
import { api } from "~/trpc/server";

export default async function RepertoirePiecePage({
  params,
}: PageProps<"/repertoire/[musicBrainzId]">) {
  const { musicBrainzId } = await params;

  const session = await auth();

  if (!session) unauthorized();

  const piece = await api.repertoire.getPiece({ musicBrainzId });

  if (!piece) redirect("/repertoire");

  const urls = await getScoreUrls(
    session.user.id,
    piece.musicBrainzId,
    piece.scoreType,
  );

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
          {urls.length === 1 && <PdfViewer file={urls[0]!} />}
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
