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

import type { Dispatch, FC, SetStateAction } from "react";
import type { ImslpScore } from "~/services/imslp";

const SelectScore: FC<{
  imslpResult?: {
    imslpUrl: string;
    scores: ImslpScore[];
  };
  selectedImslpScore: ImslpScore | null;
  setSelectedImslpScore: Dispatch<SetStateAction<ImslpScore | null>>;
  getImslpScores: (imslpUrl?: string) => void;
  isGetImslpScoresPending: boolean;
}> = ({
  imslpResult,
  selectedImslpScore,
  setSelectedImslpScore,
  getImslpScores,
  isGetImslpScoresPending,
}) => {
  function handleIMSLPManualURL(formData: FormData) {
    const imslpUrl = formData.get("imslp-url") as string;
    if (
      !imslpUrl.startsWith("https://") ||
      !imslpUrl.includes("imslp.org/wiki/")
    )
      return;
    getImslpScores(imslpUrl);
  }
  if (!imslpResult)
    return (
      <form action={handleIMSLPManualURL}>
        <Alert variant="outlined" severity="warning">
          The automatic search was unsuccessful, possibly because this piece has
          multiple versions on IMSLP. Please find the correct page and paste the
          link below.
        </Alert>
        <div className="mt-4 mb-2 flex items-center gap-2">
          <TextField
            type="url"
            id="imslp-url"
            name="imslp-url"
            fullWidth
            placeholder="https://imslp.org/wiki/..."
          />
          <IconButton loading={isGetImslpScoresPending} type="submit">
            <SearchIcon />
          </IconButton>
        </div>
      </form>
    );
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
        onChange={(_, newValue) => setSelectedImslpScore(newValue)}
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
};

export default SelectScore;
