import fs from "fs";
import url from "url";

import {
  EditableNetworkedDOM,
  LocalObservableDOMFactory,
} from "@mml-io/networked-dom-server";
import * as chokidar from "chokidar";
import * as WebSocket from "ws";

const getMmlDocumentContent = (documentPath: string) => {
  const contents = fs.readFileSync(documentPath, {
    encoding: "utf8",
    flag: "r",
  });
  return `<m-group id="root"></m-group><script>${contents}</script>`;
};

export class ReactMMLDocumentServer {
  private mmlDocument: EditableNetworkedDOM;

  constructor(private mmlDocumentPath: string) {
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

  public handle(ws: WebSocket) {
    this.mmlDocument.addWebSocket(ws as any);

    ws.on("close", () => {
      this.mmlDocument.removeWebSocket(ws as any);
    });
  }

  private reload() {
    this.mmlDocument.load(getMmlDocumentContent(this.mmlDocumentPath));
  }
}
