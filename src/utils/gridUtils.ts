import { Cell, Grid, NoteType, Pose } from "@/types/types";

export const emptyNote = (): NoteType => ({
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
});

export const emptyCell = (): Cell => ({
  value: null,
  notes: emptyNote(),
  clues: false,
  valid: true,
});

export const emptyGrid = (): Grid =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => emptyCell()));

export const findEmpty = (grid: Grid): Pose | null => {
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) if (grid[row][col].value === null) return { row, col };
  return null;
};

export const deepClone = (grid: Grid = emptyGrid()): Grid =>
  grid.map((row) =>
    row.map((col) => ({
      value: col.value,
      notes: col.notes,
      clues: col.clues,
      valid: col.valid,
    }))
  );

export const boxPose = (row: number, col: number) => ({
  boxRowMin: Math.floor(row / 3) * 3,
  boxRowMax: Math.floor(row / 3) * 3 + 2,
  boxColMin: Math.floor(col / 3) * 3,
  boxColMax: Math.floor(col / 3) * 3 + 2,
});

export const idxToPose = (idx: number): Pose => ({
  row: Math.floor(idx / 9),
  col: idx % 9,
});
