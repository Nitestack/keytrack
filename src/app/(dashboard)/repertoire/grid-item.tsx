"use client";

import dynamic from "next/dynamic";

const RepertoireGridItem = dynamic(() => import("./grid-item-component"), {
  ssr: false,
});

export default RepertoireGridItem;
