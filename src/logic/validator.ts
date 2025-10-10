import { Grid, NumType } from "@/types/types";
import { boxPose, deepClone } from "@/utils/gridUtils";

export function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  val: NumType | null
): boolean {
  for (let colNum = 0; colNum < 9; colNum++)
    if (colNum !== col && grid[row][colNum].value === val) return false;

  for (let rowNum = 0; rowNum < 9; rowNum++)
    if (rowNum !== row && grid[rowNum][col].value === val) return false;

  const { boxRowMin, boxRowMax, boxColMin, boxColMax } = boxPose(row, col);
  for (let rowNum = boxRowMin; rowNum <= boxRowMax; rowNum++)
    for (let colNum = boxColMin; colNum <= boxColMax; colNum++)
      if ((rowNum !== row || colNum !== col) && grid[rowNum][colNum].value === val) return false;

  return true;
}

export function runValidation(grid: Grid): Grid {
  const grid2 = deepClone(grid);
  for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) grid2[row][col].valid = true;
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      const val = grid2[row][col].value;
      if (val === null) continue;
      if (!isValidPlacement(grid2, row, col, val)) grid2[row][col].valid = false;
    }
  return grid2;
}
