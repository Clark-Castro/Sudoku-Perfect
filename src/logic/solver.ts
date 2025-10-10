import { isValidPlacement } from "@/logic/validator";
import { Grid } from "@/types/types";
import { findEmpty, deepClone } from "@/utils/gridUtils";
import { Nums, shuffle } from "@/utils/mathUtils";

export function solve(grid: Grid): Grid | null {
  const grid2 = deepClone(grid);

  function helper(): boolean {
    const pos = findEmpty(grid2);
    if (!pos) return true;
    const { row, col } = pos;
    const shuffledNums = shuffle([...Nums]);
    for (const num of shuffledNums) {
      if (isValidPlacement(grid2, row, col, num)) {
        grid2[row][col].value = num;
        if (helper()) return true;
        grid2[row][col].value = 0;
      }
    }
    return false;
  }

  if (helper()) return grid2;
  return null;
}

export function checkIfSolved(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === 0 || !grid[row][col].valid) {
        return false;
      }
    }
  }
  return true;
}
