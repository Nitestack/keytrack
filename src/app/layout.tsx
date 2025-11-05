import "~/styles/globals.css";

import { Geist } from "next/font/google";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Providers from "~/app/providers";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { appDescription, appName } from "~/constants";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geist.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background relative flex min-h-dvh flex-col">
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <Providers bodyClassName="flex flex-col flex-1">
              <Navbar />
              <main className="container mx-auto mt-4 mb-8 w-full grow md:mt-12 px-6 flex flex-col">
                {children}
              </main>
              <Footer />
            </Providers>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
