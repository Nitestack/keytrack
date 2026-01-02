"use client";

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useDebounceCallback } from "usehooks-ts";

import { orpc } from "~/api/react";
import { useAddRepertoirePieceStore } from "~/app/(dashboard)/repertoire/add-piece/store";

import type { FC } from "react";
import type { MBWork } from "~/services/music-brainz";

function toInputValue(piece: MBWork) {
  return (
    `${piece.composer} - ${piece.title}` +
    (piece.arrangement ? ` (${piece.arrangement})` : "")
  );
}

const SearchPiece: FC = () => {
  const selectedPiece = useAddRepertoirePieceStore(
    (state) => state.selectedPiece,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.id === b.id;
    },
  );
  const setSelectedPiece = useAddRepertoirePieceStore(
    (state) => state.setSelectedPiece,
  );
  const resetScoreSelection = useAddRepertoirePieceStore(
    (state) => state.resetScoreSelection,
  );

  const [searchResultItems, setSearchResultItems] = useState<MBWork[]>([]);
  const [isSelectionChange, setIsSelectionChange] = useState(false);

  const { data, isPending, mutate, variables } = useMutation(
    orpc.repertoire.search.mutationOptions({
      onSuccess: (data) => {
        setSearchResultItems(data);
      },
    }),
  );

  const handleInputChange = useDebounceCallback((newValue: string) => {
    if (!isSelectionChange) {
      if (variables?.work === newValue) {
        // if the last search query is the same as the current
        if (searchResultItems.length === 0 && data) setSearchResultItems(data); // use the last search result if available
        return;
      }
      if (newValue.trim() === "") {
        setSearchResultItems([]);
        return;
      }
      mutate({ work: newValue.trim() });
    }
    setIsSelectionChange(false);
  }, 500);

  function handleSelectionChange(key: string | null) {
    if (data && key) {
      resetScoreSelection();
      setSelectedPiece(data.find((piece) => piece.id === key)!);
    }
    setIsSelectionChange(true);
  }

  const groupedByComposer = Object.groupBy(
    searchResultItems,
    (piece) => piece.composer,
  );

  return (
    <Autocomplete
      aria-label="Search piece"
      fullWidth
      isLoading={isPending}
      onInputChange={(value) => handleInputChange(value)}
      defaultInputValue={
        selectedPiece ? toInputValue(selectedPiece) : undefined
      }
      selectedKey={selectedPiece?.id ?? null}
      onSelectionChange={(key) => handleSelectionChange(key as string | null)}
      disabledKeys={searchResultItems
        .filter((piece) => piece.isInRepertoire)
        .map((piece) => piece.id)}
      listboxProps={{
        emptyContent: "No pieces found",
      }}
      description="Powered by MusicBrainz"
      placeholder="Search a piece"
    >
      {Object.keys(groupedByComposer).map((composer) => (
        <AutocompleteSection
          key={composer}
          title={composer}
          items={groupedByComposer[composer]}
        >
          {(piece) => (
            <AutocompleteItem
              key={piece.id}
              description={piece.arrangement}
              textValue={toInputValue(piece)}
            >
              {piece.title}
              {piece.isInRepertoire ? " (added)" : ""}
            </AutocompleteItem>
          )}
        </AutocompleteSection>
      ))}
    </Autocomplete>
  );
};

export default SearchPiece;
