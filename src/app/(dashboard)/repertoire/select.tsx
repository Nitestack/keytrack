"use client";

import { Button } from "@heroui/button";

import { useRepertoireStore } from "~/app/(dashboard)/repertoire/store";

import type { FC } from "react";

const RepertoireSelect: FC = () => {
  const isSelectMode = useRepertoireStore((state) => state.isSelectMode);
  const toggleSelectMode = useRepertoireStore(
    (state) => state.toggleSelectMode,
  );
  return (
    <Button
      onPress={toggleSelectMode}
      color="primary"
      variant={isSelectMode ? "flat" : "solid"}
    >
      {isSelectMode ? "Cancel" : "Select"}
    </Button>
  );
};

export default RepertoireSelect;
