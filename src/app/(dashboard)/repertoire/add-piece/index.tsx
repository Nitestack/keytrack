"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/use-disclosure";

import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getLocalTimeZone, today } from "@internationalized/date";

import SearchPiece from "~/app/(dashboard)/repertoire/add-piece/search-piece";
import SetInfo from "~/app/(dashboard)/repertoire/add-piece/set-info";
import SetScore from "~/app/(dashboard)/repertoire/add-piece/set-score";
import RowSteps from "~/components/row-steps";
import { api } from "~/trpc/react";

import type { DateValue } from "@internationalized/date";
import type { FC } from "react";
import type { MBWork } from "~/services/music-brainz";

const steps = ["Search piece", "Set score", "Add information"];

const AddPiece: FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<MBWork | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [dateAdded, setDateAdded] = useState<DateValue>(
    today(getLocalTimeZone()),
  );
  const isFirstStep = activeStep === 0;
  const isLastStep = steps.length - 1 === activeStep;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();

  const {
    data: imslpResult,
    mutate: _getImslpScores,
    isPending: isGetImslpScoresPending,
    variables: lastImslpScoresVariables,
  } = api.repertoire.getImslpScores.useMutation({
    onSuccess: (newImslpResult) => {
      if (newImslpResult && newImslpResult.scores.length < 1)
        addToast({
          title: "Couldn't find any scores to the IMSLP url.",
          color: "danger",
        });
      if (activeStep !== 1) setActiveStep(1);
    },
  });

  const { mutate: addPiece, isPending: isAddingPiecePending } =
    api.repertoire.addPiece.useMutation({
      onSuccess: async () => {
        router.refresh();
        addToast({
          title: `Successfully added "${selectedPiece!.title}" to the repertoire.`,
          color: "success",
        });
        handleClose();
      },
    });

  function getImslpScores(imslpUrl?: string) {
    if (
      selectedPiece &&
      (imslpUrl
        ? lastImslpScoresVariables?.imslpUrl !== imslpUrl
        : lastImslpScoresVariables?.musicBrainzId !== selectedPiece.id)
    )
      _getImslpScores({ musicBrainzId: selectedPiece.id, imslpUrl });
    else setActiveStep(1);
  }
  function handleClose() {
    onClose();
    setActiveStep(0);
    setSelectedPiece(null);
    setPdfUrl(null);
    setDateAdded(today(getLocalTimeZone()));
  }
  function canNext() {
    if (activeStep === 0 && selectedPiece === null) return false;
    else if (activeStep === 1 && pdfUrl === null) return false;
    else if (activeStep === 2 && dateAdded === null) return false;
    return true;
  }
  function handleNext() {
    if (!canNext()) return;
    if (activeStep === 0) {
      getImslpScores();
      return;
    } else if (isLastStep) {
      addPiece({
        musicBrainzId: selectedPiece!.id,
        pdfUrl: pdfUrl!,
        date: dateAdded.toString().split("T")[0]!,
      });
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  function handleBack() {
    if (isFirstStep) {
      handleClose();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  function handleOnStepChange(step: number) {
    if (activeStep > step || canNext()) setActiveStep(step);
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
              ({activeStep + 1}/{steps.length})
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 hidden sm:block">
              <RowSteps
                steps={steps.map((label) => ({
                  title: label,
                }))}
                currentStep={activeStep}
                onStepChange={handleOnStepChange}
              />
            </div>
            {activeStep === 0 ? (
              <SearchPiece
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
              />
            ) : activeStep === 1 ? (
              <SetScore
                setPdfUrl={setPdfUrl}
                imslpResult={imslpResult}
                getImslpScores={getImslpScores}
                isGetImslpScoresPending={isGetImslpScoresPending}
              />
            ) : (
              <SetInfo
                selectedPiece={selectedPiece!}
                dateAdded={dateAdded}
                setDateAdded={setDateAdded}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleBack}>
              {isFirstStep ? "Cancel" : "Back"}
            </Button>
            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={!canNext()}
              isLoading={
                (activeStep === 0 && isGetImslpScoresPending) ||
                (isLastStep && isAddingPiecePending)
              }
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
