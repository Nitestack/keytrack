"use client";

import { create } from "zustand";

/**
 * The repertoire store properties
 */
export interface RepertoireStoreProps {
  // ── Select Mode ─────────────────────────────────────────────────────
  /**
   * The current select mode state
   */
  isSelectMode: boolean;
  /**
   * Toggles the select mode state
   */
  toggleSelectMode: () => void;
  /**
   * The currently selected piece id's
   */
  selectedPieceIds: string[];
  /**
   * Toggles the selection state of a piece
   */
  toggleSelectPiece: (pieceId: string) => void;
  /**
   * Whether a piece is selected
   */
  isPieceSelected: (pieceId: string) => boolean;
}

export const useRepertoireStore = create<RepertoireStoreProps>()(
  (set, get) => ({
    isSelectMode: false,
    toggleSelectMode: () =>
      set((state) => ({
        isSelectMode: !state.isSelectMode,
      })),
    selectedPieceIds: [],
    toggleSelectPiece: (pieceId) =>
      set((state) => ({
        selectedPieceIds: state.selectedPieceIds.includes(pieceId)
          ? state.selectedPieceIds.filter((p) => p !== pieceId)
          : [...state.selectedPieceIds, pieceId],
      })),
    isPieceSelected: (pieceId: string) =>
      get().selectedPieceIds.includes(pieceId),
  }),
);
