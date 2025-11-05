"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

import { useRouter } from "next/navigation";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { Route } from "next";
import type { FC, ReactNode } from "react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

const Providers: FC<{ bodyClassName: string; children: ReactNode }> = ({
  bodyClassName,
  children,
}) => {
  const router = useRouter();
  return (
    <HeroUIProvider
      navigate={(path, routerOptions) =>
        router.push(path as Route, routerOptions)
      }
      className={bodyClassName}
    >
      <NextThemesProvider attribute="class" enableSystem defaultTheme="system">
        <ToastProvider />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

export default Providers;
