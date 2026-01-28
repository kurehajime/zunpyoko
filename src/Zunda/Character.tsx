import { Img, useCurrentFrame } from "remotion";
import "./Character.css";

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
  const isActive =
    activeIntervals?.some(({ start, end }) => frame >= start && frame < end) ??
    active;
  const displaySrc = isActive && activeSrc ? activeSrc : src;

  return (
    <div
      className={isActive ? "active" : undefined}
      style={{
        position: "absolute",
        left: position.x,
        bottom: position.y,
        width,
        height,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
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
