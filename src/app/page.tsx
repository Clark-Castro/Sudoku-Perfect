"use client";

import { useEffect, useState } from "react";

import GridView from "@/components/GridView";
import StatusBar from "@/components/StatusBar";
import Toolbar from "@/components/ToolBar";
import useSudoku from "@/hooks/useSudoku";
import generatePuzzle from "@/logic/generator";
import { allNums } from "@/logic/utils";
import { NumberType, Pos, Difficulty, PuzzleData } from "@/types/types";

const initialDifficulty: Difficulty = "medium";
// Removed: const initialServerPuzzle: PuzzleData = generatePuzzle(initialDifficulty);

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard", "expert", "insane"];

export default function Page() {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  // FIX 1: Use a function for lazy state initialization to generate a new puzzle on mount
  const [puzzleData, setPuzzleData] = useState<PuzzleData>(() => generatePuzzle(initialDifficulty));
  // FIX 2: Add state to force a full component re-mount
  const [puzzleKey, setPuzzleKey] = useState(0);

  const sudoku = useSudoku(puzzleData.puzzle, puzzleData.solved);

  const [selected, setSelected] = useState<Pos | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selected) return;
      const { r, c } = selected;

      if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) as NumberType;
        if (sudoku.pencilMode) sudoku.toggleNote(r, c, n);
        else sudoku.setCellValue(r, c, n);
        e.preventDefault();
      }

      if (e.key === "p" || e.key === "P") {
        sudoku.setPencilMode((p) => !p);
        e.preventDefault();
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        sudoku.setCellValue(r, c, null);
        e.preventDefault();
      }

      if (e.key === "ArrowUp") setSelected((p) => ({ r: (p!.r + 8) % 9, c: p!.c }));
      if (e.key === "ArrowDown") setSelected((p) => ({ r: (p!.r + 1) % 9, c: p!.c }));
      if (e.key === "ArrowLeft") setSelected((p) => ({ r: p!.r, c: (p!.c + 8) % 9 }));
      if (e.key === "ArrowRight") setSelected((p) => ({ r: p!.r, c: (p!.c + 1) % 9 }));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, sudoku]);

  const doGenerate = (newDifficulty: Difficulty) => {
    const newPuzzleData = generatePuzzle(newDifficulty);

    setPuzzleData(newPuzzleData);

    sudoku.loadPuzzle(newPuzzleData.puzzle, newPuzzleData.solved);

    setDifficulty(newDifficulty);
    setSelected(null);
    // FIX 3: Increment key to force a full re-render/re-mount
    setPuzzleKey((k) => k + 1);
  };

  const doUndo = () => sudoku.undo();
  const doRedo = () => sudoku.redo();
  const doHint = () => {
    const hint = sudoku.getHint();
    if (!hint?.pos) return;
    sudoku.setCellValue(hint.pos.r, hint.pos.c, hint.value!);
  };

  // FIX (from previous interaction): Directly set the grid to the solution
  const doSolve = () => {
    if (!sudoku.solution) return;
    sudoku.setGrid(sudoku.solution);
    sudoku.setRunning(false);
  };

  const doClearCell = () => {
    if (!selected) return;
    sudoku.setCellValue(selected.r, selected.c, null);
  };

  const doResetPuzzle = () => {
    sudoku.resetToInitial();
    setSelected(null);
  };

  const selectedValue = selected ? sudoku.grid[selected.r][selected.c].value : null;

  if (!sudoku.isClientInitialized) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 sm:p-8 md:p-12">
        <h1 className="mb-8 text-4xl font-extrabold text-slate-800 sm:text-5xl">
          Sudoku Perfect 🧠
        </h1>
        <p className="mt-8 text-xl text-slate-700">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <h1 className="mb-8 text-4xl font-extrabold text-slate-800 sm:text-5xl">Sudoku Perfect 🧠</h1>

      {/* Difficulty Selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {difficultyOptions.map((d) => (
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
        key={puzzleKey}
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
            onUndo={doUndo}
            onRedo={doRedo}
            onHint={doHint}
            onSolve={doSolve}
            onTogglePencil={() => sudoku.setPencilMode((p) => !p)}
            pencilMode={sudoku.pencilMode}
          />
        </div>

        {/* Sudoku Grid */}
        <div className="mt-0">
          <GridView
            grid={sudoku.grid}
            selected={selected}
            selectedValue={selectedValue}
            onSelect={(p) => setSelected(p)}
          />
        </div>

        {/* Number pad / pencil mode */}
        <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3 sm:max-w-sm md:max-w-md">
          {allNums.map((n) => (
            <button
              key={n}
              onClick={() => {
                if (!selected) return;
                const { r, c } = selected;
                if (sudoku.pencilMode) sudoku.toggleNote(r, c, n as NumberType);
                else sudoku.setCellValue(r, c, n as NumberType);
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

          <button
            onClick={doClearCell}
            className="col-span-3 rounded-xl border border-red-200 bg-white px-2 py-3 text-xl font-medium text-red-600 shadow-lg transition-all hover:bg-red-50 active:scale-[0.98] sm:py-4"
          >
            Clear Cell
          </button>
          <button
            onClick={doResetPuzzle}
            className="col-span-3 rounded-xl border border-blue-200 bg-white px-2 py-3 text-xl font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 active:scale-[0.98] sm:py-4"
          >
            Reset Puzzle
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
