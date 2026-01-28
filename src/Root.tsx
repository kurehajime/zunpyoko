import "./index.css";
import { Composition } from "remotion";
import { Stage } from "./Zunda/Stage";
import { getEndSeconds, type Vvproj } from "./Zunda/vvproj";
import vvprojData from "./data/voicebox.vvproj";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const vvproj = vvprojData as Vvproj;
  const durationInFrames = Math.max(1, Math.ceil(getEndSeconds(vvproj) * fps));

  return (
    <>
      <Composition
        id="zunpyoko"
        component={Stage}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
