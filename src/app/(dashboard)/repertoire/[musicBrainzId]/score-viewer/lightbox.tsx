import LightboxComponent from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import type { FC } from "react";
import type { LightboxExternalProps } from "yet-another-react-lightbox";

const Lightbox: FC<Omit<LightboxExternalProps, "plugins">> = (props) => {
  return (
    <LightboxComponent
      plugins={[Download, Fullscreen, Thumbnails]}
      {...props}
    />
  );
};

export default Lightbox;
