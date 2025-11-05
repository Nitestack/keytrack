"use client";

import "~/app/(dashboard)/repertoire/grid-item-component.scss";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { User } from "@heroui/user";

import NextLink from "next/link";

import { Document, Page, pdfjs } from "react-pdf";

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
  return (
    <Card
      className="aspect-square"
      as={NextLink}
      isPressable
      href={`/repertoire/${musicBrainzId}` as Route}
    >
      <CardHeader>
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
