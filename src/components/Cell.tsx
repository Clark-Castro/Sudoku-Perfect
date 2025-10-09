import { allNums, cn } from "@/logic/utils";
import { Cell as CellType, NumberType, Pos } from "@/types/types";

type Props = {
  cell: CellType;
  r: number;
  c: number;
  selected: boolean;
  isRelated: boolean;
  selectedValue: NumberType | null;
  onSelect: (p: Pos) => void;
};

export default function Cell({ cell, r, c, selected, isRelated, selectedValue, onSelect }: Props) {
  const isIdentical = cell.value !== null && cell.value === selectedValue;
  const baseClasses =
    "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center font-mono transition-all duration-100 p-0 m-0 border-none outline-none";

  let bgClasses = "bg-white hover:bg-slate-100";
  if (selected) {
    bgClasses = "bg-sky-200 ring-2 ring-sky-400";
  } else if (isIdentical) {
    bgClasses = "bg-yellow-100 hover:bg-yellow-200";
  } else if (isRelated) {
    bgClasses = "bg-slate-50 hover:bg-slate-100";
  }

  const textClasses = [
    cell.readonly
      ? "font-bold text-slate-900 text-2xl sm:text-3xl"
      : "font-medium text-slate-800 text-xl sm:text-2xl",
    cell.invalid ? "text-red-600" : "",
  ];

  const finalClasses = cn(baseClasses, bgClasses, ...textClasses, "cursor-pointer select-none");

  const notes = cell.notes;
  const hasNotes = Object.keys(notes).length > 0;

  return (
    <button
      onClick={() => onSelect({ r, c })}
      className={finalClasses}
      aria-label={`Select cell at row ${r + 1}, column ${c + 1}`}
    >
      {!hasNotes && cell.value !== null ? (
        <div className={cell.readonly ? "text-slate-900" : "text-slate-800"}>{cell.value}</div>
      ) : hasNotes ? (
        <div className="grid h-full w-full grid-cols-3 p-[2px] text-xs font-normal text-slate-500 sm:p-[4px] sm:text-sm">
          {allNums.map((n) => (
            <div key={n} className="flex items-center justify-center">
              {notes[n as NumberType] ? n : ""}
            </div>
          ))}
        </div>
      ) : (
        <div className="opacity-0">1</div>
      )}
    </button>
  );
}
