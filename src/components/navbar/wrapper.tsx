"use client";

import { Navbar } from "@heroui/navbar";
import { cn } from "@heroui/react";

import { useState } from "react";

import type { FC, ReactNode } from "react";

const NavbarWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar
      classNames={{
        base: cn("border-default-100 bg-transparent", {
          "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
        }),
        wrapper: "w-full justify-center",
        item: "hidden md:flex",
      }}
      height="60px"
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {children}
    </Navbar>
  );
};

export default NavbarWrapper;
