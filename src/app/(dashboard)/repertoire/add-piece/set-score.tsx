"use client";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";

import { useState } from "react";

import type { Dispatch, FC, SetStateAction } from "react";
import type { ImslpScore } from "~/services/imslp";

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
  function handleImslpScoreSelect(newImslpScore: ImslpScore | null) {
    if (newImslpScore) setPdfUrl(newImslpScore.url);
    setSelectedImslpScore(newImslpScore);
  }
  if (imslpResult && imslpResult.scores.length > 1)
    return (
      <>
        <Alert variant="outlined" severity="info">
          Unsure which to choose?{" "}
          <Link underline="none" target="_blank" href={imslpResult.imslpUrl}>
            Preview the scores on IMSLP <OpenInNewIcon fontSize="small" />
          </Link>
          .
          <br />
          To help you find an authentic version,{" "}
          <span className="font-bold">Urtext Edition</span> scores are listed
          first.
        </Alert>
        <Autocomplete
          clearOnBlur={false}
          noOptionsText="No scores found"
          handleHomeEndKeys
          fullWidth
          value={selectedImslpScore}
          onChange={(_, newValue) => handleImslpScoreSelect(newValue)}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          options={imslpResult.scores}
          groupBy={(option) =>
            option.isUrtext ? "Urtext Edition" : option.publisher.name
          }
          getOptionLabel={(option) =>
            `${option.publisher.name} - ${option.title}${option.isUrtext ? " (Urtext Edition)" : ""}`
          }
          renderOption={({ key, ...optionProps }, option) => (
            <ListItem key={key + option.id} {...optionProps}>
              <ListItemText
                primary={option.title}
                secondary={[
                  option.isUrtext ? option.publisher.name : undefined,
                  option.publisher.date,
                  option.pages,
                  option.fileSize,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              />
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              placeholder="Select a score"
              helperText="Powered by IMSLP"
            />
          )}
        />
      </>
    );
  else
    return (
      <>
        <Alert variant="outlined" severity="warning">
          We couldn&apos;t find the score automatically, possibly because this
          piece has multiple versions on IMSLP. Please paste a link to either
          the correct <span className="font-bold">IMSLP page</span> or a direct{" "}
          <span className="font-bold">PDF score</span> below.
        </Alert>
        <div className="mt-4 mb-2 flex items-center gap-2">
          <TextField
            type="url"
            id="url"
            name="url"
            fullWidth
            placeholder="Paste IMSLP or PDF URL"
            value={pdfInput}
            onChange={(event) => handlePdfInput(event.target.value)}
          />
          {pdfInput.includes("imslp.org/wiki/") && (
            <IconButton
              loading={isGetImslpScoresPending}
              onClick={handleManualImslpScore}
              type="submit"
            >
              <SearchIcon />
            </IconButton>
          )}
        </div>
      </>
    );
};

export default SetScore;
