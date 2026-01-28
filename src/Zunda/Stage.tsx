import { AbsoluteFill, staticFile } from "remotion";
import { Character } from "./Character";
import type { ZunpyokoConfig } from "./config";
import { getNoteNumbers, type Vvproj } from "./vvproj";
import vvprojData from "../data/voicebox.json";
import configData from "../data/zunpyoko-config.json";

export const Stage: React.FC = () => {
  const vvproj = vvprojData as Vvproj;
  const zunpyokoConfig = configData as ZunpyokoConfig;
  const activeCharacters = zunpyokoConfig.characters.filter((character) => {
    const noteNumbers = getNoteNumbers(vvproj, character.trackName);
    return noteNumbers.some(
      (noteNumber) =>
        noteNumber >= character.noteRange.min &&
        noteNumber <= character.noteRange.max,
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f6f2" }}>
      {activeCharacters.map((character, index) => (
        <Character
          key={`${character.position.x}-${index}`}
          width={character.width}
          height={character.height}
          src={staticFile(character.imagePath)}
          position={character.position}
        />
      ))}
    </AbsoluteFill>
  );
};
