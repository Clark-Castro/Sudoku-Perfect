import { Cell as CellType, NumType, Pose } from "@/types/types";
import { cn } from "@/utils/cssUtils";
import { Nums } from "@/utils/mathUtils";

type Props = {
  cell: CellType;
  row: number;
  col: number;
  selected: boolean;
  isRelated: boolean;
  selectedValue: NumType | null;
  onSelect: (p: Pose) => void;
};

export default function Cell({
  cell,
  row,
  col,
  selected,
  isRelated,
  selectedValue,
  onSelect,
}: Props) {
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
    cell.clues
      ? "font-bold text-slate-900 text-2xl sm:text-3xl"
      : "font-medium text-slate-800 text-xl sm:text-2xl",
    !cell.valid ? "text-red-600" : "",
  ];

  const finalClasses = cn(baseClasses, bgClasses, ...textClasses, "cursor-pointer select-none");

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
        <div className="grid h-full w-full grid-cols-3 p-[2px] text-xs font-normal text-slate-500 sm:p-[4px] sm:text-sm">
          {Nums.map((n) => (
            <div key={n} className="flex items-center justify-center">
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
