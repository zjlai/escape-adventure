export interface puzzleInterface {
    id: string;
    name: string;
    maxScore: number;
    scoreType: string;
    solutionType: string;
    next: string;
    content: {
        name: string;
        title: string;
        content: string;
        image: string;
    }[];
}