import { CSSProperties } from "react";

import { inBox } from "@/logic/utils";
import { Grid, Pos, NumberType } from "@/types/types";

import Cell from "./Cell";

export default function GridView({
  grid,
  selected,
  selectedValue,
  onSelect,
}: {
  grid: Grid;
  selected: Pos | null;
  selectedValue: NumberType | null;
  onSelect: (p: Pos) => void;
}) {
  const boxCoords = selected ? inBox(selected.r, selected.c) : null;

  return (
    <div className="inline-grid grid-cols-9 overflow-hidden rounded-xl border-4 border-slate-900 bg-gray-100 shadow-2xl">
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isSelected = selected && selected.r === r && selected.c === c;

          const isRelated: boolean = selected
            ? selected.r === r ||
              selected.c === c ||
              (boxCoords !== null &&
                r >= boxCoords.br &&
                r < boxCoords.br + 3 &&
                c >= boxCoords.bc &&
                c < boxCoords.bc + 3)
            : false;

          const style: CSSProperties = {
            borderRight: (c + 1) % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
            borderBottom: (r + 1) % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
            borderLeft: c === 0 ? "3px solid #000" : undefined,
            borderTop: r === 0 ? "3px solid #000" : undefined,
          };

          return (
            <div key={`${r}-${c}`} style={style}>
              <Cell
                cell={cell}
                r={r}
                c={c}
                selected={!!isSelected}
                isRelated={isRelated && !isSelected}
                selectedValue={selectedValue}
                onSelect={onSelect}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
