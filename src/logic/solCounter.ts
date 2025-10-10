import { isValidPlacement } from "@/logic/validator";
import { Grid } from "@/types/types";
import { deepClone, findEmpty } from "@/utils/gridUtils";
import { Nums } from "@/utils/mathUtils";

export default function solCounter(grid: Grid): number {
  let count = 0;
  const grid2 = deepClone(grid);

  function helper(): void {
    if (count > 1) return;
    const pos = findEmpty(grid2);
    if (!pos) {
      count++;
      return;
    }
    const { row, col } = pos;
    for (const num of Nums) {
      if (isValidPlacement(grid2, row, col, num)) {
        grid2[row][col].value = num;
        helper();
        grid2[row][col].value = null;
        if (count > 1) return;
      }
    }
  }
  helper();
  return count;
}
