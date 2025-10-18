"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useOptimistic } from "react";

import type { FC, ReactNode } from "react";

const viewKey = "view";

const RepertoireFilter: FC<{ listView: ReactNode; gridView: ReactNode }> = ({
  listView,
  gridView,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentView, setCurrentView] = useOptimistic(
    searchParams.get(viewKey) ?? "grid",
  );

  const handleView = useCallback(
    (newView: string | null) => {
      if (newView !== null) {
        startTransition(() => {
          setCurrentView(newView);
          const params = new URLSearchParams(searchParams.toString());
          params.set(viewKey, newView);
          router.push(`?${params.toString()}`, { scroll: false });
        });
      }
    },
    [searchParams, router, setCurrentView],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={(_, newView) => handleView(newView as "string")}
          size="small"
        >
          <ToggleButton value="grid">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <FilterListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {currentView === "list" ? listView : gridView}
    </div>
  );
};

export default RepertoireFilter;
