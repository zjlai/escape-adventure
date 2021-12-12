interface gameInterface {
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

interface puzzleInterface {
  title: string;
  solutionType: string;
  prev: string;
  content: {
    title:string;
    layout: string;
    media: {
      layoutField: string;
      type: string;
      url: string;
    }[];
  };
}

interface hintInterface {
  puzzleRef?: string;
  hintRef?: string;
  hintLevel?: number;
}

interface hintsResponseInterface {
  hintId: string;
  totalHints: number;
}

export {
  gameInterface,
  puzzleInterface,
  hintInterface,
  hintsResponseInterface,
};
