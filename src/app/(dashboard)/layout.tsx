"use client";

import { DashboardLayout as _DashboardLayout } from "@toolpad/core/DashboardLayout";
import LinearProgress from "@mui/material/LinearProgress";

import { Suspense } from "react";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <_DashboardLayout>
      <Suspense fallback={<LinearProgress />}>{children}</Suspense>
    </_DashboardLayout>
  );
}
