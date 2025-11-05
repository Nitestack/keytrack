"use client";

import { Button } from "@heroui/button";

import { ArrowRight, X } from "lucide-react";

import NextLink from "next/link";

import type { FC } from "react";

const Banner: FC<{ content: string }> = ({ content }) => {
  return (
    <div className="border-divider bg-background/15 flex w-full items-center gap-x-3 border-b-1 px-6 py-2 backdrop-blur-xl sm:px-3.5 sm:before:flex-1">
      <p className="text-sm text-foreground">{content}&nbsp;</p>
      <Button
        as={NextLink}
        className="group text-small relative h-9 overflow-hidden bg-transparent font-normal"
        color="default"
        endContent={
          <ArrowRight
            className="flex-none outline-hidden transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-2"
            width={16}
          />
        }
        href="#"
        style={{
          border: "solid 2px transparent",
          backgroundImage: `linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        variant="bordered"
      >
        Explore
      </Button>
      <div className="flex flex-1 justify-end">
        <Button isIconOnly className="-m-1" size="sm" variant="light">
          <span className="sr-only">Close Banner</span>
          <X className="text-default-500" width={20} />
        </Button>
      </div>
    </div>
  );
};

export default Banner;
