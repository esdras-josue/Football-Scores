const dotenv = require("dotenv");
dotenv.config();
const express = require('express');

const cors = require('cors');
const cache = new Map();
const TTL = 1000 * 60 * 5; // 5 minutos


const app = express();
app.use(cors());
app.use(express.json());


app.get('/matches/top-leagues', async (req, res) => {
    try {
        const leagues = ["PL", "PD", "SA", "FL1", "CL"];
        const {date} = req.query;

        if(!date) {
            return res.status(400).json({ message: "Date is required (YYYY-MM-DD)"});
        }

        const key = `matches:${date}`;
        const cached = cache.get(key);

        if (cached) {
            const isValid = Date.now() - cached.timeStamp  < TTL;

            if(isValid) {
                console.log("CACHE HIT");
                return res.json(cached.data);
            } else {
                cache.delete(key);
            }
        }

        const request = leagues.map(code => 
            fetch(`https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${date}&dateTo=${date}&status=SCHEDULED,FINISHED`, {
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
        }))
        .filter(league => league.matches.length > 0);

        cache.set(key,{ 
            data: formatted,
            timeStamp: Date.now()
        });

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

