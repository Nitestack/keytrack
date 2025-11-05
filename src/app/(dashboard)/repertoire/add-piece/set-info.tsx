"use client";

import { Alert } from "@heroui/alert";
import { DatePicker } from "@heroui/react";

import type { DateValue } from "@internationalized/date";
import type { Dispatch, FC, SetStateAction } from "react";
import type { MBWork } from "~/services/music-brainz";

const SetInfo: FC<{
  dateAdded: DateValue;
  setDateAdded: Dispatch<SetStateAction<DateValue>>;
  selectedPiece: MBWork;
}> = ({ dateAdded, setDateAdded, selectedPiece }) => {
  return (
    <>
      <Alert
        color="primary"
        title={
          <p>
            {selectedPiece.composer} - {selectedPiece.title}{" "}
            {selectedPiece.arrangement && (
              <span className="text-sm">({selectedPiece?.arrangement})</span>
            )}
          </p>
        }
      />
      <DatePicker
        fullWidth
        showMonthAndYearPickers
        label="Date added"
        value={dateAdded}
        onChange={(value) => {
          if (value) setDateAdded(value);
        }}
      />
    </>
  );
};

export default SetInfo;
