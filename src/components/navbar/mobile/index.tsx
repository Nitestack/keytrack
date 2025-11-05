import { Divider } from "@heroui/divider";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";

import NextLink from "next/link";

import NavbarMobileAccount from "~/components/navbar/mobile/account";
import { routes } from "~/constants";

import type { FC } from "react";

const NavbarMobile: FC = () => {
  return (
    <NavbarMenu
      className="bg-default-200/50 shadow-medium dark:bg-default-100/50 top-[calc(var(--navbar-height)-1px)] max-h-fit pt-6 pb-6 backdrop-blur-md backdrop-saturate-150"
      motionProps={{
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: {
          ease: "easeInOut",
          duration: 0.2,
        },
      }}
    >
      <NavbarMobileAccount />
      {routes.map((route, i) => (
        <NavbarMenuItem key={route.href}>
          <NextLink
            className="text-default-500 text-md mb-2 w-full"
            href={route.href}
          >
            {route.label}
          </NextLink>
          {i < routes.length - 1 && <Divider className="opacity-50" />}
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  );
};

export default NavbarMobile;
