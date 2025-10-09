import { allNums, deepCloneGrid } from "@/logic/utils";
import isValidPlacement from "@/logic/validator";
import { Grid, Pos } from "@/types/types";

export default function countSolutions(grid: Grid, limit = 2): number {
  let count = 0;
  const g = deepCloneGrid(grid);

  const findEmpty = (): Pos | null => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) if (g[r][c].value === null) return { r, c };
    return null;
  };

  function helper(): void {
    if (count >= limit) return;
    const pos = findEmpty();
    if (!pos) {
      count++;
      return;
    }
    const { r, c } = pos;
    for (const n of allNums) {
      if (isValidPlacement(g, r, c, n)) {
        g[r][c].value = n;
        helper();
        g[r][c].value = null;
        if (count >= limit) return;
      }
    }
  }
  helper();
  return count;
}
