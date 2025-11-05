import { type Route as LinkHref } from "next";

export const appName = "KeyTrack";
export const appDescription = `${appName} is a web application around the piano.`;

export interface Route {
  label: string;
  href: LinkHref;
}

export const routes: Route[] = [
  {
    label: "Repertoire",
    href: "/repertoire",
  },
];
