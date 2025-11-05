"use client";

import { Alert } from "@heroui/alert";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { Search, SquareArrowOutUpRight } from "lucide-react";

import { useState } from "react";

import type { Key } from "@react-types/shared";
import type { Dispatch, FC, SetStateAction } from "react";
import type { ImslpScore } from "~/services/imslp";

function toInputValue(score: ImslpScore) {
  return `${score.publisher.name} - ${score.title}${score.isUrtext ? " (Urtext Edition)" : ""}`;
}

const SetScore: FC<{
  imslpResult?: {
    imslpUrl: string;
    scores: ImslpScore[];
  };
  setPdfUrl: Dispatch<SetStateAction<string | null>>;
  getImslpScores: (imslpUrl?: string) => void;
  isGetImslpScoresPending: boolean;
}> = ({ imslpResult, setPdfUrl, getImslpScores, isGetImslpScoresPending }) => {
  const [selectedImslpScore, setSelectedImslpScore] =
    useState<ImslpScore | null>(null);
  const [pdfInput, setPdfInput] = useState("");

  function handleManualImslpScore() {
    getImslpScores(pdfInput);
  }
  function handlePdfInput(newPdfInput: string) {
    if (newPdfInput.startsWith("https://") && newPdfInput.endsWith(".pdf"))
      setPdfUrl(newPdfInput);
    else {
      setPdfUrl(null);
    }
    setPdfInput(newPdfInput);
  }
  function handleSelectionChange(key: Key | null) {
    if (!imslpResult || !key) return;

    const imslpScore = imslpResult.scores.find((score) => score.id === key);
    setPdfUrl(imslpScore?.url ?? null);
    setSelectedImslpScore(imslpScore ?? null);
  }

  const groupedByPublisher = Object.groupBy(
    imslpResult?.scores ?? [],
    (score) => (score.isUrtext ? "Urtext Edition" : score.publisher.name),
  );

  if (imslpResult && imslpResult.scores.length > 1)
    return (
      <>
        <Alert
          color="primary"
          title={
            <p>
              Unsure which to choose?{" "}
              <Link
                className="text-sm"
                target="_blank"
                href={imslpResult.imslpUrl}
              >
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
      </>
    );
  else
    return (
      <>
        <Alert
          color="warning"
          title={
            <p>
              We couldn&apos;t find the score automatically, possibly because
              this piece has multiple versions on IMSLP. Please paste a link to
              either the correct{" "}
              <span className="font-extrabold">IMSLP page</span> or a direct{" "}
              <span className="font-extrabold">PDF score</span> below.
            </p>
          }
        />
        <div className="mt-4 mb-2 flex items-center gap-2">
          <Input
            fullWidth
            id="url"
            name="url"
            type="url"
            placeholder="Paste IMSLP or PDF URL"
            value={pdfInput}
            onValueChange={handlePdfInput}
          />
          <Button
            isIconOnly
            isDisabled={!pdfInput.includes("imslp.org/wiki/")}
            isLoading={isGetImslpScoresPending}
            onPress={handleManualImslpScore}
            type="submit"
          >
            <Search size={16} />
          </Button>
        </div>
      </>
    );
};

export default SetScore;
