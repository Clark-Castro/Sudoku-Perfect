export type NumType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cell = {
  value: NumType;
  notes: { [key in NumType]?: boolean };
  clues: boolean;
  valid: boolean;
};

export type Grid = Cell[][];

export type Pose = {
  row: number;
  col: number;
};

export type Diff = "easy" | "medium" | "hard" | "expert" | "insane";
