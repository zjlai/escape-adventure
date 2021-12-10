export interface puzzleInterface {
    id: string;
    uid: string;
    lang: string;
    alternate_languages: { [key: string]: string }[];
    data: {
        title: {
            type: string;
            text: string;
        };
        maxScore: number;
        scoretype: string;
        solutiontype: string;
        next: {
            id: string;
        };
        prev: {
            id: string;
        };
        content: {
            name: string;
            'content-title': {
                type: string;
                text: string;
            }[];
            'content-content': {
                text: string;
            }[];
            image: {
                url: string;
            };
        }[];
    }
}