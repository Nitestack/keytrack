import { User } from "@heroui/user";

import type { FC } from "react";

const RepertoireGridItemUserContent: FC<{
  title: string;
  composer: string;
  arrangement?: string;
}> = ({ title, composer, arrangement }) => (
  <User
    avatarProps={{
      name: composer,
      classNames: {
        base: "hidden",
      },
    }}
    name={`${title}${arrangement ? ` (${arrangement})` : ""}`}
    description={composer}
  />
);

export default RepertoireGridItemUserContent;
