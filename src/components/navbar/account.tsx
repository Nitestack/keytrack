"use client";

import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { NavbarContent, NavbarItem } from "@heroui/navbar";
import { User } from "@heroui/user";

import { ChevronRight } from "lucide-react";

import { signIn, signOut, useSession } from "next-auth/react";

import type { FC } from "react";

const NavbarAccount: FC = () => {
  const { data: session } = useSession();
  return (
    <NavbarContent className="hidden md:flex" justify="end">
      <NavbarItem className="ml-2">
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
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
            </DropdownTrigger>
            <DropdownMenu
              className="text-center"
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownItem key="profile" className="gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user.name}</p>
                <p>{session.user.email}</p>
              </DropdownItem>
              <DropdownItem
                onPress={() => signOut()}
                key="logout"
                color="danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            className="bg-default-foreground text-background font-medium"
            color="secondary"
            onPress={() => signIn("google", { redirectTo: "/repertoire" })}
            endContent={<ChevronRight />}
            radius="full"
            variant="flat"
          >
            Get Started
          </Button>
        )}
      </NavbarItem>
    </NavbarContent>
  );
};

export default NavbarAccount;
