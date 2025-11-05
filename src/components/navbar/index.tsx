import { NavbarMenuToggle } from "@heroui/navbar";

import NavbarAccount from "~/components/navbar/account";
import NavbarBrand from "~/components/navbar/brand";
import NavbarLinks from "~/components/navbar/links";
import NavbarMobile from "~/components/navbar/mobile";
import NavbarWrapper from "~/components/navbar/wrapper";

import type { FC } from "react";

const Navbar: FC = () => {
  return (
    <NavbarWrapper>
      <NavbarBrand />
      <NavbarLinks />
      <NavbarAccount />
      <NavbarMenuToggle className="text-default-400 md:hidden" />
      <NavbarMobile />
    </NavbarWrapper>
  );
};

export default Navbar;
