"use client";

import { Cell as CellType, NumType, Pose } from "@/types/types";
import { Nums } from "@/utils/mathUtils";

type Props = {
  cell: CellType;
  row: number;
  col: number;
  selected: boolean;
  isRelated: boolean;
  onSelect: (p: Pose) => void;
};

export default function Cell({ cell, row, col, selected, isRelated, onSelect }: Props) {
  const baseClasses =
    "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center font-mono transition-all duration-100 p-0 m-0 border-none outline-none cursor-pointer select-none";

  const bgPart = selected
    ? "bg-sky-200 ring-2 ring-sky-400"
    : isRelated
      ? "bg-slate-50 hover:bg-slate-100"
      : "bg-white hover:bg-slate-100";

  const textPart = cell.clues
    ? "font-bold text-slate-900 text-2xl sm:text-3xl"
    : "font-medium text-slate-800 text-xl sm:text-2xl";

  const validPart = cell.valid ? "" : "text-red-600";

  const finalClassName = [baseClasses, bgPart, textPart, validPart].filter(Boolean).join(" ");

  const notes = cell.notes;
  const hasNotes = Object.values(notes).some((v) => v);
  const showValue = cell.value !== null && !hasNotes;

  return (
    <button
      onClick={() => onSelect({ row, col })}
      className={finalClassName}
      aria-label={`Select cell at row ${row + 1}, column ${col + 1}`}
    >
      {showValue ? (
        <div className={cell.clues ? "text-slate-900" : "text-slate-800"}>{cell.value}</div>
      ) : hasNotes ? (
        <div className="flex h-full w-full flex-wrap p-[2px] text-xs font-normal text-slate-500 sm:p-[4px] sm:text-sm">
          {Nums.map((n) => (
            <div key={n} className="flex h-1/3 w-1/3 items-center justify-center">
              {notes[n as NumType] ? n : ""}
            </div>
          ))}
        </div>
      ) : (
        <div className="opacity-0">0</div>
      )}
    </button>
  );
}
