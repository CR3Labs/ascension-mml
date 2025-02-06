import React from "react";

import { ElementProps } from "../../types";

export type MovingTileProps = ElementProps & { duration: number };

export function MovingTile(props: MovingTileProps) {
  return (
    <m-cube height="-0.1" color="red" {...props}>
      <m-attr-anim
        attr="x"
        duration={props.duration}
        easing="easeInOutQuad"
        loop={true}
        start={props.x}
        end={Number(props.x) - 2}
        ping-pong={true}
      />
    </m-cube>
  );
}
