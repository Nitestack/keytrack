"use client";

import { NavbarBrand as HeroUINavbarBrand } from "@heroui/navbar";

import NextImage from "next/image";
import NextLink from "next/link";

import { appName } from "~/constants";

import type { FC } from "react";

const NavbarBrand: FC = () => {
  return (
    <HeroUINavbarBrand as={NextLink} href="/" className="gap-2">
      <NextImage src="/logo.png" alt={appName} width={34} height={34} />
      <p className="font-bold text-inherit">{appName}</p>
    </HeroUINavbarBrand>
  );
};

export default NavbarBrand;
