import React, { useCallback, useEffect, useState } from "react";

import BasicRoom from "./BasicRoom";
import { GroupProps } from "../../types";
import SimpleSwitch from "../utils/SimpleSwitch";

type ElevatorProps = GroupProps & {
  levels: number;
  height?: number;
  externalWidth?: number;
  externalDepth?: number;
  startDirection?: "up" | "down";
};

const floorTime = 100;
const floorGap = 0.5;

export default function Elevator(props: ElevatorProps) {
  const {
    levels,
    height = 2,
    externalDepth = 3,
    externalWidth = 3,
    startDirection = "up",
    ...rest
  } = props;

  const [startTime, setStartTime] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(startDirection === "up" ? 0 : levels - 1);
  const [targetFloor, setTargetFloor] = useState(startDirection === "up" ? 0 : levels - 1);
  const [direction, setDirection] = useState<"up" | "down">(startDirection);

  const arrivalAtTargetFloorTime =
    startTime + Math.abs(currentFloor - targetFloor) * floorTime;

  const goUp = useCallback(() => {
    if ((document.timeline.currentTime as number) < arrivalAtTargetFloorTime) {
      return;
    }
    if (targetFloor < levels - 1) {
      setStartTime(document.timeline.currentTime as number);
      setCurrentFloor(targetFloor);
      setTargetFloor(targetFloor + (levels - 1));
      setDirection("down");
    }
  }, [targetFloor, levels, arrivalAtTargetFloorTime]);

  const goDown = useCallback(() => {
    if ((document.timeline.currentTime as number) < arrivalAtTargetFloorTime) {
      return;
    }
    if (targetFloor !== 0) {
      setStartTime(document.timeline.currentTime as number);
      setCurrentFloor(targetFloor);
      setTargetFloor(targetFloor - (levels - 1));
      setDirection("up");
    }
  }, [targetFloor, arrivalAtTargetFloorTime]);

  const toggleElevator = useCallback(
    (dir: "up" | "down") => {
      if (dir === "up") {
        goUp();
      } else {
        goDown();
      }
    },
    [goUp, goDown],
  );

  const startY = currentFloor * height;
  const newY = targetFloor * height;

  useEffect(() => {
    const interval = setInterval(() => toggleElevator(direction), 10000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [direction]);

  return (
    <m-group {...rest}>
      <m-group>
        <m-attr-anim
          attr="y"
          duration={Math.abs(currentFloor - targetFloor) * floorTime}
          start-time={startTime}
          easing="easeInOutQuad"
          loop={false}
          start={startY.toString(10)}
          end={newY.toString(10)}
        />
        <BasicRoom
          width={externalWidth - 0.1}
          depth={externalDepth - 0.1}
          wallColor="black"
          floorConfig={{
            color: "black",
          }}
          wallConfig={{
            height: height - floorGap,
            depth: 0.05,
            south: { invisible: true },
            north: { invisible: true },
            west: { invisible: true },
            east: { invisible: true },
          }}
        >
          <m-model
            src="https://mmlstorage.com/eb15f8eb8f27c0932ce6e0dd2df005b404d790b1c0d91cf3217149d0da8ebc56"
            sx={0.025}
            sy={0.025}
            sz={0.025}
          />
          {/* <SimpleSwitch
            x={externalWidth / 2 - 0.08}
            y={1}
            z={-0.5}
            ry={-90}
            onClick={goDown}
          />
          <SimpleSwitch
            x={externalWidth / 2 - 0.08}
            y={1}
            z={0.5}
            ry={-90}
            onClick={goUp}
            color="green"
          /> */}
        </BasicRoom>
      </m-group>
    </m-group>
  );
}
