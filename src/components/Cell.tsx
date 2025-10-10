"use client";

import { useEffect, useState } from "react";

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
    "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center font-mono transition-all duration-100 p-0 m-0 border-none outline-none cursor-pointer select-none ";
  const [bgClasses, setBgClasses] = useState("bg-white hover:bg-slate-100 ");
  const [textClasses, setTextClasses] = useState("");
  const [validClasses, setValidClasses] = useState("");
  const [finalClasses, setFinalClasses] = useState("");

  useEffect(() => {
    if (selected) {
      setBgClasses("bg-sky-200 ring-2 ring-sky-400 ");
    } else if (isRelated) {
      setBgClasses("bg-slate-50 hover:bg-slate-100 ");
    }

    if (cell.clues) {
      setTextClasses("font-bold text-slate-900 text-2xl sm:text-3xl ");
    } else {
      setTextClasses("font-medium text-slate-800 text-xl sm:text-2xl ");
    }

    if (cell.valid) {
      setValidClasses("");
    } else {
      setValidClasses("text-red-600 ");
    }
  }, [selected, isRelated, cell.clues, cell.valid]);

  useEffect(() => {
    setFinalClasses(baseClasses + bgClasses + textClasses + validClasses);
  }, [bgClasses, validClasses, textClasses]);

  const notes = cell.notes;
  const hasNotes = Object.keys(notes).length > 0;

  return (
    <button
      onClick={() => onSelect({ row, col })}
      className={finalClasses}
      aria-label={`Select cell at row ${row + 1}, column ${col + 1}`}
    >
      {!hasNotes && cell.value !== null ? (
        <div className={cell.clues ? "text-slate-900" : "text-slate-800"}>{cell.value}</div>
      ) : hasNotes ? (
        <div className="flex h-full w-full p-[2px] text-xs font-normal text-slate-500 sm:p-[4px] sm:text-sm">
          {Nums.map((n) => (
            <div key={n} className="flex h-1/3 w-1/3 items-center justify-center">
              {notes[n as NumType] ? n : ""}
            </div>
          ))}
        </div>
      ) : (
        <div className="opacity-0">1</div>
      )}
    </button>
  );
}
