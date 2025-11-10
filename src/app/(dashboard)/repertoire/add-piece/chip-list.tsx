import { Alert } from "@heroui/alert";
import { Chip } from "@heroui/chip";

import {
  FileIcon,
  FileImage,
  Link,
  Music,
  ScrollText,
  Upload,
} from "lucide-react";

import { useAddRepertoirePieceStore } from "~/app/(dashboard)/repertoire/add-piece/store";

import type { FC } from "react";

const ChipList: FC<{
  onClose?: (item: string) => void;
  showWarning?: boolean;
}> = ({ onClose, showWarning }) => {
  const type = useAddRepertoirePieceStore((state) => state.scoreSelectionMode);
  const mode = useAddRepertoirePieceStore((state) => state.mode());
  const items = useAddRepertoirePieceStore(
    (state) =>
      state.scoreSelectionMode !== "imslp"
        ? state.scoreSelectionMode === "upload"
          ? state.uploadedScoreFiles
            ? Array.from(state.uploadedScoreFiles).map((file) => file.name)
            : undefined
          : state.scoreUrls
        : undefined,
    (a, b) => {
      if (a === undefined && b === undefined) return true;
      if (a === undefined || b === undefined) return false;
      return a.length === b.length;
    },
  );
  const selectedImslpScore = useAddRepertoirePieceStore(
    (state) => state.selectedImslpScore,
  );
  const action = type === "upload" ? "Upload" : "Enter";
  const inputType = type === "upload" ? "file" : "URL";

  function handleOnClose(name: string) {
    return () => onClose?.(name);
  }

  return (
    <>
      <div className="text-small flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {(type === "imslp" || mode) && (
            <Chip
              startContent={
                type === "imslp" ? (
                  <Music size={14} />
                ) : type === "upload" ? (
                  <Upload size={14} />
                ) : (
                  <Link size={14} />
                )
              }
              color={type === "imslp" ? "primary" : "secondary"}
              variant="flat"
            >
              <span className="font-bold">
                {type === "imslp" ? "IMSLP" : mode === "pdf" ? "PDF" : "Images"}
              </span>
            </Chip>
          )}
          {type === "imslp" && selectedImslpScore && (
            <Chip startContent={<ScrollText size={14} />} size="sm">
              {selectedImslpScore.title}
              {" • "}
              {selectedImslpScore.publisher.name}
              {" • "}
              {selectedImslpScore.pages}
            </Chip>
          )}
          {items?.length === 1 && (
            <Chip
              key={items[0]}
              startContent={<FileIcon size={14} />}
              onClose={onClose ? handleOnClose(items[0]!) : undefined}
              size="sm"
            >
              {items[0]!}
            </Chip>
          )}
        </div>
        {(items?.length ?? 0) > 1 && (
          <div className="text-default-400 flex flex-wrap gap-0.5">
            {items!.map((item) => (
              <Chip
                key={item}
                startContent={<FileImage size={14} />}
                onClose={handleOnClose(item)}
                size="sm"
              >
                {item}
              </Chip>
            ))}
          </div>
        )}
      </div>
      {showWarning && type !== "imslp" && (
        <Alert
          color="primary"
          title={
            <ul className="text-tiny text-default-600 space-y-1 list-inside">
              <li>
                <span className="font-bold">PDF:</span> {action} exactly one PDF{" "}
                {inputType} (which can have multiple pages)
              </li>
              <li>
                <span className="font-bold">Images:</span> {action} one or more
                image {inputType}s (JPG, PNG, WEBP); one image per page
              </li>
              <li>
                Cannot mix PDF and image {inputType}
                {type === "upload" ? "s" : "'s"}
              </li>
            </ul>
          }
        />
      )}
    </>
  );
};

export default ChipList;
