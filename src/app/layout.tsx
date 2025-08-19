import "~/styles/globals.css";

import { Geist } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import AppProvider from "~/components/app-provider";
import { appDescription, appName } from "~/constants";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: appName,
  },
  description: appDescription,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <AppProvider session={session}>{children}</AppProvider>
            </AppRouterCacheProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
