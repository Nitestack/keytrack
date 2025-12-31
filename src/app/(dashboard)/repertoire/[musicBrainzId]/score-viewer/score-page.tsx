import { cn } from "@heroui/react";

import type { FC, HTMLAttributes, ReactNode } from "react";

const ScorePage: FC<
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    pageNum: number;
    isThumbnail?: boolean;
  }
> = ({ children, pageNum, isThumbnail, ...props }) => {
  return (
    <div
      {...props}
      className={cn(props.className, {
        relative: isThumbnail,
      })}
    >
      {children}
      {isThumbnail && (
        <div className="absolute bottom-0 right-0 left-0 z-10 bg-black/60 px-1 py-0.5 text-[0.75em] text-white">
          {pageNum}
        </div>
      )}
    </div>
  );
};

export default ScorePage;
