"use client";

import { Button } from "@heroui/button";

import NextLink from "next/link";

import { signIn, useSession } from "next-auth/react";

import type { FC } from "react";

const HeroButton: FC = () => {
  const { status } = useSession();
  return status === "authenticated" ? (
    <Button
      as={NextLink}
      href="/repertoire"
      className="bg-default-foreground text-small text-background h-10 w-[163px] px-[16px] py-[10px] leading-5 font-medium"
      radius="full"
    >
      Continue
    </Button>
  ) : (
    <Button
      className="bg-default-foreground text-small text-background h-10 w-[163px] px-[16px] py-[10px] leading-5 font-medium"
      radius="full"
      onPress={() => signIn("google", { redirectTo: "/repertoire" })}
      isLoading={status === "loading"}
    >
      Get Started
    </Button>
  );
};

export default HeroButton;
