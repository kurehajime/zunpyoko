import "./index.css";
import {
  Composition,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  type CalculateMetadataFunction,
} from "remotion";
import { useEffect, useState } from "react";
import { Stage } from "./Zunda/Stage";
import { getEndSeconds, type Vvproj } from "./Zunda/vvproj";
import { CONFIG_LIST_JSON } from "./setting";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const [configList, setConfigList] = useState<
    Array<{ id?: string; configUrl: string }>
  >([]);
  const [handle] = useState(() => delayRender("load config list"));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(staticFile(CONFIG_LIST_JSON));
        if (!response.ok) {
          throw new Error(`Failed to load config_list.json: ${response.status}`);
        }
        const list = (await response.json()) as Array<{
          id?: string;
          configUrl: string;
        }>;
        if (cancelled) {
          return;
        }
        setConfigList(list);
      } catch (error) {
        cancelRender(error);
      } finally {
        if (!cancelled) {
          continueRender(handle);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [handle]);
  const calculateMetadata: CalculateMetadataFunction<
    React.ComponentProps<typeof Stage>
  > = async ({ props }) => {
    const configUrl = props.configUrl;
    if (!configUrl) {
      throw new Error("configUrl is required");
    }
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
      {configList.map((entry) => {
        const configUrl = entry.configUrl;
        const id =
          entry.id ??
          configUrl
            .split("/")
            .filter(Boolean)
            .slice(-2, -1)[0] ??
          "zunpyoko";

        return (
          <Composition
            key={id}
            id={id}
            component={Stage}
            durationInFrames={150}
            fps={fps}
            width={1920}
            height={1080}
            defaultProps={{
              configUrl,
            }}
            calculateMetadata={calculateMetadata}
          />
        );
      })}
    </>
  );
};
