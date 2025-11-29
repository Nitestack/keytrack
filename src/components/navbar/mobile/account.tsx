"use client";

import { Button } from "@heroui/button";
import { NavbarMenuItem } from "@heroui/navbar";
import { User } from "@heroui/user";

import { auth, signIn } from "~/lib/auth/client";

import type { FC } from "react";

const NavbarMobileAccount: FC = () => {
  const { data: session, isPending } = auth.useSession();
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
            description={session.user.email}
            name={session.user.name}
          />
        </NavbarMenuItem>
      )}
      <NavbarMenuItem className="mb-4">
        {!isPending && (
          <Button
            fullWidth
            className={session ? "bg-red-500" : "bg-foreground text-background"}
            onPress={() => {
              if (session) void auth.signOut();
              else void signIn();
            }}
          >
            {session ? "Log Out" : "Get Started"}
          </Button>
        )}
      </NavbarMenuItem>
    </>
  );
};

export default NavbarMobileAccount;
