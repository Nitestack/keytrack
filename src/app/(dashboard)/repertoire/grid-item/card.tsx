"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Image } from "@heroui/image";
import { cn } from "@heroui/react";

import dynamic from "next/dynamic";

import RepertoireGridItemUserContent from "~/app/(dashboard)/repertoire/grid-item/user-content";
import { useRepertoireStore } from "~/app/(dashboard)/repertoire/store";

import type { FC } from "react";
import type { RepertoirePiece } from "~/services/repertoire";

const RepertoireGridItemPdfDocument = dynamic(() => import("./pdf-document"), {
  ssr: false,
});

const RepertoireGridItemCard: FC<RepertoirePiece> = ({
  title,
  arrangement,
  composer,
  id,
  scoreUrls,
  scoreType,
}) => {
  const isSelected = useRepertoireStore((state) => state.isPieceSelected(id));
  const isSelectMode = useRepertoireStore((state) => state.isSelectMode);
  const toggleSelectPiece = useRepertoireStore(
    (state) => state.toggleSelectPiece,
  );

  function handleValueChange() {
    toggleSelectPiece(id);
  }
  return (
    <Card
      className={cn("aspect-square size-full", {
        "outline-primary": isSelected,
      })}
      isPressable
      onPress={handleValueChange}
    >
      <CardHeader>
        {isSelectMode ? (
          <Checkbox isSelected={isSelected} onValueChange={handleValueChange}>
            <RepertoireGridItemUserContent
              title={title}
              composer={composer}
              arrangement={arrangement}
            />
          </Checkbox>
        ) : (
          <RepertoireGridItemUserContent
            title={title}
            composer={composer}
            arrangement={arrangement}
          />
        )}
      </CardHeader>
      <CardBody>
        <div className="relative flex items-center justify-center h-full rounded-small overflow-hidden">
          {scoreType === "pdf" ? (
            <RepertoireGridItemPdfDocument file={scoreUrls[0]} />
          ) : (
            <Image alt={title} src={scoreUrls[0]} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RepertoireGridItemCard;
