import crypto from "crypto";

import { UserIdentity } from "@mml-io/3d-web-user-networking";
import type {
  CharacterDescription,
  UserData,
} from "@mml-io/3d-web-user-networking";

export type AuthUser = {
  // clientId is the connection identifier for the user - it is null before the client websocket is connected
  clientId: number | null;
  // userData is the user's presentation in the world (username and character description)
  userData?: UserData;
  // sessionToken is the token that is generated by this authenticator and the user uses to authenticate their websocket connection
  sessionToken: string;
};

export type BasicUserAuthenticatorOptions = {
  devAllowUnrecognizedSessions: boolean;
};

const defaultOptions: BasicUserAuthenticatorOptions = {
  devAllowUnrecognizedSessions: false,
};

export class BasicUserAuthenticator {
  private usersByClientId = new Map<number, AuthUser>();
  private userBySessionToken = new Map<string, AuthUser>();

  constructor(
    private characterDescription: CharacterDescription,
    private options: BasicUserAuthenticatorOptions = defaultOptions,
  ) {}

  async generateAuthorizedSessionToken(): Promise<string> {
    const sessionToken = crypto.randomBytes(20).toString("hex");
    const authUser: AuthUser = {
      clientId: null,
      sessionToken,
    };

    this.userBySessionToken.set(sessionToken, authUser);
    return Promise.resolve(sessionToken);
  }

  public onClientConnect(
    clientId: number,
    sessionToken: string,
    userIdentityPresentedOnConnection?: UserIdentity,
  ): UserData | null {
    let user = this.userBySessionToken.get(sessionToken);
    if (!user) {
      console.error(
        `Invalid initial user-update for clientId ${clientId}, unknown session`,
      );

      if (this.options.devAllowUnrecognizedSessions) {
        console.warn(`Dev mode: allowing unrecognized session token`);
        user = {
          clientId: null,
          sessionToken,
        };
        this.userBySessionToken.set(sessionToken, user);
      }
      return null;
    }

    if (user.clientId !== null) {
      console.error(`Session token already connected`);
      return null;
    }

    user.clientId = clientId;
    user.userData = {
      username: `User ${clientId}`,
      characterDescription: this.characterDescription,
    };
    if (userIdentityPresentedOnConnection) {
      console.warn("Ignoring user-identity on initial connect");
    }
    this.usersByClientId.set(clientId, user);

    console.log(`Client ID: ${clientId} joined with session token`);

    return user.userData;
  }

  public getClientIdForSessionToken(
    sessionToken: string,
  ): { id: number } | null {
    const user = this.userBySessionToken.get(sessionToken);
    if (!user) {
      console.error("getClientIdForSessionToken - unknown session");
      return null;
    }
    if (user.clientId === null) {
      console.error("getClientIdForSessionToken - client not connected");
      return null;
    }
    return { id: user.clientId };
  }

  public onClientUserIdentityUpdate(): UserData | null {
    // This implementation does not allow updating user data after initial connect.

    // To allow updating user data after initial connect, return the UserData object that reflects the requested change.

    // Returning null will not update the user data.
    return null;
  }

  public onClientDisconnect(clientId: number) {
    console.log(`Remove user-session for ${clientId}`);
    // TODO - expire session token after a period of disconnection
    const userData = this.usersByClientId.get(clientId);
    if (userData) {
      userData.clientId = null;
      this.usersByClientId.delete(clientId);
    }
  }
}
