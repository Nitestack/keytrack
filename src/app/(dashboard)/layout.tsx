"use client";

import { DashboardLayout as _DashboardLayout } from "@toolpad/core/DashboardLayout";
import LinearProgress from "@mui/material/LinearProgress";

import { Suspense } from "react";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <_DashboardLayout>
      <Suspense fallback={<LinearProgress />}>{children}</Suspense>
    </_DashboardLayout>
  );
}
