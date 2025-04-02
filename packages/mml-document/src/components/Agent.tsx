import { MPositionProbeElement } from "@mml-io/mml-react-types";
import React, { useEffect, useRef, useState } from "react";

export type AgentProps = {
  mml: string;
  y?: number;
  x?: number;
  z?: number;
  ry?: number;
};

const API_URL = process.env.EXPERIENCE_URL;

export default function Agent({ mml, ...props }: AgentProps) {
  const probeRef = useRef<MPositionProbeElement>(null);
  const [visible, setVisible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const [text, setText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  const [user, setUser] = useState<any>(null);

  const getUser = async (connectionId: string) => {
    const response = await fetch(`${API_URL}/api/user/${connectionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.EXPERIENCE_SECRET || "your-client-secret",
      },
    });
    const data = await response.json();
    setUser(data?.name || "");
  };

  const claimBadge = (e: any) => {
    if (isClaiming) return;
    setIsClaiming(true);
    fetch(`${API_URL}/api/badge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.EXPERIENCE_SECRET || "your-client-secret",
      },
      body: JSON.stringify({
        connectionId: e.detail.connectionId,
        badgeId: "demo-ascension-badge-id",
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setTimeout(() => {
          setIsClaiming(false);
          setClaimed(true);
          setText(
            data.message ||
              "Congrats, your badge will be displayed on your page.",
          );
        }, 2000);
      })
      .catch((error) => {
        setTimeout(() => {
          setText(
            error.message || "Hmm looks like that didn't work... try again.",
          );
          setIsClaiming(false);
        }, 1000);
      });
  };

  useEffect(() => {
    let i = -1;
    setDisplayedText("");
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevText) => prevText + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text]);

  useEffect(() => {
    probeRef.current?.addEventListener("positionenter", (e: any) => {
      console.log(JSON.stringify(e.detail));
      const { connectionId } = e.detail;
      getUser(connectionId);
    });
    probeRef.current?.addEventListener("positionleave", (e: any) => {
      const { connectionId } = e.detail;
      setVisible(false);
      setClaimed(false);
      setText("");
      setUser("");
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setVisible(true);
    setText(
      `Welcome${user ? `, ${user}` : ""}. You've come a long way... click the badge to claim.`,
    );
  }, [user]);

  return (
    <m-group {...props}>
      <m-label
        content={displayedText}
        font-size="6"
        alignment="center"
        color="black"
        font-color="white"
        y={2}
        x={0.75}
        width={1}
        height={0.3}
        visible={visible}
      />
      <m-position-probe
        ref={probeRef}
        range={3}
        id="probe"
        interval="100"
      ></m-position-probe>
      <m-character
        sx={1.15}
        sy={1.15}
        sz={1.15}
        anim="https://cdn.other.page/animation/idle_cleaned.glb"
        src={mml}
      ></m-character>

      <m-cylinder
        onClick={claimBadge}
        y="1"
        x="1"
        rx="90"
        height="0.01"
        color="black"
        radius="0.4"
        visible={!claimed}
      >
        <m-image
          rx="-90"
          opacity="1"
          y="0.016"
          src="https://mmlstorage.com/c3432d9a411893d61c3ce5c729b7c6dd28647dc15ba585623278ddb2be02c781"
        ></m-image>
        <m-image
          rx="-90"
          ry="-180"
          opacity="1"
          y="-0.016"
          src="https://mmlstorage.com/c3432d9a411893d61c3ce5c729b7c6dd28647dc15ba585623278ddb2be02c781"
        ></m-image>
        {!isClaiming && !claimed && (
          <m-attr-anim
            attr="rz"
            start="0"
            end="360"
            start-time="0"
            duration="5000"
          ></m-attr-anim>
        )}
        {isClaiming && !claimed && (
          <>
            <m-attr-anim
              attr="rz"
              start="0"
              end="360"
              start-time="0"
              duration="1000"
              easing="easeInOutSine"
            ></m-attr-anim>
            <m-attr-anim
              attr="opacity"
              start="1"
              end="0"
              start-time="0"
              duration="1000"
              loop="false"
            ></m-attr-anim>
          </>
        )}
      </m-cylinder>
    </m-group>
  );
}
