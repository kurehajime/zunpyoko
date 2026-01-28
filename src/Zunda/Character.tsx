import { Img, staticFile } from "remotion";

type CharacterProps = {
  size?: number;
};

export const Character: React.FC<CharacterProps> = ({ size = 220 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile("dummy_zunda.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
