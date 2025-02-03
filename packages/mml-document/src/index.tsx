import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// import Elevator from "./components/structures/Elevator";
// import FirstFloor from "./floors/FirstFloor";
// import GroundFloor from "./floors/GroundFloor";
// import SecondFloor from "./floors/SecondFloor";
import Elevator from "./components/structures/Elevator";

function App() {
  return (
    <>
      <m-audio
        src="https://mmlstorage.com/ff71e9082049d723ced2ba57b852e72b12d84497a3bdb27c0170f1b46844f75e"
        loop="true"
        volume="1"
      ></m-audio>
      <m-light
        intensity="5000000"
        color="red"
        y="1000"
        z="100"
        x="100"
      ></m-light>
      <m-group ry={180} z={10}>
        <m-model
          id="environment"
          src="https://mmlstorage.com/55cfa94b7fe872eba5635798d1957947d166c8d578c389f0a4305bf6160883aa"
          sx={1}
          sy={1}
          sz={1}
          y={0}
        ></m-model>
        <m-model
          id="buggy"
          src="https://mmlstorage.com/eab3fd8e5214be99982c428b5301571194c423cadc2adafddd394480a8c574e6"
          sx={0.225}
          sy={0.225}
          sz={0.225}
          x={-3.5}
          y={2.4}
          z={-44.5}
        ></m-model>
        <m-model
          id="buggy"
          src="https://mmlstorage.com/eab3fd8e5214be99982c428b5301571194c423cadc2adafddd394480a8c574e6"
          sx={0.225}
          sy={0.225}
          sz={0.225}
          x={-3.5}
          y={2.4}
          z={-55}
        ></m-model>
        <m-model
          id="cannon"
          src="https://mmlstorage.com/02009524a2a20ec74eb90083a5b49711e81be65e9c262fb4f2a6d8eb692bb45c"
          sx={2}
          sy={2}
          sz={2}
          ry={180}
          x={2}
          y={25}
          z={-25}
        ></m-model>
        <m-model
          id="cannon"
          src="https://mmlstorage.com/02009524a2a20ec74eb90083a5b49711e81be65e9c262fb4f2a6d8eb692bb45c"
          sx={0.5}
          sy={0.5}
          sz={0.5}
          ry={110}
          x={-35}
          y={12.75}
          z={-73}
        ></m-model>
        <m-model
          id="cannon"
          src="https://mmlstorage.com/02009524a2a20ec74eb90083a5b49711e81be65e9c262fb4f2a6d8eb692bb45c"
          sx={0.5}
          sy={0.5}
          sz={0.5}
          ry={-150}
          x={21}
          y={6.65}
          z={-46.5}
        ></m-model>
        <Elevator levels={3} x={37} z={10} ry={-90} y={2} />
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
