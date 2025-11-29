"use client";

import { Button } from "@heroui/button";

import NextLink from "next/link";

import { auth, signIn } from "~/lib/auth/client";

import type { FC } from "react";

const HeroButton: FC = () => {
  const { data, isPending } = auth.useSession();
  return data ? (
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
      onPress={signIn}
      isLoading={isPending}
    >
      {!isPending && "Get Started"}
    </Button>
  );
};

export default HeroButton;
