import { allNums, deepCloneGrid, shuffle } from "@/logic/utils";
import isValidPlacement from "@/logic/validator";
import { Grid, Pos } from "@/types/types";

export default function solve(grid: Grid): Grid | null {
  const g = deepCloneGrid(grid);

  const findEmpty = (): Pos | null => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) if (g[r][c].value === null) return { r, c };
    return null;
  };

  function helper(): boolean {
    const pos = findEmpty();
    if (!pos) return true;
    const { r, c } = pos;
    const nums = shuffle([...allNums]);
    for (const n of nums) {
      if (isValidPlacement(g, r, c, n)) {
        g[r][c].value = n;
        if (helper()) return true;
        g[r][c].value = null;
      }
    }
    return false;
  }

  if (helper()) return g;
  return null;
}
