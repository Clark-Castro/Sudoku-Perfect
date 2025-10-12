import { isValidPlacement } from "@/logic/validators";
import { Grid } from "@/types/types";
import { findEmpty, deepClone, shuffledNums } from "@/utils/gridUtils";

export const solve = (grid: Grid): Grid | null => {
  const grid2 = deepClone(grid);

  function helper(): boolean {
    const pos = findEmpty(grid2);
    if (!pos) return true;

    const { row, col } = pos;
    const nums = shuffledNums();

    for (const num of nums) {
      if (isValidPlacement(grid2, row, col, num)) {
        grid2[row][col].value = num;
        if (helper()) return true;
        grid2[row][col].value = null;
      }
    }
    return false;
  }

  if (helper()) return grid2;
  return null;
};
