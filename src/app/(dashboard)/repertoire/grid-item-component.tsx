"use client";

import "~/app/(dashboard)/repertoire/grid-item-component.scss";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { CircularProgress } from "@heroui/progress";
import { User } from "@heroui/user";

import NextLink from "next/link";

import { Document, Page, pdfjs } from "react-pdf";

import { useRepertoireStore } from "~/app/(dashboard)/repertoire/store";

import type { Route } from "next";
import type { FC } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const RepertoireGridItemComponent: FC<{
  title: string;
  musicBrainzId: string;
  composer: string;
  arrangement: string | null;
  pdfUrl?: string;
}> = ({ title, arrangement, composer, musicBrainzId, pdfUrl }) => {
  const isSelected = useRepertoireStore((state) =>
    state.isPieceSelected(musicBrainzId),
  );
  const isSelectMode = useRepertoireStore((state) => state.isSelectMode);
  const toggleSelectPiece = useRepertoireStore(
    (state) => state.toggleSelectPiece,
  );

  function handleValueChange() {
    toggleSelectPiece(musicBrainzId);
  }
  return (
    <Card className="aspect-square" isPressable>
      <CardHeader>
        {isSelectMode ? (
          <Checkbox isSelected={isSelected} onValueChange={handleValueChange}>
            <User
              avatarProps={{
                name: composer,
                classNames: {
                  base: "hidden",
                },
              }}
              name={`${title}${arrangement ? ` (${arrangement})` : ""}`}
              description={composer}
            />
          </Checkbox>
        ) : (
          <NextLink href={`/repertoire/${musicBrainzId}` as Route}>
            <User
              avatarProps={{
                name: composer,
                classNames: {
                  base: "hidden",
                },
              }}
              name={`${title}${arrangement ? ` (${arrangement})` : ""}`}
              description={composer}
            />
          </NextLink>
        )}
      </CardHeader>
      <CardBody>
        {pdfUrl && (
          <div className="flex items-center justify-center overflow-hidden bg-white h-full rounded-small">
            <Document file={pdfUrl} loading={<CircularProgress />}>
              <Page
                pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RepertoireGridItemComponent;
