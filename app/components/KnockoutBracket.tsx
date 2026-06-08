"use client";

import { useState } from "react";
import {
  BracketState,
  KNOCKOUT_MATCHES,
  getMatchTeams,
  isMatchReady,
} from "../lib/bracketState";
import MatchCard from "./MatchCard";

interface KnockoutBracketProps {
  state: BracketState;
  onPick: (matchId: string, winner: number) => void;
  onGenerateLink: (name: string) => void;
}

const ROUNDS = [
  { label: "Round of 32", ids: ["m73","m74","m75","m76","m77","m78","m79","m80","m81","m82","m83","m84","m85","m86","m87","m88"] },
  { label: "Round of 16", ids: ["m89","m90","m91","m92","m93","m94","m95","m96"] },
  { label: "Quarter-Finals", ids: ["m97","m98","m99","m100"] },
  { label: "Semi-Finals", ids: ["m101","m102"] },
  { label: "3rd Place", ids: ["m104"], big: false },
  { label: "Final", ids: ["m103"], big: true },
];

export default function KnockoutBracket({ state, onPick, onGenerateLink }: KnockoutBracketProps) {
  const [userName, setUserName] = useState("");

  const renderMatch = (matchId: string, isBig = false) => {
    const match = KNOCKOUT_MATCHES.find((m) => m.id === matchId);
    if (!match) return null;

    const teams = getMatchTeams(match, state);
    const ready = isMatchReady(match, state);
    const pick = state.knockoutPicks[match.id];

    const card = (
      <MatchCard
        key={matchId}
        matchId={matchId}
        home={teams.home}
        away={teams.away}
        winner={pick ?? -1}
        onPick={onPick}
        disabled={!ready}
        label={match.label}
      />
    );

    if (isBig) {
      return (
        <div key={matchId} className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
          <div className="transform scale-110 origin-center">
            {card}
          </div>
        </div>
      );
    }

    return card;
  };

  const isComplete = state.knockoutPicks["m103"] !== undefined && state.knockoutPicks["m103"] !== -1;
  const finalMatch = KNOCKOUT_MATCHES.find((m) => m.id === "m103");
  const champion = finalMatch ? getMatchTeams(finalMatch, state) : undefined;
  const championTeam = isComplete
    ? (state.knockoutPicks["m103"] === 0 ? champion?.home : champion?.away)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">Knockout Stage</h2>
        <p className="text-zinc-500 text-sm">
          Click on a team to pick the winner of each match. Work through each round in order!
        </p>
      </div>

      {championTeam && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-sm text-amber-700 font-medium uppercase tracking-wider mb-2">
            🏆 Your Predicted Champion
          </div>
          <div className="text-3xl font-bold text-amber-900">
            {championTeam.flag} {championTeam.name}
          </div>
        </div>
      )}

      {/* Vertical rounds */}
      <div className="space-y-8">
        {ROUNDS.map((round) => (
          <div key={round.label}>
            <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">
              {round.label}
            </h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ${round.big ? "place-items-center" : ""}`}>
              {round.ids.map((matchId) => renderMatch(matchId, round.big))}
            </div>
          </div>
        ))}
      </div>

      {/* Share section — always visible */}
      <div className="bg-zinc-50 rounded-xl p-6 text-center space-y-4 w-full max-w-lg mx-auto mt-8">
        <h3 className="text-lg font-bold text-zinc-900">Share Your Bracket</h3>
        <p className="text-sm text-zinc-500">
          Enter your name below and we'll generate a shareable link to your bracket prediction.
        </p>
        <input
          type="text"
          placeholder="What is your name?"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-3 text-base bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => {
            if (userName.trim()) {
              onGenerateLink(userName.trim());
            }
          }}
          disabled={!userName.trim()}
          className={`w-full px-6 py-3 text-white text-base font-semibold rounded-lg transition-colors ${
            userName.trim()
              ? "bg-green-600 hover:bg-green-700 shadow-md"
              : "bg-zinc-400 cursor-not-allowed"
          }`}
        >
          🔗 Generate & Open Shareable Link
        </button>
        <p className="text-xs text-zinc-400">
          Your bracket will open in a new page that you can share with anyone.
        </p>
      </div>
    </div>
  );
}
