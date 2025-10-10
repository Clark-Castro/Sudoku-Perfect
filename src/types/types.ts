export type NumType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type NoteType = { [key in NumType]: boolean };

export type Cell = {
  value: NumType | null;
  notes: NoteType;
  clues: boolean;
  valid: boolean;
};

export type Pose = {
  row: number;
  col: number;
};

export type Grid = Cell[][];

export type Diff = "easy" | "medium" | "hard";
