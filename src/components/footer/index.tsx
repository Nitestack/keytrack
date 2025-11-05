import { appName } from "~/constants";

import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer>
      <div className="container mx-auto px-6 py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
