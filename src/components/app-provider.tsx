"use client";

import { NextAppProvider } from "@toolpad/core/nextjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

import { signIn, signOut } from "next-auth/react";
import { closeSnackbar, SnackbarProvider } from "notistack";

import { appName } from "~/constants";
import theme from "~/theme";

import type { Navigation } from "@toolpad/core/AppProvider";
import type { Session } from "next-auth";
import type { FC, ReactNode } from "react";

const navigation: Navigation = [
  {
    segment: "repertoire",
    title: "Repertoire",
    pattern: "repertoire{/:musicBrainzId}*",
  },
];

const AppProvider: FC<{ children: ReactNode; session: Session | null }> = ({
  children,
  session,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider
        preventDuplicate
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        action={(snackbarId) => (
          <IconButton onClick={() => closeSnackbar(snackbarId)}>
            <CloseIcon />
          </IconButton>
        )}
      >
        <NextAppProvider
          session={session}
          branding={{ title: appName }}
          theme={theme}
          authentication={{
            signIn: () => void signIn("google"),
            signOut: () => void signOut(),
          }}
          navigation={navigation}
        >
          {children}
        </NextAppProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
};

export default AppProvider;
