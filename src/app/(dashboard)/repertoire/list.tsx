"use client";

import { Listbox, ListboxItem } from "@heroui/listbox";

import type { FC } from "react";
import type { RouterOutputs } from "~/trpc/react";

const RepertoireList: FC<{
  pieces: RouterOutputs["repertoire"]["getPieces"];
}> = ({ pieces }) => {
  return (
    <Listbox variant="faded">
      {pieces.map((piece) => (
        <ListboxItem
          key={piece.musicBrainzId}
          description={piece.musicBrainzPiece.composer.name}
          href={`/repertoire/${piece.musicBrainzId}`}
        >
          <div className="flex flex-col">
            {piece.musicBrainzPiece.title}
            {piece.musicBrainzPiece.arrangement && (
              <span className="text-secondary text-sm">
                Arrangement {piece.musicBrainzPiece.arrangement}
              </span>
            )}
          </div>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default RepertoireList;
