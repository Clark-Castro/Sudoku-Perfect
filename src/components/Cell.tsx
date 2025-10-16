"use client";

import { cva } from "class-variance-authority";

import { Cell as CellType, NumType, Pose } from "@/types/types";
import { cn } from "@/utils/cssUtils";
import { Nums } from "@/utils/mathUtils";

type Props = {
  cell: CellType;
  row: number;
  col: number;
  selected: boolean;
  isRelated: boolean;
  onSelect: (p: Pose) => void;
};

const cellVariants = cva(
  "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center font-mono transition-all duration-100 p-0 m-0 border-none outline-none cursor-pointer select-none",
  {
    variants: {
      state: {
        default: "bg-white hover:bg-slate-200",
        related: "bg-slate-200 hover:bg-slate-300",
        selected: "bg-sky-200 ring-2 ring-sky-400",
      },
      content: {
        clue: "font-bold text-slate-900 text-2xl sm:text-3xl",
        note: "font-medium text-slate-800 text-xl sm:text-2xl",
      },
      valid: {
        true: "",
        false: "text-red-600",
      },
    },
    defaultVariants: {
      state: "default",
      content: "note",
      valid: true,
    },
  }
);

const noteGridClasses = cva(
  "flex h-full w-full flex-wrap p-[2px] text-xs font-normal text-slate-500 sm:p-[4px] sm:text-sm"
);

export default function Cell({ cell, row, col, selected, isRelated, onSelect }: Props) {
  const hasNotes = Object.values(cell.notes).some(Boolean);
  const showValue = cell.value !== null && !hasNotes;

  const cellState = selected ? "selected" : isRelated ? "related" : "default";
  const contentType = cell.clues ? "clue" : "note";

  return (
    <button
      onClick={() => onSelect({ row, col })}
      className={cn(
        cellVariants({
          state: cellState,
          content: contentType,
          valid: cell.valid,
        })
      )}
    >
      {showValue ? (
        <div>{cell.value}</div>
      ) : hasNotes ? (
        <div className={noteGridClasses()}>
          {Nums.map((n) => (
            <div key={n} className="flex h-1/3 w-1/3 items-center justify-center">
              {cell.notes[n as NumType] ? n : ""}
            </div>
          ))}
        </div>
      ) : (
        <div className="opacity-0">0</div>
      )}
    </button>
  );
}
