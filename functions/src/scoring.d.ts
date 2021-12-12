export interface scoringInterface {
  gameId: string;
  puzzleRef: string;
  hintsUsed: number;
  answer: string;
  timeTaken: number;
  hintsPenalty: number;
}

export interface solutionInterface {
  answer: string;
  maxScore: number;
  minScore: number;
  maxTime: number;
  minTime: number;
  next: string;
  timed: boolean;
  solutionType: string;
}
