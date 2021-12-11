export interface gameInterface {
  avatar: string;
  email: string;
  endTime: Date;
  startTime: Date;
  geoLocation: Geolocation;
  ip: string;
  stage: string;
  teamName: string;
  totalScore: number;
  gameData: {
    answer: string;
    hintsPenalty: number;
    hintsUsed: number;
    puzzleRef: string;
    rawScore: number;
    solutionType: string;
    timeTaken: number;
    totalScore: number;
  }[]
}
