import { Img } from "remotion";

type CharacterProps = {
  width?: number;
  height?: number;
  src: string;
  position: {
    x: number;
    y: number;
  };
};

export const Character: React.FC<CharacterProps> = ({
  width = 220,
  height = 220,
  src,
  position,
}) => {
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
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
