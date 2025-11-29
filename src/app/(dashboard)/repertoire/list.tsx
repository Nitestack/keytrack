"use client";

import { Listbox, ListboxItem } from "@heroui/listbox";

import type { FC } from "react";
import type { RouterOutputs } from "~/server/api/routers";

const RepertoireList: FC<{
  pieces: RouterOutputs["repertoire"]["getPieces"];
}> = ({ pieces }) => {
  return (
    <Listbox variant="faded">
      {pieces.map((piece) => (
        <ListboxItem
          key={piece.id}
          description={piece.composer}
          href={`/repertoire/${piece.id}`}
        >
          <p>
            {piece.title}
            {piece.arrangement && (
              <span className="text-default-500 text-sm">
                {" "}
                ({piece.arrangement})
              </span>
            )}
          </p>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default RepertoireList;
