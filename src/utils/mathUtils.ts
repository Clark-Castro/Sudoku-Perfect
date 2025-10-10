import { NumType } from "@/types/types";

export const Nums = [0, 1, 2, 3, 4, 5, 6, 7, 8] as NumType[];

export function randInt() {
  return Nums[Math.floor(Math.random() * 9)];
}

export function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
