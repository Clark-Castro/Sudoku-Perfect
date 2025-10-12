"use client";
import { CSSProperties, useMemo } from "react";

import Cell from "@/components/Cell";
import { Grid, Pose } from "@/types/types";
import { boxPose } from "@/utils/mathUtils";

export default function GridView({
  grid,
  selected,
  onSelect,
}: {
  grid: Grid;
  selected: Pose | null;
  onSelect: (p: Pose) => void;
}) {
  const boxCoords = selected ? boxPose(selected.row, selected.col) : null;

  const cellBorderStyle = (r: number, c: number): CSSProperties => ({
    borderRight: (c + 1) % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
    borderBottom: (r + 1) % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
    borderLeft: c % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
    borderTop: r % 3 === 0 ? "3px solid #000" : "1px solid #cbd5e1",
  });

  return (
    <div className="inline-grid grid-cols-9 overflow-hidden rounded-xl border-4 border-slate-900 bg-gray-100 shadow-2xl">
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isSelected = !!selected && selected.row === r && selected.col === c;

          const isRelated: boolean = selected
            ? selected.row === r ||
              selected.col === c ||
              (boxCoords !== null &&
                r >= boxCoords.boxRowMin &&
                r <= boxCoords.boxRowMax &&
                c >= boxCoords.boxColMin &&
                c <= boxCoords.boxColMax)
            : false;

          return (
            <div key={`${r}-${c}`} style={cellBorderStyle(r, c)}>
              <Cell
                cell={cell}
                row={r}
                col={c}
                selected={isSelected}
                isRelated={isRelated && !isSelected}
                onSelect={onSelect}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
