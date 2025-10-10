import countSolutions from "@/logic/solCounter";
import { isValidPlacement } from "@/logic/validator";
import { Grid, Diff } from "@/types/types";
import { deepClone, emptyGrid, idxToPose } from "@/utils/gridUtils";
import { Nums, randInt, shuffle } from "@/utils/mathUtils";

function generateSolvedGrid(): Grid {
  const grid = emptyGrid();
  const initialValue = randInt();
  grid[0][0].value = initialValue;

  function helper(idx = 1): boolean {
    if (idx === 81) return true;
    const { row, col } = idxToPose(idx);
    const shuffledNums = shuffle([...Nums]);

    for (const num of shuffledNums) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col].value = num;
        if (helper(idx + 1)) return true;
        grid[row][col].value = null;
      }
    }
    return false;
  }

  helper();
  return grid;
}

export default function generatePuzzle(difficulty: Diff = "medium") {
  const solved = generateSolvedGrid();
  const puzzle = deepClone(solved);

  const targetClues = {
    easy: randInt() + 40,
    medium: randInt() + 30,
    hard: randInt() + 20,
  }[difficulty];

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => ({
      row: idxToPose(i).row,
      col: idxToPose(i).col,
    }))
  );

  let clues = 81;
  for (const pose of positions) {
    if (clues <= targetClues) break;
    const { row, col } = pose;
    const backup = puzzle[row][col].value;

    puzzle[row][col].value = null;
    const solCount = countSolutions(puzzle);

    if (solCount !== 1) {
      puzzle[row][col].value = backup;
    } else {
      clues--;
    }
  }

  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) puzzle[row][col].clues = puzzle[row][col].value !== null;

  return { puzzle, solved } as { puzzle: Grid; solved: Grid };
}
