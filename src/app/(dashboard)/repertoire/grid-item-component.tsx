"use client";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";

import "~/app/(dashboard)/repertoire/grid-item-component.scss";

import CardActionArea from "@mui/material/CardActionArea";

import clsx from "clsx";
import { Document, Page, pdfjs } from "react-pdf";

import RemovePiece from "~/app/(dashboard)/repertoire/delete-piece";

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
      className={clsx("relative", {
        "aspect-square": pdfUrl,
      })}
    >
      <CardActionArea href={`/repertoire/${musicBrainzId}`}>
        <CardHeader
          title={`${title}${arrangement ? ` (${arrangement})` : ""}`}
          subheader={composer}
          slotProps={{
            content: {
              className: "max-w-full",
            },
            title: {
              noWrap: true,
            },
          }}
        />
        {pdfUrl && (
          <CardMedia className="flex items-center justify-center overflow-hidden bg-white h-full">
            <Document file={pdfUrl} loading={<CircularProgress />}>
              <Page
                pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </CardMedia>
        )}
      </CardActionArea>
      <div className="absolute right-0 bottom-0">
        <RemovePiece
          title={title}
          composer={composer}
          arrangement={arrangement}
          musicBrainzId={musicBrainzId}
        />
      </div>
    </Card>
  );
};

export default RepertoireGridItemComponent;
