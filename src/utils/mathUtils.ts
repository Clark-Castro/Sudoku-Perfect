import { Diff, NumType, Pose } from "@/types/types";

export const Nums = [0, 1, 2, 3, 4, 5, 6, 7, 8] as NumType[];

export function randInt() {
  return Nums[Math.floor(Math.random() * 9)];
}

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

export const cluesNum = (diff: Diff) => {
  return {
    easy: randInt() + 40,
    medium: randInt() + 30,
    hard: randInt() + 20,
  }[diff];
};
