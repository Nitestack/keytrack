"use client";

import { NavbarContent, NavbarItem } from "@heroui/navbar";
import { cn } from "@heroui/react";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "~/constants";

import type { FC } from "react";

const NavbarLinks: FC = () => {
  const pathname = usePathname();
  return (
    <NavbarContent justify="center">
      {routes.map((route) => {
        const isActive = pathname.startsWith(route.href);
        return (
          <NavbarItem
            key={route.href}
            isActive
            className="data-[active='true']:font-medium[date-active='true']"
          >
            <NextLink
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-sm",
                isActive ? "text-default-foreground" : "text-default-500",
              )}
              href={route.href}
            >
              {route.label}
            </NextLink>
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
};

export default NavbarLinks;
