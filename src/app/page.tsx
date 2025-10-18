"use client";

import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import NextLink from "next/link";

import { signIn, useSession } from "next-auth/react";

export default function HomePage() {
  const session = useSession();

  return (
    <DashboardLayout hideNavigation>
      <Box
        id="hero"
        sx={(theme) => ({
          width: "100%",
          backgroundRepeat: "no-repeat",

          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
        })}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
          >
            <Typography
              className="flex items-center flex-col sm:flex-row font-medium"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 3.5rem)",
              }}
            >
              Practice&nbsp;with&nbsp;
              <Typography
                className="font-medium"
                fontSize="inherit"
                color="primary"
                component="span"
                variant="h1"
              >
                purpose
              </Typography>
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                width: { sm: "100%", md: "80%" },
              }}
            >
              An all-in-one practice hub for managing repertoire and scores, and
              turning daily sessions into measurable progress.
            </Typography>
            {session.status === "authenticated" ? (
              <Button
                href="/repertoire"
                LinkComponent={NextLink}
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            ) : (
              <Button
                loading={session.status === "loading"}
                onClick={() =>
                  void signIn("google", {
                    redirectTo: "/repertoire",
                  })
                }
                variant="contained"
                color="primary"
              >
                Start now
              </Button>
            )}
            <Typography
              className="text-center"
              variant="caption"
              color="text.secondary"
            >
              By clicking &quot;Start now&quot; you agree to our&nbsp;
              <Link href="/tos" component={NextLink} color="primary">
                Terms & Conditions
              </Link>
              .
            </Typography>
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
