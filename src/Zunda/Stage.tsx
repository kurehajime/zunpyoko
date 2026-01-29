import {
  AbsoluteFill,
  Audio,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import { useEffect, useMemo, useState } from "react";
import { Character } from "./Character";
import type { ZunpyokoConfig } from "./config";
import { getNotes, ticksToSeconds, type Vvproj } from "./vvproj";

type StageProps = {
  configUrl?: string;
};

export const Stage: React.FC<StageProps> = ({
  configUrl = "kaerunouta/translate.json",
}) => {
  const { fps } = useVideoConfig();
  const [config, setConfig] = useState<ZunpyokoConfig | null>(null);
  const [vvproj, setVvproj] = useState<Vvproj | null>(null);
  const [handle] = useState(() => delayRender("load zunpyoko config"));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const configResponse = await fetch(staticFile(configUrl));
        if (!configResponse.ok) {
          throw new Error(`Failed to load config: ${configResponse.status}`);
        }
        const configJson = (await configResponse.json()) as ZunpyokoConfig;
        if (cancelled) {
          return;
        }
        setConfig(configJson);

        const vvprojResponse = await fetch(staticFile(configJson.vvprojPath));
        if (!vvprojResponse.ok) {
          throw new Error(`Failed to load vvproj: ${vvprojResponse.status}`);
        }
        const vvprojJson = (await vvprojResponse.json()) as Vvproj;
        if (cancelled) {
          return;
        }
        setVvproj(vvprojJson);
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
  }, [configUrl, handle]);

  const activeIntervalsByCharacter = useMemo(() => {
    if (!config || !vvproj) {
      return [];
    }

    return config.characters.map((character) => {
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
          if (interval.start - last.end <= config.activeMergeGapFrames) {
            last.end = Math.max(last.end, interval.end);
          } else {
            merged.push(interval);
          }
          return merged;
        }, []);

      return activeIntervals;
    });
  }, [config, fps, vvproj]);

  if (!config || !vvproj) {
    return <AbsoluteFill style={{ backgroundColor: "#f7f6f2" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f6f2" }}>
      <Audio src={staticFile(config.wavPath)} />
      {config.characters.map((character, index) => (
        <Character
          key={`${character.position.x}-${index}`}
          width={character.width}
          height={character.height}
          src={staticFile(character.imagePath)}
          activeSrc={staticFile(character.activeImagePath ?? character.imagePath)}
          activeIntervals={activeIntervalsByCharacter[index]}
          position={character.position}
        />
      ))}
    </AbsoluteFill>
  );
};
