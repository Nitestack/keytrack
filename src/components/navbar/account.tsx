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

import { useRouter } from "next/navigation";

import { auth, signIn } from "~/lib/auth/client";

import type { FC } from "react";
import type { ServerSession } from "~/lib/auth/server";

const NavbarAccount: FC<{ initialUser?: ServerSession["user"] }> = ({
  initialUser,
}) => {
  const { data: session, isPending } = auth.useSession();
  const router = useRouter();

  const user = isPending ? initialUser : session?.user;

  return (
    <NavbarContent className="hidden md:flex" justify="end">
      <NavbarItem className="ml-2">
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: user.image ?? undefined,
                }}
                className="transition-transform"
                description={user.email}
                name={user.name}
              />
            </DropdownTrigger>
            <DropdownMenu
              className="text-center"
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownItem
                key="profile"
                className="gap-2"
                textValue={`Signed in as ${user.name}`}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.name}</p>
                <p>{user.email}</p>
              </DropdownItem>
              <DropdownItem
                onPress={() =>
                  auth.signOut({
                    fetchOptions: {
                      onSuccess: () => router.push("/"),
                    },
                  })
                }
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
            onPress={signIn}
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
