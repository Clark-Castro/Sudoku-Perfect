"use client";

import { useEffect, useState } from "react";

import GridView from "@/components/GridView";
import StatusBar from "@/components/StatusBar";
import Toolbar from "@/components/ToolBar";
import useSudoku from "@/hooks/useSudoku";
import { NumType, Pose, Diff } from "@/types/types";

const diffOptions: Diff[] = ["easy", "medium", "hard"];

export default function Page() {
  const [difficulty, setDifficulty] = useState<Diff>("medium");

  const sudoku = useSudoku(difficulty);

  const {
    pencilMode,
    setCellValue,
    toggleNote,
    setPencilMode,
    isLoading,
    solution,
    setGrid,
    setRunning,
  } = sudoku;

  const [selected, setSelected] = useState<Pose | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selected) return;
      const { row, col } = selected;

      if (/^[0-8]$/.test(e.key)) {
        const num = Number(e.key) as NumType;
        if (pencilMode) toggleNote(row, col, num);
        else setCellValue(row, col, num);
        e.preventDefault();
      }

      if (e.key === "p" || e.key === "P") {
        setPencilMode((p: boolean) => !p);
        e.preventDefault();
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        setCellValue(row, col, null);
        e.preventDefault();
      }

      if (e.key === "ArrowUp") {
        setSelected((pose) => (pose ? { row: (pose.row + 8) % 9, col: pose.col } : pose));
      }
      if (e.key === "ArrowDown") {
        setSelected((pose) => (pose ? { row: (pose.row + 1) % 9, col: pose.col } : pose));
      }
      if (e.key === "ArrowLeft") {
        setSelected((pose) => (pose ? { row: pose.row, col: (pose.col + 8) % 9 } : pose));
      }
      if (e.key === "ArrowRight") {
        setSelected((pose) => (pose ? { row: pose.row, col: (pose.col + 1) % 9 } : pose));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, pencilMode, setCellValue, toggleNote, setPencilMode]);

  const doGenerate = (newDifficulty: Diff) => {
    sudoku.generateNewPuzzle(newDifficulty);
    setDifficulty(newDifficulty);
    setSelected(null);
  };

  const doSolve = () => {
    if (!solution) return;
    setGrid(solution);
    setRunning(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
        <h1 className="mb-8 text-4xl font-extrabold text-slate-800 sm:text-5xl">
          Sudoku Perfect 🧠
        </h1>
        <div className="text-xl text-slate-600">Generating puzzle...</div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <h1 className="mb-8 text-4xl font-extrabold text-slate-800 sm:text-5xl">Sudoku Perfect 🧠</h1>
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
      <div className="flex w-full max-w-lg flex-col items-center lg:max-w-xl xl:max-w-2xl">
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
            onTogglePencil={() => setPencilMode((p: boolean) => !p)}
          />
        </div>
        <div className="mt-0">
          <GridView grid={sudoku.grid} selected={selected} onSelect={(p) => setSelected(p)} />
        </div>
      </div>
    </div>
  );
}
