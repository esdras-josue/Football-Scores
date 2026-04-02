const dotenv = require("dotenv");
dotenv.config();
const express = require('express');

const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


app.get('/matches/top-leagues', async (req, res) => {
    try {
        const leagues = ["PL", "PD", "SA", "FL1", "CL"];
        const request = leagues.map(code => 
            fetch(`https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=2026-04-04&dateTo=2026-04-05&status=SCHEDULED`, {
                headers: {
                    "X-Auth-Token": process.env.FOOTBALL_API_TOKEN
                }
            }).then(res => res.json())
        );

        const results = await Promise.all(request);

        const formatted = results.map(league => ({
            league: league.competition.name,
            matches: league.matches.map(match =>({
                id: match.id,
                homeTeam: match.homeTeam.name,
                homeTeamCrest: match.homeTeam.crest,
                awayTeam: match.awayTeam.name,
                awayTeamCrest: match.awayTeam.crest,
                score: match.score.fullTime,
                date: match.utcDate,
                status: match.status
            }))
        }));

        res.json(formatted);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo partidos" });
    }
});

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log(`Aplicacion corriendo en puerto ${PORT}`);
});

