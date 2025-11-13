"use client";

import { createWithEqualityFn } from "zustand/traditional";

import {
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_IMAGE_MIME_TYPES,
} from "~/services/file-types";

import type { Dispatch, SetStateAction } from "react";
import type { ImslpScore } from "~/services/imslp";
import type { MBWork } from "~/services/music-brainz";

export type ScoreType = "upload" | "input";
export type ScoreSelectionMode = "imslp" | ScoreType;

export const addRepertoirePieceSteps = [
  "Search piece",
  "Set score",
  "Add information",
];

function isPDF(item: string | File) {
  return typeof item === "string"
    ? item.endsWith(".pdf")
    : item.type === "application/pdf";
}

function isImage(item: string | File) {
  return typeof item === "string"
    ? SUPPORTED_IMAGE_FORMATS.some((format) => item.endsWith(format))
    : SUPPORTED_IMAGE_MIME_TYPES.some((mimeType) => item.type === mimeType);
}

export function validateItems(
  type: ScoreType,
  items: string[] | FileList,
  setError: Dispatch<SetStateAction<string | undefined>>,
) {
  const itemType = type === "upload" ? "file" : "URL";

  if (items.length <= 0) {
    setError(
      `Please ${type === "upload" ? "upload" : "enter"} at least one ${itemType}`,
    );
    return false;
  }

  const itemList = Array.from<string | File>(items);

  const hasPDF = itemList.some(isPDF);
  const hasImages = itemList.some(isImage);

  if (hasPDF && hasImages) {
    setError(
      `Cannot mix PDF and image ${itemType}s. Please upload either a PDF or images only.`,
    );
    return false;
  }

  if (hasPDF && itemList.length > 1) {
    setError(
      `Only one PDF ${itemType} is allowed. Either use a multi-page score PDF or use multiple images instead.`,
    );
    return false;
  }

  if (
    itemList.filter((item) =>
      typeof item === "string"
        ? !item.endsWith(".pdf") &&
          !SUPPORTED_IMAGE_FORMATS.some((format) => item.endsWith(format))
        : item.type !== "application/pdf" &&
          !SUPPORTED_IMAGE_MIME_TYPES.some(
            (mimeType) => item.type === mimeType,
          ),
    ).length > 0
  ) {
    setError(
      `Invalid ${itemType} type. Only PDF and image ${itemType}s are supported.`,
    );
    return false;
  }

  return true;
}

export interface AddRepertoirePieceStoreProps {
  /**
   * The current step in the add piece flow
   */
  step: number;
  /**
   * Sets the current step in the add piece flow
   * @param step The step to set
   */
  setStep: (step: number) => void;
  /**
   * Increases the current step in the add piece flow
   */
  increaseStep: () => void;
  /**
   * Decreases the current step in the add piece flow
   */
  decreaseStep: () => void;
  /**
   * Whether the user can go to the next step
   */
  canNext: () => boolean;
  /**
   * The current piece being added to the repertoire
   */
  selectedPiece?: MBWork;
  /**
   * Sets the currently selected piece
   * @param piece The piece to set
   */
  setSelectedPiece: (piece: MBWork) => void;
  /**
   * The current score selection mode
   */
  scoreSelectionMode: ScoreSelectionMode;
  /**
   * Sets the current score selection mode
   */
  setScoreSelectionMode: (mode: ScoreSelectionMode) => void;
  /**
   * Whether to show the IMSLP tab for score selection
   */
  showImslpTab: boolean;
  /**
   * Hides the IMSLP tab for score selection
   */
  hideImslpTab: () => void;
  /**
   * The current mode for the current selected score selection
   */
  mode: () => ScoreType | undefined;
  /**
   * The currently uploaded score files
   */
  uploadedScoreFiles?: FileList;
  /**
   * Sets the currently uploaded score files
   * @param files The files to upload
   */
  setUploadedScoreFiles: (files: FileList) => void;
  /**
   * The currently fetched IMSLP scores for the selected piece
   */
  imslpScores: ImslpScore[];
  /**
   * Sets the currently fetched IMSLP scores for the selected piece
   * @param scores The IMSLP scores to set
   */
  setImslpScores: (scores: ImslpScore[]) => void;
  /**
   * The currently selected IMSLP score
   */
  selectedImslpScore?: ImslpScore;
  /**
   * Sets the currently selected IMSLP score
   * @param score The IMSLP score to set
   */
  setSelectedImslpScore: (score: ImslpScore) => void;
  /**
   * The currently selected score URLs
   */
  scoreUrls: string[];
  /**
   * Sets the currently selected score URLs
   * @param urls The URLs to set
   */
  setScoreUrls: (urls: string[]) => void;
  /**
   * Resets the piece selection state
   */
  resetPieceSelection: () => void;
  /**
   * Resets the score selection state
   */
  resetScoreSelection: () => void;
}

export const useAddRepertoirePieceStore =
  createWithEqualityFn<AddRepertoirePieceStoreProps>()((set, get) => ({
    step: 0,
    setStep: (step) => {
      if (0 <= step && step < addRepertoirePieceSteps.length)
        set({ step: step });
    },
    increaseStep: () => {
      if (get().step + 1 < addRepertoirePieceSteps.length)
        set((state) => ({
          step: state.step + 1,
        }));
    },
    decreaseStep: () => {
      if (0 <= get().step - 1)
        set((state) => ({
          step: state.step - 1,
        }));
    },
    canNext: () => {
      if (get().step === 0 && !get().selectedPiece) return false;
      else if (
        get().step === 1 &&
        (get().uploadedScoreFiles?.length ?? 0) <= 0 &&
        get().scoreUrls.length <= 0 &&
        !get().selectedImslpScore
      )
        return false;
      return true;
    },
    setSelectedPiece: (piece) =>
      set({
        selectedPiece: piece,
      }),
    scoreSelectionMode: "imslp",
    setScoreSelectionMode: (mode) =>
      set({
        scoreSelectionMode: mode,
      }),
    showImslpTab: true,
    hideImslpTab: () =>
      set({
        showImslpTab: false,
        scoreSelectionMode: "input",
      }),
    setUploadedScoreFiles: (files) =>
      set({
        uploadedScoreFiles: files,
      }),
    mode: () => {
      const scoreSelectionMode = get().scoreSelectionMode;
      if (scoreSelectionMode === "imslp") return undefined;

      if (scoreSelectionMode === "upload") {
        const files = Array.from(get().uploadedScoreFiles ?? []);

        return files.some(isPDF)
          ? "pdf"
          : files.some(isImage)
            ? "images"
            : undefined;
      } else {
        const scoreUrls = get().scoreUrls ?? [];

        return scoreUrls.some(isPDF)
          ? "pdf"
          : scoreUrls.some(isImage)
            ? "images"
            : undefined;
      }
    },
    imslpScores: [],
    setImslpScores: (scores) =>
      set({
        imslpScores: scores,
      }),
    setSelectedImslpScore: (score) =>
      set({
        selectedImslpScore: score,
      }),
    scoreUrls: [],
    setScoreUrls: (urls) =>
      set({
        scoreUrls: urls,
      }),

    resetPieceSelection: () =>
      set({
        step: 0,
        selectedPiece: undefined,
      }),
    resetScoreSelection: () =>
      set({
        imslpScores: [],
        selectedImslpScore: undefined,
        scoreUrls: [],
        uploadedScoreFiles: undefined,
        showImslpTab: true,
        scoreSelectionMode: "imslp",
      }),
  }));
