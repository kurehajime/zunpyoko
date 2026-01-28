import { AbsoluteFill } from "remotion";
import { Character } from "./Character";

export const Stage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f6f2" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 32,
          flexWrap: "nowrap",
          paddingBottom: 120,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Character key={index} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
