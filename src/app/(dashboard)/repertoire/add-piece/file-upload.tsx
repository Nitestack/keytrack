"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";

import { Upload } from "lucide-react";

import { useRef, useState } from "react";

import ChipList from "~/app/(dashboard)/repertoire/add-piece/chip-list";
import {
  useAddRepertoirePieceStore,
  validateItems,
} from "~/app/(dashboard)/repertoire/add-piece/store";
import { SUPPORTED_IMAGE_FORMATS } from "~/services/file-types";

import type { ChangeEvent, FC } from "react";

const FileUpload: FC = () => {
  const uploadedScoreFiles = useAddRepertoirePieceStore(
    (state) => state.uploadedScoreFiles,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.length === b.length;
    },
  );
  const setUploadedScoreFiles = useAddRepertoirePieceStore(
    (state) => state.setUploadedScoreFiles,
  );
  const [error, setError] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    setError(undefined);
    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      const dataTransfer = new DataTransfer();
      for (const file of [uploadedScoreFiles, files].flatMap((list) =>
        list ? [...list] : [],
      )) {
        dataTransfer.items.add(file);
      }
      if (validateItems("upload", dataTransfer.files, setError))
        setUploadedScoreFiles(dataTransfer.files);
    }
  }

  function handleRemoveFile(fileName: string) {
    const dataTransfer = new DataTransfer();
    if (uploadedScoreFiles)
      for (const file of uploadedScoreFiles) {
        if (file.name !== fileName) dataTransfer.items.add(file);
      }
    setUploadedScoreFiles(dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        multiple
        accept={[...SUPPORTED_IMAGE_FORMATS, ".pdf"].join(",")}
        onChange={handleFileChange}
      />
      <Button
        fullWidth
        color="primary"
        startContent={<Upload size={16} />}
        onPress={handleUploadClick}
      >
        Upload
      </Button>
      {error && <Alert hideIcon color="danger" description={error} />}
      <ChipList onClose={handleRemoveFile} showWarning />
    </div>
  );
};

export default FileUpload;
