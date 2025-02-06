import * as React from "react";

import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// import Elevator from "./components/structures/Elevator";
// import FirstFloor from "./floors/FirstFloor";
// import GroundFloor from "./floors/GroundFloor";
// import SecondFloor from "./floors/SecondFloor";
import Elevator from "./components/structures/Elevator";
import { MovingTile } from "./components/structures/MovingTile";

function App() {

  const claimBadge = (e: any) => {
    fetch("http://localhost:8080/api/badge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ badgeId: 'test', connectionId: e.detail.connectionId }),
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
    })
    .catch(error => {
      // console.error("Error fetching badge:", error);
    });
  }
  return (
    <>
      <m-audio
        src="https://mmlstorage.com/ff71e9082049d723ced2ba57b852e72b12d84497a3bdb27c0170f1b46844f75e"
        loop="true"
        volume="1"
        y={500}
      ></m-audio>
      <m-light
        intensity="5000000"
        color="grey"
        y="1000"
        z="100"
        x="100"
      ></m-light>
      <m-group ry={180} z={10}>
        <m-model
          id="environment"
          src="https://mmlstorage.com/6be8c5809d43537dcc36bc07697249031defb8ce4efe85021d0a34c78ee49aa6"
          sx={2}
          sy={2}
          sz={2}
          z={-55}
          x={28}
          y={-40}
        ></m-model>
        {/* <m-model
          id="buggy"
          src="https://mmlstorage.com/eab3fd8e5214be99982c428b5301571194c423cadc2adafddd394480a8c574e6"
          sx={0.225}
          sy={0.225}
          sz={0.225}
          x={-3.5}
          y={2.4}
          z={-55}
        ></m-model> */}
        <m-model
          onClick={claimBadge}
          id="cannon"
          src="https://mmlstorage.com/02009524a2a20ec74eb90083a5b49711e81be65e9c262fb4f2a6d8eb692bb45c"
          sx={2}
          sy={2}
          sz={2}
          ry={-90}
          x={-40}
          y={-14}
          z={-25}
        ></m-model>
        <m-model  
          sx={0.2}
          sy={0.2}
          sz={0.2}
          ry={-90}
          x={48}
          y={28}
          z={-20}
          src="https://mmlstorage.com/48b6358bf53f9f5ad951c0de6a883f3cf888d752ffa406c32b99e2263fde9df5"></m-model>
        <m-model  
          sx={0.2}
          sy={0.2}
          sz={0.2}
          ry={-90}
          x={70}
          y={32}
          z={-105}
          src="https://mmlstorage.com/48b6358bf53f9f5ad951c0de6a883f3cf888d752ffa406c32b99e2263fde9df5"></m-model>
        <m-group
          ry={-90}
          x={70}
          y={27}
          z={-20}
        >
          <m-video loop="true" width="0.8" src="https://mmlstorage.com/bbca01e11115aeb6774a989a1f4f28021573a5fb0e7ab8ff624b36299648fd6a" y="500.233" x="7.024" z="-5.804" rx="-12"></m-video>
          <m-model sx="2" sy="10" sz="2" src="https://mmlstorage.com/dbaf573c20d5f133a05520e9df0b914d79c3ab255e851fd95c8ffd39be70e05d"></m-model>
          <m-model sx="0.3" sy="0.3" sz="0.3" y="499" x="5" z="-5.679" src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9">
          </m-model>
          <m-model sx="0.3" sy="0.3" sz="0.3" y="499" x="6" z="-5.686" src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9">
          </m-model>
          <m-model sx="0.3" sy="0.3" sz="0.3" y="499" x="7" z="-5.707" src="https://mmlstorage.com/ba1bfd35efe77d6ce14030ae533e3fbc3e38eb91549db071f3e5bca055b65eb9">
          </m-model>
          
          <m-group ry="90" x="18" y="501.088" z="-5" sx={4} sy={4} sz={4}>
            <MovingTile duration={5000}></MovingTile>
            <MovingTile duration={6000} x="2" y="1"></MovingTile>
            <MovingTile duration={4000} x="0" y="2"></MovingTile>
            <MovingTile duration={7000} x="1" y="3"></MovingTile>
            <MovingTile duration={8000} x="2.5" y="4"></MovingTile>
            <MovingTile duration={7000} x="2" y="6"></MovingTile>
            <m-cube onClick={claimBadge} height="0.6" color="black" y="4" z="-1.4" x="2"></m-cube>
            
            <m-image height="0.5" src="https://mmlstorage.com/afad7fa2b0727d718f0865d9704b2527f3738769609d4b60b6714d7ddadb3050" y="4" z="-1.901" x="2"></m-image>

          </m-group>
        </m-group>
        <Elevator levels={250}   
          x={83}
          y={28}
          z={-20}
          ry={146}
        >
        </Elevator>
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
