import { solCount } from "@/logic/solCounter";
import { solvedGenerate } from "@/logic/solvedGenerator";
import { Grid, Diff } from "@/types/types";
import { deepClone, shuffledPoses } from "@/utils/gridUtils";
import { cluesNum } from "@/utils/mathUtils";

export const unsolve = (difficulty: Diff = "medium") => {
  const solved = solvedGenerate();
  const puzzle = deepClone(solved);
  const targetClues = cluesNum(difficulty);
  const positions = shuffledPoses();

  let clues = 81;
  for (const pose of positions) {
    if (clues <= targetClues) break;
    const { row, col } = pose;
    const backup = puzzle[row][col].value;

    puzzle[row][col].value = null;
    const count = solCount(puzzle);

    if (count !== 1) {
      puzzle[row][col].value = backup;
    } else {
      clues--;
      puzzle[row][col].clues = true;
    }
  }

  return { puzzle, solved } as { puzzle: Grid; solved: Grid };
};
