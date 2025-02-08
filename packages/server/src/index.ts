import fs from "fs";
import path from "path";
import url from "url";

import { Networked3dWebExperienceServer } from "@mml-io/3d-web-experience-server";
import type { CharacterDescription } from "@mml-io/3d-web-user-networking";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json as expressJson, static as expressStatic } from "express";
import enableWs from "express-ws";

import { isPointInCube } from "./lib";
import { OtherPageAuthenticator } from "./OtherPageAuthenticator";
import { ReactMMLDocumentServer } from "./router/ReactMMLDocumentServer";
import { registerDolbyVoiceRoutes } from "./voice-routes";

dotenv.config();

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.PORT || 8080;
const OP_API = process.env.OP_API || "http://127.0.0.1:3003/v1";

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

// server routes

app.get("/api/user/:connectionId", (req, res) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const u = userAuthenticator.getUserByClientId(
    Number(req.params.connectionId),
  );

  res.json({ name: u?.userData?.username || "" });
});

app.post("/api/badge", async (req, res) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Retrieve user from connectionId
  const clientId = Number(req.body.connectionId);
  const u = userAuthenticator.getUserByClientId(Number(req.body.connectionId));

  if (!u) {
    console.warn("User not found for connectionId", req.body.connectionId);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (u) {
    // perform basic anti-cheat
    const user = (
      networked3dWebExperienceServer as any
    ).userNetworkingServer.allClientsById.get(clientId);

    console.log("user", user.update.position);

    const timeSinceLastPong = user.lastPong ? Date.now() - user.lastPong : 0;
    const isInCube = isPointInCube(
      user.update.position,
      { x: -62.089637756347656, y: 207.26670837402344, z: 10.05864429473877 },
      20,
    );
    console.log("isInCube", isInCube, "timeSinceLastPong", timeSinceLastPong);

    if (!isInCube && timeSinceLastPong < 3000) {
      res.status(401).json({ message: "Invalid request" });
      return;
    }

    // POST to OP API to attribute badge
    try {
      const response = await fetch(
        `${OP_API}/community/${process.env.OP_COMMUNITY_ID}/badge/${process.env.OP_BADGE_ID}/attribution`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.OP_API_KEY || "ascension-api-key",
          },
          body: JSON.stringify({
            wallet: u.wallet,
            autoClaim: true,
          }),
        },
      );

      const responseBody = await response.json();
      res.json(responseBody);
    } catch (error) {
      console.error("failed to attribute badge", error);
      res.status(401).json({ message: "Failed to attribute badge" });
    }
  }
});

// user routes

app.patch("/api/me/avatar", (req, res) => {
  if (!req.headers["authorization"]) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // TODO: validate the idToken?
  const token = (req.headers["authorization"] as string)?.replace(
    "Bearer ",
    "",
  );
  const sess = userAuthenticator.getClientIdForSessionToken(token);

  if (!sess?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const u = userAuthenticator.getUserByClientId(sess.id);

  if (!u?.userData?.characterDescription) {
    res.status(500).json({ message: "Unable to update avatar" });
    return;
  }

  const { mmlUrl, name } = req.body;
  if (!mmlUrl || !name) {
    res.status(400).json({ message: "Missing mmlUrl or name" });
    return;
  }

  networked3dWebExperienceServer.updateUserCharacter(sess.id, {
    username: name,
    characterDescription: {
      mmlCharacterUrl: req.body.mmlUrl,
    },
  });
  userAuthenticator.setUserByClientId(sess.id, {
    ...u,
    userData: {
      ...u.userData,
      username: name,
    },
  });

  res.json({ message: "Avatar updated" });
});

// Start listening
console.log("Listening on port", PORT);
app.listen(PORT);
