"use client";
import { fetchTopLeagueMatches } from "../services/api";
import { useEffect, useState } from "react";
import MatchList from "../components/MatchList";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // change day
  const changeDay = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  // formmated date
  const formatDate = (date: string) => {
    const today = new Date().toISOString().split("T")[0];

    if (date === today) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date === tomorrow.toISOString().split("T")[0]) return "Tomorrow";

    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    fetchTopLeagueMatches(date)
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B2A18] text-white p-5">
        <h1 className="text-xl font-bold mb-6">Football City </h1>
        <p className="text-gray-400">Cargando partidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white flex justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.promiedos.com.ar/assets/main/bg-mobile.webp')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-3xl p-5">

        <h1 className="text-2xl font-bold mb-4 text-center">Footbal City</h1>

      <div className="flex items-center justify-between mb-4 bg-[#163629] p-2 rounded">
        <button
          onClick={() => changeDay(-1)}
          className="px-3 py-1 bg-black/30 rounded"
        >
          {"<"}
        </button>

        <span className="font-semibold">
          {formatDate(date)}
        </span>

        <button
          onClick={() => changeDay(1)}
          className="px-3 py-1 bg-black/30 rounded"
        >
          {">"}
        </button>
      </div>
        <MatchList data={data} />
      </div>
    </div>
  );
}
