import "./index.css";
import {
  Composition,
  staticFile,
  type CalculateMetadataFunction,
} from "remotion";
import { Stage } from "./Zunda/Stage";
import { getEndSeconds, type Vvproj } from "./Zunda/vvproj";
import { TRANSLATE_JSON } from "./setting";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const calculateMetadata: CalculateMetadataFunction<
    React.ComponentProps<typeof Stage>
  > = async ({ props }) => {
    const configUrl = props.configUrl ?? TRANSLATE_JSON;
    const configResponse = await fetch(staticFile(configUrl));
    const config = (await configResponse.json()) as { vvprojPath: string };
    const vvprojResponse = await fetch(staticFile(config.vvprojPath));
    const vvproj = (await vvprojResponse.json()) as Vvproj;
    const durationInFrames = Math.max(
      1,
      Math.ceil(getEndSeconds(vvproj) * fps),
    );

    return {
      durationInFrames,
      props,
    };
  };

  return (
    <>
      <Composition
        id="zunpyoko"
        component={Stage}
        durationInFrames={150}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          configUrl: TRANSLATE_JSON,
        }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
