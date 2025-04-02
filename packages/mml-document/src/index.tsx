import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import Agent from "./components/Agent";
import Elevator from "./components/structures/Elevator";

function App() {
  return (
    <>
      <m-audio
        src="https://mmlstorage.com/ff71e9082049d723ced2ba57b852e72b12d84497a3bdb27c0170f1b46844f75e"
        loop="true"
        volume="1"
        y={224}
        x={-62}
        z={10}
      ></m-audio>
      <Agent
        mml={"https://cdn.other.page/m/avatar-p4g3.mml.glb"}
        y={-6}
        x={-5}
      />
      <Agent
        mml={"https://cdn.other.page/m/avatar-p4g3.mml.glb"}
        y={207.1}
        x={-67}
        z={10.5}
        ry={90}
      />
      <Agent
        mml={"https://cdn.other.page/m/avatar-n1x.mml.glb"}
        y={207.1}
        x={-56}
        z={10.2}
        ry={-90}
      />
      <m-group y={225} x={-60} z={10.2}>
        <m-light type="spotlight" intensity={1000} color="#f58905"></m-light>
        <m-light
          type="spotlight"
          intensity={1000}
          color="#f58905"
          // color="#fff"
          rx={-180}
          y={2}
        ></m-light>
      </m-group>
      <m-group ry={180} z={10}>
        <m-model
          y={-20}
          x={20}
          src="https://mmlstorage.com/001c03fdcb694c35fefac7fa5d8a2eb78326a264d7e2c589b8a745ca9b9ac53d"
        ></m-model>
        <m-model
          id="cannon"
          src="https://mmlstorage.com/02009524a2a20ec74eb90083a5b49711e81be65e9c262fb4f2a6d8eb692bb45c"
          sx={2}
          sy={2}
          sz={2}
          ry={-90}
          rz={-5}
          rx={-5}
          x={-15}
          y={-8}
          z={-10}
        ></m-model>
        <m-group x={39} y={32} z={-25} rx={-20} rz={10} ry={180}>
          <m-light type="spotlight" intensity={500} color="#f58905"></m-light>
        </m-group>
        <m-model
          sx={0.1}
          sy={0.1}
          sz={0.1}
          ry={-90}
          x={34}
          y={15.8}
          z={-24}
          src="https://mmlstorage.com/48b6358bf53f9f5ad951c0de6a883f3cf888d752ffa406c32b99e2263fde9df5"
        ></m-model>
        <m-group ry={-50} x={70} y={27} z={-20}>
          <m-video
            loop="true"
            width="0.8"
            src="https://mmlstorage.com/bbca01e11115aeb6774a989a1f4f28021573a5fb0e7ab8ff624b36299648fd6a"
            y="500.233"
            x="7.024"
            z="-5.804"
            rx="-12"
          ></m-video>
          <m-model
            sx="0.3"
            sy="0.3"
            sz="0.3"
            y="499"
            x="5"
            z="-5.679"
            src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9"
          ></m-model>
          <m-model
            sx="0.3"
            sy="0.3"
            sz="0.3"
            y="499"
            x="6"
            z="-5.686"
            src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9"
          ></m-model>
          <m-model
            sx="0.3"
            sy="0.3"
            sz="0.3"
            y="499"
            x="7"
            z="-5.707"
            src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9"
          ></m-model>

          {/* <m-group ry="90" x="18" y="501.088" z="-5" sx={4} sy={4} sz={4}>
            <MovingTile duration={5000}></MovingTile>
            <MovingTile duration={6000} x="2" y="1"></MovingTile>
            <MovingTile duration={4000} x="0" y="2"></MovingTile>
            <MovingTile duration={7000} x="1" y="3"></MovingTile>
            <MovingTile duration={8000} x="2.5" y="4"></MovingTile>
            <MovingTile duration={7000} x="2" y="6"></MovingTile>
            <m-cube
              onClick={claimBadge}
              height="0.6"
              color="black"
              y="4"
              z="-1.4"
              x="2"
            ></m-cube>
            <m-image
              height="0.5"
              src="https://mmlstorage.com/afad7fa2b0727d718f0865d9704b2527f3738769609d4b60b6714d7ddadb3050"
              y="4"
              z="-1.901"
              x="2"
            ></m-image>
          </m-group> */}
        </m-group>
        <Elevator
          levels={64}
          x={64}
          y={16}
          z={-14}
          ry={70}
          sx={2}
          sy={1.5}
          sz={2}
        ></Elevator>
        <Elevator
          levels={64}
          x={64}
          y={14.5}
          z={16}
          ry={-65}
          sx={2}
          sy={1.5}
          sz={2}
          startDirection="down"
        ></Elevator>
        <m-character src="https://mmlstorage.com/T2ez8X/1738561418908.html"></m-character>
      </m-group>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;
const root = createRoot(container);
flushSync(() => {
  root.render(<App />);
});
