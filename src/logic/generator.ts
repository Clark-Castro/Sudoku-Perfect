import countSolutions from "@/logic/solCounter";
import { allNums, deepCloneGrid, makeEmptyGrid, randInt, shuffle } from "@/logic/utils";
import isValidPlacement from "@/logic/validator";
import { Grid, Difficulty } from "@/types/types";

// Generate a full solved grid
function generateSolvedGrid(): Grid {
  const g = makeEmptyGrid();

  // FIX: Force a random initial value in the first cell (0, 0)
  // This breaks the solver's tendency to find the same solution path first.
  const initialValue = allNums[Math.floor(Math.random() * allNums.length)];
  g[0][0].value = initialValue;

  // The recursive solver starts from the second cell (index 1)
  function helper(idx = 1): boolean {
    if (idx === 81) return true;
    const r = Math.floor(idx / 9);
    const c = idx % 9;

    const nums = shuffle([...allNums]);
    for (const n of nums) {
      if (isValidPlacement(g, r, c, n)) {
        g[r][c].value = n;
        if (helper(idx + 1)) return true;
        g[r][c].value = null;
      }
    }
    return false;
  }

  const ok = helper();

  if (!ok) {
    // Fallback in case the initial random value led to a dead end
    g[0][0].value = null;
    const ok2 = helper(0);
    if (!ok2) throw new Error("failed to generate solved grid");
  }

  return g;
}

export default function generatePuzzle(difficulty: Difficulty = "medium") {
  const solved = generateSolvedGrid();
  const puzzle = deepCloneGrid(solved);

  const targetClues = {
    // Sudoku puzzles are considered solvable with 17 clues, but
    // generator difficulty is mostly based on number of empty cells left.
    easy: randInt(40, 48), // Plenty of initial numbers
    medium: randInt(35, 39),
    hard: randInt(30, 34),
    expert: randInt(25, 29), // Getting tough
    insane: randInt(22, 24), // Closer to the minimum required clues (17-21)
  }[difficulty];

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => ({ r: Math.floor(i / 9), c: i % 9 }))
  );

  let clues = 81;
  for (const pos of positions) {
    // Stop when we reach the minimum clue count for the desired difficulty
    if (clues <= targetClues) break;
    const { r, c } = pos;
    const backup = puzzle[r][c].value;

    // Attempt to remove a cell
    puzzle[r][c].value = null;

    // Check if the removal leaves a unique solution
    // Note: countSolutions is an expensive operation.
    const solCount = countSolutions(puzzle, 2);

    if (solCount !== 1) {
      // If not unique (0 or 2+ solutions), restore the value
      puzzle[r][c].value = backup;
    } else {
      // If unique, keep it removed
      clues--;
    }
  }

  // Set readonly property for initial clues
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) puzzle[r][c].readonly = puzzle[r][c].value !== null;

  return { puzzle, solved } as { puzzle: Grid; solved: Grid };
}
