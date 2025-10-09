export type NumberType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cell = {
  value: NumberType | null;
  notes: { [key in NumberType]?: boolean };
  readonly: boolean;
  invalid: boolean;
};

export type Grid = Cell[][];

export type Pos = {
  r: number;
  c: number;
};

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "insane";

export type PuzzleData = {
  puzzle: Grid;
  solved: Grid;
};
