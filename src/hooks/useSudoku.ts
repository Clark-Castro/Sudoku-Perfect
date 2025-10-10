"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { checkIfSolved, solve } from "@/logic/solver";
import { runValidation } from "@/logic/validator";
import { Grid, NumType } from "@/types/types";
import { deepClone } from "@/utils/gridUtils";

export default function useSudoku(init: Grid, sol: Grid) {
  const initGridRef = useRef(deepClone(init));
  const solRef = useRef(deepClone(sol));
  const initValidGrid = runValidation(init);

  const [grid, setGrid] = useState(initValidGrid);
  const [solution, setSolution] = useState(solve(init));
  const [pencilMode, setPencilMode] = useState(false);
  const [running, setRunning] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (running) {
      lastTickRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const last = lastTickRef.current ?? now;
        setElapsedMs((prev) => prev + (now - last));
        lastTickRef.current = now;
      }, 500);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
      lastTickRef.current = 0;
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [running]);

  const updateGridState = useCallback((newGrid: Grid) => {
    const validatedGrid = runValidation(newGrid);
    const isSolved = checkIfSolved(validatedGrid);

    if (isSolved) {
      setRunning(false);
    }

    return validatedGrid;
  }, []);

  const setCellValue = useCallback(
    (row: number, col: number, value: NumType) => {
      setGrid((prev) => {
        const clone = deepClone(prev);
        if (clone[row][col].clues) return prev;

        clone[row][col].value = value;
        clone[row][col].notes = {};

        return updateGridState(clone);
      });
    },
    [updateGridState]
  );

  const toggleNote = useCallback(
    (row: number, col: number, note: NumType) => {
      setGrid((prev) => {
        const clone = deepClone(prev);
        if (clone[row][col].clues) return prev;
        clone[row][col].notes[note] = !clone[row][col].notes[note];

        return updateGridState(clone);
      });
    },
    [updateGridState]
  );

  const loadPuzzle = useCallback(
    (grid: Grid, solved: Grid) => {
      solRef.current = deepClone(solved);
      initGridRef.current = deepClone(grid);

      let gridToLoad = deepClone(grid);

      setSolution(solved);
      setElapsedMs(0);
      setRunning(true);
      setGrid(updateGridState(gridToLoad));
    },
    [updateGridState]
  );

  return {
    grid,
    setGrid,
    pencilMode,
    setPencilMode,
    running,
    setRunning,
    elapsedMs,
    setCellValue,
    toggleNote,
    loadPuzzle,
    solution,
  } as const;
}
