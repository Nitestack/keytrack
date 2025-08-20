"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

import AddIcon from "@mui/icons-material/Add";

import { useRouter } from "next/navigation";
import { useState } from "react";

import dayjs from "dayjs";
import { useSnackbar } from "notistack";

import SearchPiece from "~/app/(dashboard)/repertoire/add-piece/search-piece";
import SelectScore from "~/app/(dashboard)/repertoire/add-piece/select-score";
import SetInfo from "~/app/(dashboard)/repertoire/add-piece/set-info";
import { api } from "~/trpc/react";

import type { Dayjs } from "dayjs";
import type { FC } from "react";
import type { ImslpScore } from "~/services/imslp";
import type { MBWork } from "~/services/music-brainz";

const steps = ["Search piece", "Select score", "Add general information"];

const AddPiece: FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<MBWork | null>(null);
  const [selectedImslpScore, setSelectedImslpScore] =
    useState<ImslpScore | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [dateAdded, setDateAdded] = useState<Dayjs>(dayjs());
  const isFirstStep = activeStep === 0;
  const isLastStep = steps.length - 1 === activeStep;

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: imslpResult,
    mutate: _getImslpScores,
    isPending: isGetImslpScoresPending,
    variables: lastImslpScoresVariables,
  } = api.repertoire.getImslpScores.useMutation({
    onSuccess: () => {
      if (activeStep !== 1) setActiveStep(1);
    },
  });

  const { mutate: addPiece, isPending: isAddingPiecePending } =
    api.repertoire.addPiece.useMutation({
      onSuccess: async () => {
        router.refresh();
        enqueueSnackbar(
          `Successfully added "${selectedPiece!.title}" to the repertoire.`,
          { variant: "success" },
        );
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
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
    setActiveStep(0);
    setSelectedPiece(null);
    setSelectedImslpScore(null);
    setDateAdded(dayjs());
  }
  function canNext() {
    if (activeStep === 0 && selectedPiece === null) return false;
    else if (activeStep === 1 && selectedImslpScore === null) return false;
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
        imslpUrl: selectedImslpScore!.url,
        date: dateAdded.toISOString().split("T")[0]!,
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

  return (
    <>
      <Button onClick={handleOpen} variant="contained" startIcon={<AddIcon />}>
        Add
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>
          Add Piece{" "}
          <span className="sm:hidden">
            ({activeStep + 1}/{steps.length})
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="mb-4 hidden sm:block">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          {activeStep === 0 ? (
            <SearchPiece
              selectedPiece={selectedPiece}
              setSelectedPiece={setSelectedPiece}
            />
          ) : activeStep === 1 ? (
            <SelectScore
              selectedImslpScore={selectedImslpScore}
              setSelectedImslpScore={setSelectedImslpScore}
              imslpResult={imslpResult}
              getImslpScores={getImslpScores}
              isGetImslpScoresPending={isGetImslpScoresPending}
            />
          ) : (
            <SetInfo
              selectedPiece={selectedPiece!}
              selectedImslpScore={selectedImslpScore!}
              dateAdded={dateAdded}
              setDateAdded={setDateAdded}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleBack}>
            {isFirstStep ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canNext()}
            loading={
              (activeStep === 0 && isGetImslpScoresPending) ||
              (isLastStep && isAddingPiecePending)
            }
          >
            {isLastStep ? "Add" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPiece;
