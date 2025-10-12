import { isValidPlacement } from "@/logic/validators";
import { Grid } from "@/types/types";
import { emptyGrid, shuffledNums } from "@/utils/gridUtils";
import { idxToPose, randInt } from "@/utils/mathUtils";

export const solvedGenerate = (): Grid => {
  const grid = emptyGrid();
  const initialValue = randInt();
  grid[0][0].value = initialValue;

  function helper(idx = 1): boolean {
    if (idx === 81) return true;
    const { row, col } = idxToPose(idx);
    const nums = shuffledNums();

    for (const num of nums) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col].value = num;
        if (helper(idx + 1)) return true;
        grid[row][col].value = null;
      }
    }
    return false;
  }

  helper();
  return grid;
};
