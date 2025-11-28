"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { useState } from "react";

import z from "zod";

import ChipList from "~/app/(dashboard)/repertoire/add-piece/chip-list";
import {
  useAddRepertoirePieceStore,
  validateItems,
} from "~/app/(dashboard)/repertoire/add-piece/store";

import type { FC } from "react";

const ScoreURL: FC = () => {
  const scoreUrls = useAddRepertoirePieceStore(
    (state) => state.scoreUrls,
    (a, b) => a.length === b.length,
  );
  const setScoreUrls = useAddRepertoirePieceStore(
    (state) => state.setScoreUrls,
  );

  const [currentUrl, setCurrentUrl] = useState("");
  const [error, setError] = useState<string>();

  function handleRemoveUrl(url: string) {
    setScoreUrls(scoreUrls.filter((u) => u !== url));
  }

  function handleAddUrl() {
    setError(undefined);

    const { success, data } = z.url().safeParse(currentUrl.trim());
    if (!success) return;

    if (scoreUrls.includes(data)) return;

    const newScoreUrls = [...scoreUrls, data];

    if (validateItems("input", newScoreUrls, setError)) {
      setScoreUrls(newScoreUrls);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="url"
          aria-label="Score URL"
          labelPlacement="outside"
          placeholder="Enter URL"
          value={currentUrl}
          onValueChange={setCurrentUrl}
          onKeyUp={(e) => e.key === "Enter" && handleAddUrl()}
          className="flex-1"
        />
        <Button
          color="primary"
          onPress={handleAddUrl}
          isDisabled={!currentUrl.trim()}
        >
          Add
        </Button>
      </div>
      {error && <Alert hideIcon color="danger" description={error} />}
      <ChipList onClose={handleRemoveUrl} showWarning />
    </div>
  );
};

export default ScoreURL;
