"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import type { Dayjs } from "dayjs";
import type { Dispatch, FC, SetStateAction } from "react";
import type { MBWork } from "~/services/music-brainz";

const SetInfo: FC<{
  dateAdded: Dayjs;
  setDateAdded: Dispatch<SetStateAction<Dayjs>>;
  selectedPiece: MBWork;
}> = ({ dateAdded, setDateAdded, selectedPiece }) => {
  return (
    <>
      <Alert variant="outlined" severity="info">
        {selectedPiece.composer} - {selectedPiece.title}{" "}
        {selectedPiece.arrangement && (
          <Typography variant="caption">
            ({selectedPiece?.arrangement})
          </Typography>
        )}
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
