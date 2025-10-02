import type { Navigation } from "@toolpad/core/AppProvider";

export const navigation: Navigation = [
  {
    segment: "repertoire",
    title: "Repertoire",
    pattern: "repertoire{/:musicBrainzId}*",
  },
];
