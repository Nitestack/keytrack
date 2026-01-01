"use client";

import { useEffect, useState } from "react";

import { useController } from "yet-another-react-lightbox";

export function useLightboxPortalTarget() {
  const { containerRef, containerRect } = useController();
  const [target, setTarget] = useState<HTMLElement>();

  useEffect(() => {
    if (containerRef.current) {
      setTarget(containerRef.current);
    }
  }, [containerRect, containerRef]);

  return target;
}
