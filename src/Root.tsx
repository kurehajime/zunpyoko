import "./index.css";
import { Composition } from "remotion";
import { Stage } from "./Zunda/Stage";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="zunpyoko"
        component={Stage}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
