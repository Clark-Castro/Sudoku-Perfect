"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { checkIfSolved, solve } from "@/logic/solver";
import { runValidation } from "@/logic/validator";
import { Grid, Diff, NumType, Pose } from "@/types/types";
import { deepClone } from "@/utils/gridUtils";

const STORAGE_KEY = "sudoku_perfect_v1";

export type SavePayload = {
  grid: Grid;
  elapsedMs: number;
  pencilMode: boolean;
  difficulty?: Diff;
};

export default function useSudoku(initial: Grid, initialSolution?: Grid) {
  const initialGridRef = useRef(deepClone(initial));
  const initialSolutionRef = useRef(deepClone(initialSolution));
  const initialValidatedGrid = runValidation(initial);

  const [isClientInitialized, setIsClientInitialized] = useState(false);

  const [grid, setGrid] = useState<Grid>(initialValidatedGrid);
  const [solution, setSolution] = useState<Grid | null>(() => initialSolution ?? solve(initial));
  const [pencilMode, setPencilMode] = useState(false);
  const [history, setHistory] = useState<Grid[]>([]);
  const [future, setFuture] = useState<Grid[]>([]);

  const [running, setRunning] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      let isSolvedOnLoad = false;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
          isSolvedOnLoad = checkIfSolved(initialValidatedGrid);
        } else {
          const parsed: SavePayload = JSON.parse(raw);
          if (parsed?.grid) {
            const restoredGrid = parsed.grid;
            const newSolution = solve(restoredGrid);
            const validatedGrid = runValidation(restoredGrid);
            isSolvedOnLoad = checkIfSolved(validatedGrid);

            setGrid(() => validatedGrid);
            setSolution(() => newSolution);
            setElapsedMs(() => parsed.elapsedMs ?? 0);
            setPencilMode(() => parsed.pencilMode ?? false);
          }
        }
      } catch {
        // Ignore errors
      }

      setRunning((prev) => (isSolvedOnLoad ? false : prev));

      setIsClientInitialized(true);
    }, 0);

    return () => clearTimeout(id);
  }, [initialValidatedGrid]);

  useEffect(() => {
    if (!isClientInitialized) return;

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
        timerRef.current = null;
      }
      lastTickRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, isClientInitialized]);

  const pushHistory = useCallback((g: Grid) => {
    setHistory((h) => [...h, deepClone(g)]);
    setFuture([]);
  }, []);

  const updateGridState = useCallback((newGrid: Grid) => {
    const validatedGrid = runValidation(newGrid);
    const isSolved = checkIfSolved(validatedGrid);

    if (isSolved) {
      setRunning(false);
    }

    return validatedGrid;
  }, []);

  const setCellValue = useCallback(
    (r: number, c: number, value: NumType) => {
      if (!running && !checkIfSolved(grid)) {
        setRunning(true);
      }

      setGrid((prev) => {
        const clone = deepClone(prev);
        if (clone[r][c].clues) return prev;
        pushHistory(prev);

        clone[r][c].value = value;
        clone[r][c].notes = {};

        return updateGridState(clone);
      });
    },
    [pushHistory, updateGridState, running, grid]
  );

  const toggleNote = useCallback(
    (r: number, c: number, n: NumType) => {
      setGrid((prev) => {
        const clone = deepClone(prev);
        if (clone[r][c].clues) return prev;
        pushHistory(prev);
        clone[r][c].notes[n] = !clone[r][c].notes[n];

        return updateGridState(clone);
      });
    },
    [pushHistory, updateGridState]
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];

      if (!running) setRunning(true);

      setGrid((prev) => {
        setFuture((f) => [deepClone(prev), ...f]);
        return updateGridState(last);
      });

      return h.slice(0, -1);
    });
  }, [updateGridState, running]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];

      if (!running) setRunning(true);

      setGrid((prev) => {
        setHistory((h) => [...h, deepClone(prev)]);
        return updateGridState(next);
      });

      return f.slice(1);
    });
  }, [updateGridState, running]);

  const loadPuzzle = useCallback(
    (p: Grid, solved?: Grid) => {
      const newSolution = solved ?? solve(p);

      initialSolutionRef.current = deepClone(newSolution);
      initialGridRef.current = deepClone(p);

      let gridToLoad = deepClone(p);

      setSolution(newSolution);
      setHistory([]);
      setFuture([]);
      setElapsedMs(0);
      setRunning(true);

      setGrid(updateGridState(gridToLoad));
    },
    [updateGridState]
  );

  const resetToInitial = useCallback(() => {
    setSolution(deepClone(initialSolutionRef.current));
    setHistory([]);
    setFuture([]);
    setElapsedMs(0);
    setRunning(true);

    setGrid(updateGridState(deepClone(initialGridRef.current)));
  }, [updateGridState]);

  const getHint = useCallback((): { pos?: Pose; value?: NumType } | null => {
    if (!solution) return null;
    for (let row = 0; row < 9; row++)
      for (let col = 0; col < 9; col++)
        if (grid[row][col].value === null) {
          return { pos: { row, col }, value: solution[row][col].value as NumType };
        }
    return null;
  }, [grid, solution]);

  // --- Persistence (Autosave) ---
  useEffect(() => {
    if (!isClientInitialized) return;

    const save = () => {
      try {
        const payload: SavePayload = {
          grid,
          elapsedMs,
          pencilMode,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore
      }
    };
    const id = window.setInterval(save, 2000);
    return () => window.clearInterval(id);
  }, [grid, elapsedMs, pencilMode, isClientInitialized]);

  return {
    grid,
    setGrid,
    pencilMode,
    setPencilMode,
    running,
    setRunning,
    elapsedMs,
    // actions
    setCellValue,
    toggleNote,
    undo,
    redo,
    loadPuzzle,
    resetToInitial,
    getHint,
    solution,
    history,
    future,
    isClientInitialized,
  } as const;
}
