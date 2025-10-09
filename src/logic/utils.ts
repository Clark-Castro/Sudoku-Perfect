import { NumberType, Cell, Grid } from "@/types/types";

export const allNums = [1, 2, 3, 4, 5, 6, 7, 8, 9] as NumberType[];

export const deepCloneGrid = (g: Grid): Grid =>
  g.map((row) => row.map((c) => ({ ...c, notes: { ...c.notes } })));

export const emptyCell = (): Cell => ({ value: null, notes: {}, readonly: false, invalid: false });

export const makeEmptyGrid = (): Grid =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => emptyCell()));

export const inBox = (r: number, c: number) => ({
  br: Math.floor(r / 3) * 3,
  bc: Math.floor(c / 3) * 3,
});

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Utility function to merge class names safely
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
