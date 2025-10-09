import { inBox } from "@/logic/utils";
import { Grid, NumberType } from "@/types/types";

export default function isValidPlacement(g: Grid, r: number, c: number, v: NumberType): boolean {
  // row
  for (let cc = 0; cc < 9; cc++) if (cc !== c && g[r][cc].value === v) return false;
  // col
  for (let rr = 0; rr < 9; rr++) if (rr !== r && g[rr][c].value === v) return false;
  // box
  const { br, bc } = inBox(r, c);
  for (let rr = br; rr < br + 3; rr++)
    for (let cc = bc; cc < bc + 3; cc++)
      if ((rr !== r || cc !== c) && g[rr][cc].value === v) return false;
  return true;
}
