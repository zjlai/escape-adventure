export interface puzzleInterface {
    contentType: string;
    next: boolean;
    previous: string;
    puzzle: {
        image: string;
        puzzle: string;
        puzzleRef: string;
        puzzleType: string;
        title: string;
    };
    puzzleType: string;
    storyblocks: {
        image: string | null;
        text: string;
        title: string;
    }[];
}

export interface HintsInterface {
    hintRef: string;
    totalHints: number;
    puzzleRef: string;
    penalties: number[];
}

export interface HintInterface {
    hint: string;
    level: number;
    penalty: number;
}
