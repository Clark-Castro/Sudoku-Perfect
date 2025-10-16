"use client";

import { cva } from "class-variance-authority";

import Cell from "@/components/Cell";
import { isValidPlacement } from "@/logic/validators";
import { Grid, Pose } from "@/types/types";
import { boxPose } from "@/utils/mathUtils";

const gridViewClasses = cva(
  "inline-grid grid-cols-9 overflow-hidden rounded border-4 border-slate-900 bg-gray-100 shadow-2xl"
);

const borderClasses = cva("border border-slate-300", {
  variants: {
    thickTop: { true: "border-t-[3px] border-t-black" },
    thickRight: { true: "border-r-[3px] border-r-black" },
    thickBottom: { true: "border-b-[3px] border-b-black" },
    thickLeft: { true: "border-l-[3px] border-l-black" },
  },
  defaultVariants: {},
});

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

  return (
    <div className={gridViewClasses()}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isSelected = !!selected && selected.row === r && selected.col === c;

          const isRelated =
            selected &&
            (selected.row === r ||
              selected.col === c ||
              (boxCoords &&
                r >= boxCoords.boxRowMin &&
                r <= boxCoords.boxRowMax &&
                c >= boxCoords.boxColMin &&
                c <= boxCoords.boxColMax) ||
              (cell.value === grid[selected.row][selected.col].value && cell.value !== null) ||
              !isValidPlacement(grid, r, c, grid[selected.row][selected.col].value) ||
              cell.clues);

          const borderClassName = borderClasses({
            thickTop: r % 3 === 0,
            thickBottom: (r + 1) % 3 === 0,
            thickLeft: c % 3 === 0,
            thickRight: (c + 1) % 3 === 0,
          });

          return (
            <div key={`${r}-${c}`} className={borderClassName}>
              <Cell
                cell={cell}
                row={r}
                col={c}
                selected={isSelected}
                isRelated={!!isRelated && !isSelected}
                onSelect={onSelect}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
