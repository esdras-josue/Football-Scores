

const API_URL = 'http://localhost:5000/matches';

export const fetchTopLeagueMatches = async(date: string) => {
    try {
        const response = await fetch(`${API_URL}/top-leagues?date=${date}`);

        if(!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}