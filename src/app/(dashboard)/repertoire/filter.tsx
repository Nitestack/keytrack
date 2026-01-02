"use client";

import { Button, ButtonGroup } from "@heroui/button";

import { LayoutGrid, List } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useOptimistic } from "react";

import RepertoireSelect from "~/app/(dashboard)/repertoire/select";

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
      <div className="flex justify-end gap-4">
        <RepertoireSelect />
        <ButtonGroup>
          <Button
            aria-label="Grid view"
            isIconOnly
            isDisabled={currentView === "grid"}
            onPress={() => handleView("grid")}
          >
            <LayoutGrid />
          </Button>
          <Button
            aria-label="List view"
            isIconOnly
            isDisabled={currentView === "list"}
            onPress={() => handleView("list")}
          >
            <List />
          </Button>
        </ButtonGroup>
      </div>
      {currentView === "list" ? listView : gridView}
    </div>
  );
};

export default RepertoireFilter;
