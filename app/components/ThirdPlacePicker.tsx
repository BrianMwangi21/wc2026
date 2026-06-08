"use client";

import { getTeamAtPosition, GROUP_LETTERS } from "../lib/bracketState";
import { getGroupByLetter } from "../data/groups";
import TeamFlag from "./TeamFlag";

interface ThirdPlacePickerProps {
  groupOrders: Record<string, number[]>;
  advancingThirdPlace: string[];
  onToggle: (letter: string) => void;
  onAutoSelect: () => void;
  onContinue: () => void;
}

export default function ThirdPlacePicker({
  groupOrders,
  advancingThirdPlace,
  onToggle,
  onAutoSelect,
  onContinue,
}: ThirdPlacePickerProps) {
  const allThirdPlace = GROUP_LETTERS.map((letter) => {
    const name = getTeamAtPosition(letter, 2, groupOrders);
    const group = getGroupByLetter(letter);
    const team = group?.teams.find((t) => t.name === name);
    return {
      letter,
      name: name ?? "",
      flag: team?.flag ?? "🏳️",
      rank: team?.fifaRank ?? 999,
      isSelected: advancingThirdPlace.includes(letter),
    };
  });

  const selectedCount = advancingThirdPlace.length;
  const isValid = selectedCount === 8;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">Third-Place Qualifiers</h2>
        <p className="text-zinc-500 text-sm max-w-lg mx-auto">
          Pick exactly 8 of the 12 third-place teams to advance to the Round of 32.
          The bracket will update based on your selection.
        </p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          isValid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
        }`}>
          {selectedCount} of 8 selected
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onAutoSelect}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
        >
          Auto-select top 8 by FIFA ranking
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {allThirdPlace.map((team) => (
          <button
            key={team.letter}
            onClick={() => onToggle(team.letter)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left
              ${team.isSelected
                ? "bg-green-50 border-green-400 shadow-sm"
                : "bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
              }
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${team.isSelected ? "border-green-500 bg-green-500" : "border-zinc-300"}
            `}>
              {team.isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <TeamFlag name={team.name} flag={team.flag} size="sm" showName={true} />
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Group {team.letter} · FIFA Rank #{team.rank}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`
            px-8 py-3 font-semibold rounded-full transition-colors shadow-md
            ${isValid
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
            }
          `}
        >
          Build Knockout Bracket →
        </button>
      </div>
    </div>
  );
}
