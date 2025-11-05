"use client";

import { Button } from "@heroui/button";
import { NavbarMenuItem } from "@heroui/navbar";
import { User } from "@heroui/user";

import { signIn, signOut, useSession } from "next-auth/react";

import type { FC } from "react";

const NavbarMobileAccount: FC = () => {
  const { data: session } = useSession();
  return (
    <>
      {session && (
        <NavbarMenuItem>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: session.user.image ?? undefined,
            }}
            className="transition-transform"
            description={session.user.email ?? undefined}
            name={session.user.name ?? undefined}
          />
        </NavbarMenuItem>
      )}
      <NavbarMenuItem className="mb-4">
        <Button
          fullWidth
          className={session ? "bg-red-500" : "bg-foreground text-background"}
          onPress={() => {
            if (session) void signOut();
            else void signIn("google", { redirectTo: "/repertoire" });
          }}
        >
          {session ? "Log Out" : "Get Started"}
        </Button>
      </NavbarMenuItem>
    </>
  );
};

export default NavbarMobileAccount;
