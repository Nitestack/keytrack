"use client";

import { User } from "@heroui/user";

import ChipList from "~/app/(dashboard)/repertoire/add-piece/chip-list";
import { useAddRepertoirePieceStore } from "~/app/(dashboard)/repertoire/add-piece/store";

import type { FC } from "react";

const AddPieceSummary: FC = () => {
  const selectedPiece = useAddRepertoirePieceStore(
    (state) => state.selectedPiece,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.id === b.id;
    },
  );

  return selectedPiece ? (
    <div className="bg-default-100 p-3 rounded-medium space-y-4">
      <div>
        <User
          avatarProps={{
            name: selectedPiece.composer,
            classNames: {
              base: "hidden",
            },
          }}
          name={`${selectedPiece.title}${selectedPiece.arrangement ? ` (${selectedPiece.arrangement})` : ""}`}
          description={selectedPiece.composer}
        />
      </div>
      <ChipList />
    </div>
  ) : null;
};

export default AddPieceSummary;
