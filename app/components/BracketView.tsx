"use client";

import {
  BracketState,
  KNOCKOUT_MATCHES,
  getMatchTeams,
  getTeamAtPosition,
  GROUP_LETTERS,
} from "../lib/bracketState";
import { getGroupByLetter } from "../data/groups";
import TeamFlag from "./TeamFlag";

interface BracketViewProps {
  state: BracketState;
}

export default function BracketView({ state }: BracketViewProps) {
  const finalMatch = KNOCKOUT_MATCHES.find((m) => m.id === "m103");
  const champion = finalMatch ? getMatchTeams(finalMatch, state) : undefined;
  const championTeam =
    state.knockoutPicks["m103"] !== undefined && state.knockoutPicks["m103"] !== -1
      ? state.knockoutPicks["m103"] === 0
        ? champion?.home
        : champion?.away
      : undefined;

  const runnerUpTeam =
    state.knockoutPicks["m103"] !== undefined && state.knockoutPicks["m103"] !== -1
      ? state.knockoutPicks["m103"] === 0
        ? champion?.away
        : champion?.home
      : undefined;

  const thirdPlaceMatch = KNOCKOUT_MATCHES.find((m) => m.id === "m104");
  const thirdPlaceTeams = thirdPlaceMatch ? getMatchTeams(thirdPlaceMatch, state) : undefined;
  const thirdPlaceTeam =
    state.knockoutPicks["m104"] !== undefined && state.knockoutPicks["m104"] !== -1
      ? state.knockoutPicks["m104"] === 0
        ? thirdPlaceTeams?.home
        : thirdPlaceTeams?.away
      : undefined;

  return (
    <div className="space-y-8">
      {/* Champion banner */}
      {championTeam && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="text-sm text-amber-700 font-medium uppercase tracking-wider mb-2">
            🏆 Predicted Champion
          </div>
          <div className="text-4xl font-bold text-amber-900 mb-1">
            {championTeam.flag} {championTeam.name}
          </div>
        </div>
      )}

      {/* Runner-up & 3rd Place */}
      {(runnerUpTeam || thirdPlaceTeam) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {runnerUpTeam && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-6 text-center">
              <div className="text-sm text-slate-600 font-medium uppercase tracking-wider mb-1">
                🥈 Runner-Up
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {runnerUpTeam.flag} {runnerUpTeam.name}
              </div>
            </div>
          )}
          {thirdPlaceTeam && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="text-sm text-orange-600 font-medium uppercase tracking-wider mb-1">
                🥉 Third Place
              </div>
              <div className="text-xl font-bold text-orange-800">
                {thirdPlaceTeam.flag} {thirdPlaceTeam.name}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Group Standings */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Group Stage Standings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {GROUP_LETTERS.map((letter) => {
            const group = getGroupByLetter(letter);
            if (!group) return null;
            const order = state.groupOrders[letter] ?? [0, 1, 2, 3];
            const positions = ["1st", "2nd", "3rd", "4th"];
            const badgeStyles = [
              "bg-yellow-100 text-yellow-800 border-yellow-300",
              "bg-zinc-100 text-zinc-700 border-zinc-300",
              "bg-orange-50 text-orange-700 border-orange-200",
              "bg-red-50 text-red-700 border-red-200",
            ];

            return (
              <div key={letter} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                  Group {letter}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {order.map((teamIndex, pos) => {
                    const team = group.teams[teamIndex];
                    return (
                      <div key={teamIndex} className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${badgeStyles[pos]}`}>
                          {positions[pos]}
                        </span>
                        <TeamFlag name={team.name} flag={team.flag} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advancing 3rd Place Teams */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Advancing Third-Place Teams</h2>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
          {state.advancingThirdPlace.length === 0 ? (
            <p className="text-zinc-400 text-sm">No third-place teams selected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.advancingThirdPlace.map((letter) => {
                const name = getTeamAtPosition(letter, 2, state.groupOrders);
                const group = getGroupByLetter(letter);
                const team = group?.teams.find((t) => t.name === name);
                return (
                  <span
                    key={letter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-sm border border-green-200"
                  >
                    <span>{team?.flag}</span>
                    <span className="font-medium">{name}</span>
                    <span className="text-green-600 text-xs">(Group {letter})</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Knockout Results */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Knockout Stage Results</h2>
        <div className="space-y-4">
          {[
            { label: "Round of 32", ids: ["m73","m74","m75","m76","m77","m78","m79","m80","m81","m82","m83","m84","m85","m86","m87","m88"] },
            { label: "Round of 16", ids: ["m89","m90","m91","m92","m93","m94","m95","m96"] },
            { label: "Quarter-Finals", ids: ["m97","m98","m99","m100"] },
            { label: "Semi-Finals", ids: ["m101","m102"] },
            { label: "Final & 3rd Place", ids: ["m103","m104"] },
          ].map((round) => (
            <div key={round.label}>
              <h3 className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                {round.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {round.ids.map((matchId) => {
                  const match = KNOCKOUT_MATCHES.find((m) => m.id === matchId);
                  if (!match) return null;
                  const teams = getMatchTeams(match, state);
                  const pick = state.knockoutPicks[match.id];
                  const hasPick = pick !== undefined && pick !== -1;
                  const winner = hasPick ? (pick === 0 ? teams.home : teams.away) : undefined;

                  return (
                    <div
                      key={matchId}
                      className={`bg-white rounded-lg border p-3 text-sm ${
                        hasPick ? "border-green-300 bg-green-50" : "border-zinc-200"
                      }`}
                    >
                      <div className="text-xs text-zinc-400 mb-1.5">{match.label}</div>
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1.5 ${hasPick && pick === 0 ? "font-bold text-green-800" : "text-zinc-500"}`}>
                          {teams.home ? (
                            <>
                              <span>{teams.home.flag}</span>
                              <span>{teams.home.name}</span>
                            </>
                          ) : (
                            <span className="text-zinc-300">TBD</span>
                          )}
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasPick && pick === 1 ? "font-bold text-green-800" : "text-zinc-500"}`}>
                          {teams.away ? (
                            <>
                              <span>{teams.away.flag}</span>
                              <span>{teams.away.name}</span>
                            </>
                          ) : (
                            <span className="text-zinc-300">TBD</span>
                          )}
                        </div>
                      </div>
                      {winner && (
                        <div className="mt-1.5 text-xs text-green-700 font-medium">
                          → Winner: {winner.flag} {winner.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
