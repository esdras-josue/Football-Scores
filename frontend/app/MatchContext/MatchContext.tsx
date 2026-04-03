"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchTopLeagueMatches } from "../services/api";
import { League } from "../types/Leagues";

type MatchContextType = {
  data: League[];
  loading: boolean;
  date: string;
  changeDay: (days: number) => void;
  formatDate: (date: string) => string;
};

const MatchContext = createContext<MatchContextType | null>(null);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const changeDay = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const formatDate = (date: string) => {
    const today = new Date().toISOString().split("T")[0];

    if (date === today) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date === tomorrow.toISOString().split("T")[0]) return "Tomorrow";

    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    setLoading(true);

    fetchTopLeagueMatches(date)
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <MatchContext.Provider
      value={{ data, loading, date, changeDay, formatDate }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) throw new Error("useMatch must be used inside MatchProvider");
  return context;
};
