"use client";

import { useEffect, useState } from "react";

import GridView from "@/components/GridView";
import StatusBar from "@/components/StatusBar";
import Toolbar from "@/components/ToolBar";
import useSudoku from "@/hooks/useSudoku";
import generatePuzzle from "@/logic/generator";
import { NumType, Pose, Diff } from "@/types/types";
import { Nums } from "@/utils/mathUtils";

const diffOptions: Diff[] = ["easy", "medium", "hard", "expert", "insane"];

export default function Page() {
  const [difficulty, setDifficulty] = useState<Diff>("medium");
  const [puzzleData, setPuzzleData] = useState(() => generatePuzzle("medium"));
  const [reRender, setReRender] = useState(false);

  const sudoku = useSudoku(puzzleData.puzzle, puzzleData.solved);

  const [selected, setSelected] = useState<Pose | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selected) return;
      const { row, col } = selected;

      if (/^[1-9]$/.test(e.key)) {
        const num = Number(e.key) as NumType;
        if (sudoku.pencilMode) sudoku.toggleNote(row, col, num);
        else sudoku.setCellValue(row, col, num);
        e.preventDefault();
      }

      if (e.key === "p" || e.key === "P") {
        sudoku.setPencilMode((p) => !p);
        e.preventDefault();
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        sudoku.setCellValue(row, col, 0);
        e.preventDefault();
      }

      if (e.key === "ArrowUp") setSelected((p) => ({ row: (p!.row + 8) % 9, col: p!.col }));
      if (e.key === "ArrowDown") setSelected((p) => ({ row: (p!.row + 1) % 9, col: p!.col }));
      if (e.key === "ArrowLeft") setSelected((p) => ({ row: p!.row, col: (p!.col + 8) % 9 }));
      if (e.key === "ArrowRight") setSelected((p) => ({ row: p!.row, col: (p!.col + 1) % 9 }));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, sudoku]);

  const doGenerate = (newDifficulty: Diff) => {
    const newPuzzleData = generatePuzzle(newDifficulty);

    setPuzzleData(newPuzzleData);

    sudoku.loadPuzzle(newPuzzleData.puzzle, newPuzzleData.solved);

    setDifficulty(newDifficulty);
    setSelected(null);
    setReRender((k) => !k);
  };

  const doSolve = () => {
    if (!sudoku.solution) return;
    sudoku.setGrid(sudoku.solution);
    sudoku.setRunning(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <h1 className="mb-8 text-4xl font-extrabold text-slate-800 sm:text-5xl">Sudoku Perfect 🧠</h1>

      {/* Difficulty Selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {diffOptions.map((d) => (
          <button
            key={d}
            onClick={() => doGenerate(d)}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${
              difficulty === d
                ? "bg-sky-600 text-white shadow-md"
                : "bg-gray-200 text-slate-700 hover:bg-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Main container ... */}
      <div
        // FIX 4: Apply the key here
        className="flex w-full max-w-lg flex-col items-center lg:max-w-xl xl:max-w-2xl"
      >
        <div className="mb-6 w-full">
          <StatusBar
            difficulty={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            elapsedMs={sudoku.elapsedMs}
            running={sudoku.running}
          />
        </div>

        <div className="mb-8">
          <Toolbar
            onNew={() => doGenerate(difficulty)}
            onSolve={doSolve}
            onTogglePencil={() => sudoku.setPencilMode((p) => !p)}
            pencilMode={sudoku.pencilMode}
          />
        </div>

        {/* Sudoku Grid */}
        <div className="mt-0">
          <GridView grid={sudoku.grid} selected={selected} onSelect={(p) => setSelected(p)} />
        </div>

        {/* Number pad / pencil mode */}
        <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3 sm:max-w-sm md:max-w-md">
          {Nums.map((n) => (
            <button
              key={n}
              onClick={() => {
                if (!selected) return;
                const { row, col } = selected;
                if (sudoku.pencilMode) sudoku.toggleNote(row, col, n as NumType);
                else sudoku.setCellValue(row, col, n as NumType);
              }}
              className="rounded-xl border border-gray-200 bg-white px-2 py-3 text-xl font-medium text-slate-900 shadow-lg transition-all hover:bg-sky-50 active:scale-[0.98] sm:py-4 sm:text-2xl"
            >
              {n}
            </button>
          ))}
          {/* Toggle Pencil Mode Button */}
          <button
            onClick={() => sudoku.setPencilMode((p) => !p)}
            className={`col-span-3 rounded-xl px-2 py-3 text-lg font-semibold shadow-lg transition-all sm:py-4 sm:text-xl ${
              sudoku.pencilMode
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200"
            }`}
          >
            {sudoku.pencilMode ? "PENCIL MODE: ON ✏️" : "PENCIL MODE: OFF"}
          </button>
        </div>

        {/* Status */}
        <div className="mt-8 text-center text-sm text-slate-500 sm:text-base">
          Click a cell or use keyboard (1–9). Arrow keys to move. <br className="sm:hidden" />
          **P** to toggle pencil mode. Backspace/Delete to clear.
        </div>
      </div>
    </div>
  );
}
