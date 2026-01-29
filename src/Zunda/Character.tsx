import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type CharacterProps = {
  width?: number;
  height?: number;
  src: string;
  activeSrc?: string;
  activeIntervals?: Array<{ start: number; end: number }>;
  active?: boolean;
  position: {
    x: number;
    y: number;
  };
};

export const Character: React.FC<CharacterProps> = ({
  width = 220,
  height = 220,
  src,
  activeSrc,
  activeIntervals,
  active = false,
  position,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isActive =
    activeIntervals?.some(({ start, end }) => frame >= start && frame < end) ??
    active;
  const displaySrc = isActive && activeSrc ? activeSrc : src;
  const currentInterval = activeIntervals?.find(
    ({ start, end }) => frame >= start && frame < end,
  );
  const localFrame = currentInterval ? frame - currentInterval.start : 0;
  const stretchProgress = isActive
    ? spring({
        frame: localFrame,
        fps,
        config: {
          damping: 14,
          mass: 0.7,
        },
      })
    : 0;
  const scaleY = isActive ? interpolate(stretchProgress, [0, 1], [1, 1.06]) : 1;
  const lift = isActive ? interpolate(stretchProgress, [0, 1], [0, -10]) : 0;
  const shake = isActive ? Math.sin(frame * 0.6) * 2 : 0;
  const shakeY = isActive ? Math.cos(frame * 0.8) * 2 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        bottom: position.y,
        width,
        height,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        transform: `translate(${shake}px, ${shakeY + lift}px) scaleY(${scaleY})`,
        transformOrigin: "bottom center",
      }}
    >
      <Img
        src={displaySrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
