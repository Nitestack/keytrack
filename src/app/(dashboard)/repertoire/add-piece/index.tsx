"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/use-disclosure";

import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { orpc } from "~/api/react";
import FileUpload from "~/app/(dashboard)/repertoire/add-piece/file-upload";
import IMSLPDiscover from "~/app/(dashboard)/repertoire/add-piece/imslp-discover";
import ScoreURL from "~/app/(dashboard)/repertoire/add-piece/score-url";
import SearchPiece from "~/app/(dashboard)/repertoire/add-piece/search-piece";
import {
  addRepertoirePieceSteps,
  useAddRepertoirePieceStore,
} from "~/app/(dashboard)/repertoire/add-piece/store";
import AddPieceSummary from "~/app/(dashboard)/repertoire/add-piece/summary";
import RowSteps from "~/components/row-steps";

import type { Key } from "@react-types/shared";
import type { FC } from "react";
import type { RouterInputs } from "~/api/routers";
import type { ScoreSelectionMode } from "~/app/(dashboard)/repertoire/add-piece/store";

const AddPiece: FC = () => {
  const step = useAddRepertoirePieceStore((state) => state.step);
  const setStep = useAddRepertoirePieceStore((state) => state.setStep);
  const increaseStep = useAddRepertoirePieceStore(
    (state) => state.increaseStep,
  );
  const decreaseStep = useAddRepertoirePieceStore(
    (state) => state.decreaseStep,
  );
  const selectedPiece = useAddRepertoirePieceStore(
    (state) => state.selectedPiece,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.id === b.id;
    },
  );
  const mode = useAddRepertoirePieceStore((state) =>
    state.scoreSelectionMode === "imslp" ? "pdf" : state.mode(),
  );
  const uploadedScoreFiles = useAddRepertoirePieceStore(
    (state) => state.uploadedScoreFiles,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.length === b.length;
    },
  );
  const selectedImslpScoreUrl = useAddRepertoirePieceStore(
    (state) => state.selectedImslpScore?.url,
  );
  const scoreUrls = useAddRepertoirePieceStore(
    (state) => state.scoreUrls,
    (a, b) => a.length === b.length,
  );

  const canNext = useAddRepertoirePieceStore((state) => state.canNext());
  const resetPieceSelection = useAddRepertoirePieceStore(
    (state) => state.resetPieceSelection,
  );
  const resetScoreSelection = useAddRepertoirePieceStore(
    (state) => state.resetScoreSelection,
  );

  const scoreSelectionMode = useAddRepertoirePieceStore(
    (state) => state.scoreSelectionMode,
  );
  const setScoreSelectionMode = useAddRepertoirePieceStore(
    (state) => state.setScoreSelectionMode,
  );
  const showImslpTab = useAddRepertoirePieceStore(
    (state) => state.showImslpTab,
  );

  const isFirstStep = step === 0;
  const isLastStep = addRepertoirePieceSteps.length - 1 === step;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();

  const { mutate: addPiece, isPending: isAddingPiecePending } = useMutation(
    orpc.repertoire.addPiece.mutationOptions({
      onSuccess: () => {
        router.refresh();
        addToast({
          title: `Successfully added "${selectedPiece!.title}" to the repertoire.`,
          color: "success",
        });
        handleClose();
      },
    }),
  );

  function handleClose() {
    onClose();
    resetPieceSelection();
    resetScoreSelection();
  }
  async function handleNext() {
    if (!canNext) return;
    if (isLastStep && selectedPiece && mode) {
      const params: RouterInputs["repertoire"]["addPiece"] = {
        musicBrainzId: selectedPiece.id,
        scoreType: mode,
      };

      if (scoreSelectionMode === "imslp" && selectedImslpScoreUrl)
        params.imslpIndexUrl = selectedImslpScoreUrl;
      else if (scoreSelectionMode === "input") {
        if (mode === "pdf") params.pdfUrl = scoreUrls[0]!;
        else params.imageUrls = scoreUrls;
      } else if (scoreSelectionMode === "upload" && uploadedScoreFiles) {
        params.files = [...uploadedScoreFiles];
      }
      addPiece(params);
    } else {
      increaseStep();
    }
  }
  function handleBack() {
    if (isFirstStep) {
      handleClose();
      return;
    }
    decreaseStep();
  }
  function handleOnStepChange(newStep: number) {
    if (step > newStep || canNext) setStep(newStep);
  }
  function handleScoreSelectionChange(value: Key) {
    setScoreSelectionMode(value as ScoreSelectionMode);
  }

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        startContent={<Plus size={16} />}
      >
        Add
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            Add Piece
            <span className="ml-1 sm:hidden">
              ({step + 1}/{addRepertoirePieceSteps.length})
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 hidden sm:block">
              <RowSteps
                steps={addRepertoirePieceSteps.map((label) => ({
                  title: label,
                }))}
                currentStep={step}
                onStepChange={handleOnStepChange}
              />
            </div>
            {step === 0 ? (
              <SearchPiece />
            ) : step === 1 ? (
              <Tabs
                fullWidth
                selectedKey={scoreSelectionMode}
                onSelectionChange={handleScoreSelectionChange}
              >
                {showImslpTab && (
                  <Tab key="imslp" title="IMSLP">
                    <IMSLPDiscover />
                  </Tab>
                )}
                <Tab key="input" title="URL">
                  <ScoreURL />
                </Tab>
                <Tab key="upload" title="Upload">
                  <FileUpload />
                </Tab>
              </Tabs>
            ) : (
              <AddPieceSummary />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleBack}>
              {isFirstStep ? "Cancel" : "Back"}
            </Button>
            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={!canNext}
              isLoading={isLastStep && isAddingPiecePending}
            >
              {isLastStep ? "Add" : "Next"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPiece;
