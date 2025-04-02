import { Networked3dWebExperienceClient } from "@mml-io/3d-web-experience-client";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const host = window.location.host;
const userNetworkAddress = `${protocol}//${host}/network`;
const chatNetworkAddress = `${protocol}//${host}/chat-network`;

const holder = Networked3dWebExperienceClient.createFullscreenHolder();
const app = new Networked3dWebExperienceClient(holder, {
  sessionToken: (window as any).SESSION_TOKEN || "test-session-token",
  userNetworkAddress,
  chatNetworkAddress,
  animationConfig: {
    airAnimationFileUrl: "/web-client/assets/models/anim_air.glb",
    idleAnimationFileUrl: "/web-client/assets/models/anim_idle.glb",
    jogAnimationFileUrl: "/web-client/assets/models/anim_jog.glb",
    sprintAnimationFileUrl: "/web-client/assets/models/anim_run.glb",
    doubleJumpAnimationFileUrl:
      "/web-client/assets/models/anim_double_jump.glb",
  },
  environmentConfiguration: {
    groundPlane: false,
    skybox: {
      hdrJpgUrl: "/web-client/assets/hdr/nebula_4k.jpg",
    },
    sun: {
      intensity: 2,
    },
    postProcessing: {
      bloomIntensity: 0.5,
    },
    ambientLight: {
      intensity: 3,
    },
  },
  mmlDocuments: {
    index: {
      url: `${protocol}//${host}/mml-document`,
    },
  },
  loadingScreen: {
    background: "#161616",
    title: "ASCENSION MML DEMO",
    subtitle: "Loading...",
    color: "#ffffff",
  },
});

app.update();
