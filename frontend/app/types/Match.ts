export type Match = {
    id: number;
    homeTeam: string;
    homeTeamCrest: string;
    awayTeam: string;
    awayTeamCrest: string;
    score: {
        home: number | null;
        away: number | null;
    };

    date: string;
    status: string;
};
