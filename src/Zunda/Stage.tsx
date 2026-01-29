import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { Character } from "./Character";
import type { ZunpyokoConfig } from "./config";
import { getNotes, ticksToSeconds, type Vvproj } from "./vvproj";
import vvprojData from "../data/voicebox.vvproj";
import configData from "../data/zunpyoko-config.json";

export const Stage: React.FC = () => {
  const { fps } = useVideoConfig();
  const vvproj = vvprojData as Vvproj;
  const zunpyokoConfig = configData as ZunpyokoConfig;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f6f2" }}>
      <Audio src={staticFile(zunpyokoConfig.wavPath)} />
      {zunpyokoConfig.characters.map((character, index) => {
        const notes = getNotes(vvproj, character.trackName).filter(
          (note) =>
            note.noteNumber >= character.noteRange.min &&
            note.noteNumber <= character.noteRange.max,
        );
        const rawIntervals = notes.map((note) => {
          const startSeconds = ticksToSeconds(
            note.position,
            vvproj.song.tempos,
            vvproj.song.tpqn,
          );
          const endSeconds = ticksToSeconds(
            note.position + note.duration,
            vvproj.song.tempos,
            vvproj.song.tpqn,
          );
          const startFrame = Math.max(0, Math.round(startSeconds * fps));
          const durationInFrames = Math.max(
            1,
            Math.round((endSeconds - startSeconds) * fps),
          );

          return {
            start: startFrame,
            end: startFrame + durationInFrames,
          };
        });
        const activeIntervals = rawIntervals
          .sort((a, b) => a.start - b.start)
          .reduce<Array<{ start: number; end: number }>>((merged, interval) => {
            const last = merged[merged.length - 1];
            if (!last) {
              merged.push(interval);
              return merged;
            }
            if (interval.start - last.end <= zunpyokoConfig.activeMergeGapFrames) {
              last.end = Math.max(last.end, interval.end);
            } else {
              merged.push(interval);
            }
            return merged;
          }, []);

        return (
          <Character
            key={`${character.position.x}-${index}`}
            width={character.width}
            height={character.height}
            src={staticFile(character.imagePath)}
            activeSrc={staticFile(
              character.activeImagePath ?? character.imagePath,
            )}
            activeIntervals={activeIntervals}
            position={character.position}
          />
        );
      })}
    </AbsoluteFill>
  );
};
