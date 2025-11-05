"use client";

import { Button } from "@heroui/button";

import { ArrowLeft } from "lucide-react";

import NextLink from "next/link";

import type { Route } from "next";
import type { FC, ReactNode } from "react";

const DashboardLayout: FC<{
  children: ReactNode;
  actionNode?: ReactNode;
  backHref?: Route;
  title: string;
}> = ({ children, title, actionNode, backHref }) => {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between py-4 border-b border-divider">
        <div className="flex items-center gap-4">
          {backHref && (
            <Button as={NextLink} href={backHref} isIconOnly variant="light">
              <ArrowLeft />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-default-900">{title}</h1>
        </div>

        {actionNode}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DashboardLayout;
