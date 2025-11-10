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
          <p>
            {piece.musicBrainzPiece.title}
            {piece.musicBrainzPiece.arrangement && (
              <span className="text-default-500 text-sm">
                {" "}
                ({piece.musicBrainzPiece.arrangement})
              </span>
            )}
          </p>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default RepertoireList;
