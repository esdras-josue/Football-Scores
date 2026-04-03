"use client";
import React from "react";
import Image from "next/image";
import { League } from "../types/Leagues";
import { Match } from "../types/Match";

type Props = {
  data: League[];
};

export default function MatchList({ data }: Props) {
  return (
    <div className="w-full max-w-3xl">
      {/*<h1 className="text-xl font-bold mb-6 text-bg-white">Footbal City</h1>*/}

      {data.map((league, index) => (
        <div key={index} className="mb6">
          {/* 🏆 Liga */}
          <h2 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-1">
            {league.league}
          </h2>

          {/*⚽ Matches */}
          {league.matches.map((match: Match) => (
            <div
              key={match.id}
              className="flex items-center justify-between bg-[#163629] px-3 py-2 rounded-md mb-1 text-sm"
            >
              {/* HomeTeam */}
              <div className="flex items-center gap-2 w-[40%]">
                <Image
                  src={match.homeTeamCrest || "/placeholder.png"}
                  alt={match.homeTeam || "HomeTeam"}
                  width={20}
                  height={20}
                />
                <span className="truncate">{match.homeTeam}</span>
              </div>

              {/* CENTER */}
              <div className="w-[20%] text-center font-bold">
                {match.status === "FINISHED"
                  ? `${match.score?.home ?? 0} - ${match.score?.away ?? 0}`
                  : new Date(match.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </div>
              {/* AwayTeam */}
              <div className="flex items-center justify-end gap-2 w-[40%]">
                <Image
                  src={match.awayTeamCrest || "/placeholder.png"}
                  alt={match.awayTeam || "AwayTeam"}
                  width={24}
                  height={24}
                />
                <span className="truncate">{match.awayTeam}</span>

                <span className="ml-2 text-xs text-gray-400 text-left">
                  {match.status === "FINISHED" && "FT"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
