"use client";

import NextLink from "next/link";

import RepertoireGridItemCard from "~/app/(dashboard)/repertoire/grid-item/card";
import { useRepertoireStore } from "~/app/(dashboard)/repertoire/store";

import type { FC } from "react";
import type { RepertoirePiece } from "~/services/repertoire";

const RepertoireGridItemComponent: FC<RepertoirePiece> = (props) => {
  const isSelectMode = useRepertoireStore((state) => state.isSelectMode);
  return isSelectMode ? (
    <RepertoireGridItemCard {...props} />
  ) : (
    <NextLink href={`/repertoire/${props.id}`} passHref>
      <RepertoireGridItemCard {...props} />
    </NextLink>
  );
};

export default RepertoireGridItemComponent;
