"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { unsolve } from "@/logic/unsolver";
import { isSolved, runValidation } from "@/logic/validators";
import { Grid, NumType, Diff } from "@/types/types";
import { deepClone, emptyNote, emptyGrid } from "@/utils/gridUtils";

type PuzzleData = { puzzle: Grid; solved: Grid };

// Helper function to get an empty grid structure
const getEmptyGridData = (): PuzzleData => ({
  puzzle: emptyGrid(),
  solved: emptyGrid(),
});

// FIX: New helper function to ensure any cell without a value is NOT a clue
const sanitizeGridClues = (grid: Grid): Grid => {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      // If the cell is empty (value is null), it must not be a clue.
      // If the cell has a value (0-8), it IS a clue (puzzle start state).
      clues: cell.value !== null,
      notes: emptyNote(),
    }))
  );
};

export default function useSudoku(initialDifficulty: Diff) {
  const initialData = getEmptyGridData();

  const [puzzleData, setPuzzleData] = useState<PuzzleData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const [grid, setGrid] = useState(() => runValidation(initialData.puzzle));
  const [solution, setSolution] = useState(() => initialData.solved);

  const unsolRef = useRef(deepClone(initialData.puzzle));
  const solRef = useRef(deepClone(initialData.solved));

  const [pencilMode, setPencilMode] = useState(false);
  const [running, setRunning] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (isLoading) {
      const initialPuzzleData = unsolve(initialDifficulty);

      const sanitizedPuzzle = sanitizeGridClues(initialPuzzleData.puzzle);

      setPuzzleData({ ...initialPuzzleData, puzzle: sanitizedPuzzle });
      unsolRef.current = deepClone(sanitizedPuzzle);
      solRef.current = deepClone(initialPuzzleData.solved);
      setSolution(initialPuzzleData.solved);
      setGrid(runValidation(sanitizedPuzzle));

      setElapsedMs(0);
      setRunning(true);
      setIsLoading(false);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (running) {
      lastTickRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const last = lastTickRef.current ?? now;
        setElapsedMs((prev) => prev + (now - last));
        lastTickRef.current = now;
      }, 1000);
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
    const isGridSolved = isSolved(validatedGrid);

    if (isGridSolved) {
      setRunning(false);
    }

    return validatedGrid;
  }, []);

  const setCellValue = useCallback(
    (row: number, col: number, value: NumType | null) => {
      setGrid((prev) => {
        const clone = deepClone(prev);
        const cell = clone[row][col];

        if (cell.clues && cell.value !== value) {
          return prev;
        }

        if (value !== null) {
          const hasNotes = Object.values(cell.notes).some((v) => v);
          if (hasNotes) {
            cell.notes = emptyNote();
          }
        }

        cell.value = value;

        if (value !== null) {
          cell.notes = emptyNote();
        }

        return updateGridState(clone);
      });
    },
    [updateGridState]
  );

  const toggleNote = useCallback(
    (row: number, col: number, note: NumType) => {
      setGrid((prev) => {
        const clone = deepClone(prev);
        const cell = clone[row][col];

        if (cell.clues) return prev;

        if (cell.value !== null) {
          cell.value = null;
        }

        cell.notes[note] = !cell.notes[note];

        return updateGridState(clone);
      });
    },
    [updateGridState]
  );

  const generateNewPuzzle = useCallback((newDifficulty: Diff) => {
    setIsLoading(true);

    const newPuzzleData = unsolve(newDifficulty);

    const sanitizedPuzzle = sanitizeGridClues(newPuzzleData.puzzle);

    setPuzzleData({ ...newPuzzleData, puzzle: sanitizedPuzzle });
    unsolRef.current = deepClone(sanitizedPuzzle);
    solRef.current = deepClone(newPuzzleData.solved);

    setSolution(newPuzzleData.solved);
    setGrid(runValidation(sanitizedPuzzle));
    setElapsedMs(0);
    setRunning(true);
    setIsLoading(false);
  }, []);

  const loadPuzzle = useCallback((grid: Grid, solved: Grid) => {
    const newPuzzleData = { puzzle: grid, solved: solved };
    setPuzzleData(newPuzzleData);
    unsolRef.current = deepClone(newPuzzleData.puzzle);
    solRef.current = deepClone(newPuzzleData.solved);

    setSolution(solved);
    setGrid(runValidation(grid));
    setElapsedMs(0);
    setRunning(true);
  }, []);

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
    isLoading,
    generateNewPuzzle,
  } as const;
}
