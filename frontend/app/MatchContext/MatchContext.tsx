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
    return new Date().toLocaleDateString('en-CA');
  });

  const changeDay = (days: number) => {
    const [ year, month, day] = date.split('-').map(Number);
    const newDate = new Date(year, month -1, day);

    newDate.setDate(newDate.getDate() + days);

    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');

    setDate(`${y}-${m}-${d}`);
  };

  const formatDate = (date: string) => {

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };

    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

    if (date === todayStr) return "Today";
    if (date === tomorrowStr) return "Tomorrow";

    const [year, month, day] = date.split('-').map(Number);
    const finalDate = new Date(year, month - 1, day);

    return finalDate.toLocaleDateString(window.navigator.language, options) 
  };

  useEffect(() => {
    //setLoading(true);

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
