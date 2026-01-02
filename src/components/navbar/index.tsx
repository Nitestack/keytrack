import { NavbarMenuToggle } from "@heroui/navbar";

import { headers } from "next/headers";

import NavbarAccount from "~/components/navbar/account";
import NavbarBrand from "~/components/navbar/brand";
import NavbarLinks from "~/components/navbar/links";
import NavbarMobile from "~/components/navbar/mobile";
import NavbarWrapper from "~/components/navbar/wrapper";
import { auth } from "~/lib/auth/server";

import type { FC } from "react";

const Navbar: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <NavbarWrapper>
      <NavbarBrand />
      <NavbarLinks />
      <NavbarAccount initialUser={session?.user} />
      <NavbarMenuToggle className="text-default-400 md:hidden" />
      <NavbarMobile />
    </NavbarWrapper>
  );
};

export default Navbar;
