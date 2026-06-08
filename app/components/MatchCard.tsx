"use client";

import TeamFlag from "./TeamFlag";

interface MatchCardProps {
  matchId: string;
  home?: { name: string; flag?: string };
  away?: { name: string; flag?: string };
  winner?: number; // 0 = home, 1 = away, -1 = not picked
  onPick?: (matchId: string, winner: number) => void;
  disabled?: boolean;
  label?: string;
}

export default function MatchCard({
  matchId,
  home,
  away,
  winner = -1,
  onPick,
  disabled = false,
  label,
}: MatchCardProps) {
  const handlePick = (side: number) => {
    if (disabled || !home || !away) return;
    if (onPick) {
      onPick(matchId, side);
    }
  };

  const getTeamStyle = (side: number) => {
    const base = "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all";
    if (disabled || !home || !away) {
      return `${base} bg-zinc-100 text-zinc-400 cursor-default`;
    }
    if (winner === side) {
      return `${base} bg-green-100 text-green-800 border-2 border-green-500`;
    }
    if (winner === -1) {
      return `${base} bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-400`;
    }
    return `${base} bg-white text-zinc-500 border-2 border-zinc-200`;
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-sm min-w-[180px]">
      {label && (
        <div className="text-xs text-zinc-400 font-medium mb-2 text-center uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => handlePick(0)}
          disabled={disabled || !home || !away}
          className={getTeamStyle(0)}
        >
          {home ? (
            <TeamFlag name={home.name} flag={home.flag ?? "🏳️"} size="sm" />
          ) : (
            <span className="text-zinc-400 text-sm">TBD</span>
          )}
        </button>
        <div className="text-center text-xs text-zinc-300 font-medium">vs</div>
        <button
          onClick={() => handlePick(1)}
          disabled={disabled || !home || !away}
          className={getTeamStyle(1)}
        >
          {away ? (
            <TeamFlag name={away.name} flag={away.flag ?? "🏳️"} size="sm" />
          ) : (
            <span className="text-zinc-400 text-sm">TBD</span>
          )}
        </button>
      </div>
    </div>
  );
}
