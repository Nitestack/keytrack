import { Card, CardFooter, CardHeader } from "@heroui/card";

import { redirect, unauthorized } from "next/navigation";

import { client } from "~/api/orpc";
import ScoreViewer from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer";
import DashboardLayout from "~/components/dashboard-layout";
import { auth } from "~/server/auth";

export default async function RepertoirePiecePage({
  params,
}: PageProps<"/repertoire/[musicBrainzId]">) {
  const { musicBrainzId } = await params;

  const session = await auth();

  if (!session) unauthorized();

  const piece = await client.repertoire.getPiece({ musicBrainzId });

  if (!piece) redirect("/repertoire");

  return (
    <DashboardLayout title={piece.title} backHref="/repertoire">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600">
              {piece.title}
              {piece.arrangement ? ` (${piece.arrangement})` : ""}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {piece.composer}
            </h5>
          </div>
        </CardHeader>
        <CardFooter>
          <ScoreViewer
            scoreUrls={piece.scoreUrls}
            scoreType={piece.scoreType}
          />
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
