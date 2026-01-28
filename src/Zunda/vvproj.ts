export type VvprojNote = {
  noteNumber: number;
  position: number;
  duration: number;
};

export type VvprojTrack = {
  notes: VvprojNote[];
  name: string;
};

export type Vvproj = {
  song: {
    tpqn: number;
    tempos: Array<{
      position: number;
      bpm: number;
    }>;
    tracks: Record<string, VvprojTrack>;
  };
};

export const getNotes = (vvproj: Vvproj, trackName?: string): VvprojNote[] => {
  const tracks = Object.values(vvproj.song.tracks).filter((track) =>
    trackName ? track.name === trackName : true,
  );
  const notes: VvprojNote[] = [];

  for (const track of tracks) {
    for (const note of track.notes) {
      notes.push(note);
    }
  }

  return notes;
};

export const ticksToSeconds = (
  ticks: number,
  tempos: Vvproj["song"]["tempos"],
  tpqn: number,
): number => {
  if (tempos.length === 0) {
    return 0;
  }

  const sortedTempos = [...tempos].sort((a, b) => a.position - b.position);
  let seconds = 0;

  for (let i = 0; i < sortedTempos.length; i += 1) {
    const current = sortedTempos[i];
    const next = sortedTempos[i + 1];
    const end = next ? Math.min(next.position, ticks) : ticks;

    if (ticks <= current.position) {
      break;
    }

    const spanTicks = Math.max(0, end - current.position);
    const secondsPerTick = 60 / (current.bpm * tpqn);
    seconds += spanTicks * secondsPerTick;

    if (end === ticks) {
      break;
    }
  }

  return seconds;
};

export const getEndSeconds = (vvproj: Vvproj): number => {
  const allNotes = getNotes(vvproj);
  let lastTick = 0;

  for (const note of allNotes) {
    const noteEnd = note.position + note.duration;
    if (noteEnd > lastTick) {
      lastTick = noteEnd;
    }
  }

  return ticksToSeconds(lastTick, vvproj.song.tempos, vvproj.song.tpqn);
};
