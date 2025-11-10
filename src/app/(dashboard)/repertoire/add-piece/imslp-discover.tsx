"use client";

import { Alert } from "@heroui/alert";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { Search, SquareArrowOutUpRight } from "lucide-react";

import { useAddRepertoirePieceStore } from "~/app/(dashboard)/repertoire/add-piece/store";
import { api } from "~/trpc/react";

import type { Key } from "@react-types/shared";
import type { FC } from "react";
import type { ImslpScore } from "~/services/imslp";

function toInputValue(score: ImslpScore) {
  return `${score.publisher.name} - ${score.title}${score.isUrtext ? " (Urtext Edition)" : ""}`;
}

const IMSLPDiscover: FC = () => {
  const selectedImslpScore = useAddRepertoirePieceStore(
    (state) => state.selectedImslpScore,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.id === b.id;
    },
  );
  const setSelectedImslpScore = useAddRepertoirePieceStore(
    (state) => state.setSelectedImslpScore,
  );
  const imslpScores = useAddRepertoirePieceStore(
    (state) => state.imslpScores,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.length === b.length;
    },
  );
  const setImslpScores = useAddRepertoirePieceStore(
    (state) => state.setImslpScores,
  );
  const selectedPieceId = useAddRepertoirePieceStore(
    (state) => state.selectedPiece?.id,
  );
  const hideImslpTab = useAddRepertoirePieceStore(
    (state) => state.hideImslpTab,
  );

  const { mutate, isPending, isSuccess, data } =
    api.repertoire.getImslpScores.useMutation({
      onSuccess: (newData) => {
        if (newData) setImslpScores(newData.scores);
        else hideImslpTab();
      },
    });

  const groupedByPublisher = Object.groupBy(imslpScores, (score) =>
    score.isUrtext ? "Urtext Edition" : score.publisher.name,
  );

  function handleSelectionChange(key: Key | null) {
    if (imslpScores.length <= 0 || !key) return;

    const imslpScore = imslpScores.find((score) => score.id === key)!;
    setSelectedImslpScore(imslpScore);
  }
  function handleImslpSearch() {
    if (selectedPieceId)
      mutate({
        musicBrainzId: selectedPieceId,
      });
  }
  return imslpScores.length >= 1 ? (
    <div className="space-y-4">
      <Autocomplete
        fullWidth
        defaultInputValue={
          selectedImslpScore ? toInputValue(selectedImslpScore) : undefined
        }
        selectedKey={selectedImslpScore?.id ?? null}
        onSelectionChange={handleSelectionChange}
        listboxProps={{
          emptyContent: "No scores found",
        }}
        description="Powered by IMSLP"
        placeholder="Select a score"
      >
        {Object.keys(groupedByPublisher).map((publisher) => (
          <AutocompleteSection
            key={publisher}
            title={publisher}
            items={groupedByPublisher[publisher]}
          >
            {(piece) => (
              <AutocompleteItem
                key={piece.id}
                description={[
                  piece.isUrtext ? piece.publisher.name : undefined,
                  piece.publisher.date,
                  piece.pages,
                  piece.fileSize,
                ]
                  .filter(Boolean)
                  .join(" • ")}
                textValue={toInputValue(piece)}
              >
                {piece.title}
              </AutocompleteItem>
            )}
          </AutocompleteSection>
        ))}
      </Autocomplete>
      <Alert
        color="primary"
        title={
          <p>
            Unsure which to choose?{" "}
            <Link className="text-sm" target="_blank" href={data?.imslpUrl}>
              Preview the scores on IMSLP{" "}
              <SquareArrowOutUpRight className="ml-1" size={16} />
            </Link>
            <br />
            To help you find an authentic version,{" "}
            <span className="font-extrabold">Urtext Edition</span> scores are
            listed first.
          </p>
        }
      />
    </div>
  ) : !isSuccess ? (
    <Button
      fullWidth
      color="primary"
      isLoading={isPending}
      startContent={<Search size={16} />}
      onPress={handleImslpSearch}
    >
      Search for IMSLP scores
    </Button>
  ) : null;
};

export default IMSLPDiscover;
