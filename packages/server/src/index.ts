import fs from "fs";
import path from "path";
import url from "url";

import { Networked3dWebExperienceServer } from "@mml-io/3d-web-experience-server";
import type { CharacterDescription } from "@mml-io/3d-web-user-networking";
import cors from "cors";
import express, { json as expressJson, static as expressStatic } from "express";
import enableWs from "express-ws";

import { isPointInCube } from "./lib";
import { OtherPageAuthenticator } from "./OtherPageAuthenticator";
import { ReactMMLDocumentServer } from "./router/ReactMMLDocumentServer";
import { registerDolbyVoiceRoutes } from "./voice-routes";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.PORT || 8080;

// --- Express WS Server ----------
const { app } = enableWs(express());
app.use(expressJson());
app.enable("trust proxy");

// --- Serve assets with CORS allowing all origins ---
app.use("/assets/", cors(), expressStatic(path.resolve(dirname, "../assets/")));

// --- Dolby Voice ----------
const DOLBY_APP_KEY = process.env.DOLBY_APP_KEY ?? "";
const DOLBY_APP_SECRET = process.env.DOLBY_APP_SECRET ?? "";
if (DOLBY_APP_KEY && DOLBY_APP_SECRET) {
  registerDolbyVoiceRoutes(app, { DOLBY_APP_KEY, DOLBY_APP_SECRET });
}

// --- React MML Document Server ----------
const MML_DOCUMENT_PATH = path.join(
  dirname,
  "../../mml-document/build/index.js",
);
const mmlDocumentServer = new ReactMMLDocumentServer(MML_DOCUMENT_PATH);
app.ws("/mml-document", (ws) => {
  mmlDocumentServer.handle(ws);
});

// --- User Authentication ----------

// Specify the avatar to use here:
const defaultCharacter: CharacterDescription = {
  // Option 1 (Default) - Use a GLB file directly
  meshFileUrl: "/assets/models/bot.glb", // This is just an address of a GLB file
  // Option 2 - Use an MML Character from a URL
  // mmlCharacterUrl: "https://pathto.mml.io/mml-character",
  // Option 3 - Use an MML Character from a string
  // mmlCharacterString: `
  // <m-character src="/assets/models/bot.glb">
  //   <m-model src="/assets/models/hat.glb"
  //     socket="head"
  //     x="0.03" y="0" z="0.0"
  //     sx="1.03" sy="1.03" sz="1.03"
  //     rz="-90"
  //   ></m-model>
  // </m-character>
  // `,
};

// UserAuthenticator
const userAuthenticator = new OtherPageAuthenticator(defaultCharacter);

// --- Networked 3d Web Experience Server ----------

// Web client build directory and index content
const webClientBuildDir = path.join(dirname, "../../web-client/build/");
const indexContent = fs.readFileSync(
  path.join(webClientBuildDir, "index.html"),
  "utf8",
);

const networked3dWebExperienceServer = new Networked3dWebExperienceServer({
  networkPath: "/network",
  userAuthenticator,
  webClientServing: {
    indexUrl: "/",
    indexContent,
    clientBuildDir: webClientBuildDir,
    clientUrl: "/web-client/",
    clientWatchWebsocketPath:
      process.env.NODE_ENV !== "production" ? "/web-client-build" : undefined,
  },
  chatNetworkPath: "/chat-network",
  assetServing: {
    assetsDir: path.resolve(dirname, "../assets/"),
    assetsUrl: "/assets/",
  },
});
networked3dWebExperienceServer.registerExpressRoutes(app);

// --- API ----------
app.post("/api/badge", (req, res) => {
  const clientId = Number(req.body.connectionId);
  const u = userAuthenticator.getUserByClientId(Number(req.body.connectionId));

  if (u) {
    const user = (
      networked3dWebExperienceServer as any
    ).userNetworkingServer.allClientsById.get(clientId);

    // basic anti-cheat
    const timeSinceLastPong = user.lastPong ? Date.now() - user.lastPong : 0;
    const isInCube = isPointInCube(
      user.update.position,
      { x: -81.81199645996094, y: 545.68798828125, z: 18.8799991607666 },
      10,
    );
    console.log("isInCube", isInCube, "timeSinceLastPong", timeSinceLastPong);

    // TODO: send to OP API to claim badge
    console.log("claim badge for user:", u.sub);
  }

  res.json({ message: "Badge claimed" });
});

// Start listening
console.log("Listening on port", PORT);
app.listen(PORT);
