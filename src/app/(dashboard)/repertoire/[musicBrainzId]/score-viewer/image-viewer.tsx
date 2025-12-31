import { Image } from "@heroui/image";
import { cn } from "@heroui/react";

import { memo } from "react";

import ScorePage from "~/app/(dashboard)/repertoire/[musicBrainzId]/score-viewer/score-page";

import type { CSSProperties, FC } from "react";

const ImageViewer: FC<{
  imageUrls: string[];
  pageIndex: number;
  nextPageIndex?: number;
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  isThumbnail?: boolean;
}> = ({ imageUrls, height, width, pageIndex, nextPageIndex, isThumbnail }) => {
  const indices = [pageIndex, nextPageIndex].filter(Boolean);

  return (
    <div className="flex size-full items-center justify-center gap-1">
      {indices.map((pageNum) => (
        <ScorePage
          key={pageNum}
          pageNum={pageNum}
          isThumbnail={isThumbnail}
          className="flex items-center justify-center"
          style={{
            height,
            width,
          }}
        >
          <Image
            src={imageUrls[pageNum - 1]}
            alt={`Page ${pageNum}`}
            classNames={{
              wrapper: "size-full rounded-none",
              img: cn(
                "size-full object-contain rounded-none pointer-events-none",
                nextPageIndex
                  ? {
                      "object-right": pageNum === pageIndex,
                      "object-left": pageNum === nextPageIndex,
                    }
                  : "object-center",
              ),
            }}
            height={height}
            width={width}
          />
        </ScorePage>
      ))}
    </div>
  );
};

export default memo(ImageViewer);
