export type VvprojNote = {
  noteNumber: number;
};

export type VvprojTrack = {
  notes: VvprojNote[];
  name: string;
};

export type Vvproj = {
  song: {
    tracks: Record<string, VvprojTrack>;
  };
};

export const getNoteNumbers = (
  vvproj: Vvproj,
  trackName?: string,
): number[] => {
  const tracks = Object.values(vvproj.song.tracks).filter((track) =>
    trackName ? track.name === trackName : true,
  );
  const noteNumbers: number[] = [];

  for (const track of tracks) {
    for (const note of track.notes) {
      noteNumbers.push(note.noteNumber);
    }
  }

  return noteNumbers;
};
