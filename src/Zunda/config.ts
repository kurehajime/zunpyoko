export type CharacterConfig = {
  trackName: string;
  noteRange: {
    min: number;
    max: number;
  };
  imagePath: string;
  activeImagePath?: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
};

export type ZunpyokoConfig = {
  vvprojPath: string;
  wavPath: string;
  activeMergeGapFrames: number;
  characters: CharacterConfig[];
};
