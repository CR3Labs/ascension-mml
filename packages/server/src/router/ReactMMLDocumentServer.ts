import fs from "fs";
import url from "url";

import {
  EditableNetworkedDOM,
  LocalObservableDOMFactory,
} from "@mml-io/networked-dom-server";
import * as chokidar from "chokidar";
import { Request } from "express";
import * as WebSocket from "ws";

import { OtherPageAuthenticator } from "../OtherPageAuthenticator";

const getMmlDocumentContent = (documentPath: string) => {
  const contents = fs.readFileSync(documentPath, {
    encoding: "utf8",
    flag: "r",
  });
  return `<m-group id="root"></m-group><script>${contents}</script>`;
};

export class ReactMMLDocumentServer {
  private mmlDocument: EditableNetworkedDOM;
  private externalIdToJwt: Map<number, string> = new Map();

  constructor(
    private mmlDocumentPath: string,
    private otherPageAuthenticator: OtherPageAuthenticator,
  ) {
    this.mmlDocument = new EditableNetworkedDOM(
      url.pathToFileURL(this.mmlDocumentPath).toString(),
      LocalObservableDOMFactory,
    );

    // Watch for changes in DOM file and reload
    chokidar.watch(this.mmlDocumentPath).on("change", () => {
      this.reload();
    });
    this.reload();
  }

  public handle(ws: WebSocket, req: Request) {
    const jwt = this.otherPageAuthenticator.getJwtFromCookie(
      req.headers.cookie || "",
    );

    if (!jwt) {
      ws.close();
      return;
    }

    const conn = (this.mmlDocument as any).loadedState.networkedDOM;
    this.mmlDocument.addWebSocket(ws as any);

    // save the jwt to the map
    const ndom = conn.webSocketToNetworkedDOMConnection.get(ws);
    const externalId = ndom.networkedDOM.currentConnectionId;
    this.externalIdToJwt.set(externalId, jwt);

    ws.on("close", () => {
      this.externalIdToJwt.delete(externalId);
      this.mmlDocument.removeWebSocket(ws as any);
    });
  }

  public getJwtForExternalId(externalId: number) {
    return this.externalIdToJwt.get(externalId);
  }

  private reload() {
    this.mmlDocument.load(getMmlDocumentContent(this.mmlDocumentPath));
  }
}
