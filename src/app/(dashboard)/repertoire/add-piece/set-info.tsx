"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import type { Dayjs } from "dayjs";
import type { Dispatch, FC, SetStateAction } from "react";
import type { Work } from "~/server/api/routers/repertoire";
import type { ImslpScore } from "~/services/imslp";

const SetInfo: FC<{
  dateAdded: Dayjs;
  setDateAdded: Dispatch<SetStateAction<Dayjs>>;
  selectedPiece: Work;
  selectedImslpScore: ImslpScore;
}> = ({ dateAdded, setDateAdded, selectedPiece, selectedImslpScore }) => {
  return (
    <>
      <Alert variant="outlined" severity="info">
        {selectedPiece.composer} - {selectedPiece.title}{" "}
        {selectedPiece.arrangement && (
          <Typography variant="caption">
            ({selectedPiece?.arrangement})
          </Typography>
        )}
        <br />
        {selectedImslpScore.publisher.name}
        {selectedImslpScore.publisher.date
          ? `, ${selectedImslpScore.publisher.date}`
          : ""}
        {selectedImslpScore.isUrtext ? " (Urtext Edition)" : ""}
      </Alert>
      <DatePicker
        label="Date added"
        value={dateAdded}
        onChange={(value) => {
          if (value) setDateAdded(value);
        }}
        slotProps={{
          textField: {
            margin: "normal",
            required: true,
            fullWidth: true,
          },
        }}
      />
    </>
  );
};

export default SetInfo;
