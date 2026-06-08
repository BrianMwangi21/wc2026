"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BracketState,
  initialState,
  getDefaultAdvancingThirdPlace,
  KNOCKOUT_MATCHES,
} from "./lib/bracketState";
import { encodeState, decodeState } from "./lib/urlCodec";
import { groups } from "./data/groups";
import GroupStage from "./components/GroupStage";
import ThirdPlacePicker from "./components/ThirdPlacePicker";
import KnockoutBracket from "./components/KnockoutBracket";
import BracketView from "./components/BracketView";

const STORAGE_KEY = "wc2026_bracket";

export default function BracketApp() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<BracketState>(initialState);
  const [isViewMode, setIsViewMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // On mount: either load shared link (view mode) or load from localStorage (edit mode)
  useEffect(() => {
    const encoded = searchParams.get("b");
    const nameParam = searchParams.get("n");
    if (encoded) {
      const decoded = decodeState(encoded);
      if (decoded) {
        setState({ ...initialState, ...decoded, step: "knockout" });
        setIsViewMode(true);
        if (nameParam) setUserName(nameParam);
      } else {
        setIsViewMode(false);
      }
    } else {
      // Edit mode: load from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as BracketState;
          setState({ ...initialState, ...parsed });
        }
      } catch {
        // ignore parse errors
      }
      setIsViewMode(false);
    }
    setIsLoaded(true);
  }, [searchParams]);

  // Auto-save to localStorage in edit mode
  useEffect(() => {
    if (!isLoaded || isViewMode) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state, isLoaded, isViewMode]);

  const handleGroupOrderChange = (letter: string, order: number[]) => {
    setState((prev) => ({
      ...prev,
      groupOrders: { ...prev.groupOrders, [letter]: order },
    }));
  };

  const handleContinueToThirdPlace = () => {
    setState((prev) => {
      const defaultAdvancing = getDefaultAdvancingThirdPlace(prev.groupOrders);
      return {
        ...prev,
        step: "thirdplace" as const,
        advancingThirdPlace: defaultAdvancing,
      };
    });
  };

  const handleThirdPlaceToggle = (letter: string) => {
    setState((prev) => {
      const isSelected = prev.advancingThirdPlace.includes(letter);
      let newAdvancing: string[];
      if (isSelected) {
        newAdvancing = prev.advancingThirdPlace.filter((l) => l !== letter);
      } else {
        newAdvancing = [...prev.advancingThirdPlace, letter];
      }
      return { ...prev, advancingThirdPlace: newAdvancing };
    });
  };

  const handleAutoSelectThirdPlace = () => {
    setState((prev) => {
      const defaultAdvancing = getDefaultAdvancingThirdPlace(prev.groupOrders);
      return { ...prev, advancingThirdPlace: defaultAdvancing };
    });
  };

  const handleContinueToKnockout = () => {
    setState((prev) => ({ ...prev, step: "knockout" as const }));
  };

  const handleKnockoutPick = (matchId: string, winner: number) => {
    setState((prev) => {
      const newPicks = { ...prev.knockoutPicks, [matchId]: winner };

      // Find and clear all downstream picks
      const matchesToClear = new Set<string>();
      matchesToClear.add(matchId);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [id, pick] of Object.entries(newPicks)) {
          if (matchesToClear.has(id)) continue;
          if (pick === undefined || pick === -1) continue;
          const match = KNOCKOUT_MATCHES.find((m) => m.id === id);
          if (!match) continue;
          const parents = [match.home, match.away]
            .filter((p) => p.type === "winner")
            .map((p) => p.matchId!);
          if (parents.some((p) => matchesToClear.has(p))) {
            matchesToClear.add(id);
            changed = true;
          }
        }
      }

      for (const id of matchesToClear) {
        if (id !== matchId) {
          delete newPicks[id];
        }
      }

      return { ...prev, knockoutPicks: newPicks };
    });
  };

  const handleGenerateLink = (name: string) => {
    const encoded = encodeState(state);
    const url = new URL(window.location.href);
    url.searchParams.set("b", encoded);
    url.searchParams.set("n", name);
    window.open(url.toString(), "_blank");
  };

  const handleEditNew = () => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setState(initialState);
    setUserName("");
    setIsViewMode(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleGoBack = () => {
    setState((prev) => {
      const steps: Record<string, string> = {
        thirdplace: "groups",
        knockout: "thirdplace",
        share: "knockout",
      };
      const prevStep = steps[prev.step];
      if (!prevStep) return prev;
      return { ...prev, step: prevStep as BracketState["step"] };
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading bracket...</div>
      </div>
    );
  }

  // View mode: show read-only bracket summary
  if (isViewMode) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={handleEditNew}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="text-3xl">🏆</span>
              <div className="text-left">
                <h1 className="text-xl font-bold text-zinc-900 leading-tight">World Cup 2026</h1>
                <p className="text-xs text-zinc-500">Bracket Predictor</p>
              </div>
            </button>
            <button
              onClick={handleEditNew}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              Create Your Own Bracket
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-900">
              {userName ? `${userName}'s` : "World Cup 2026"} Bracket Prediction
            </h2>
          </div>
          <BracketView state={state} />
        </main>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleEditNew}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-3xl">🏆</span>
            <div className="text-left">
              <h1 className="text-xl font-bold text-zinc-900 leading-tight">World Cup 2026</h1>
              <p className="text-xs text-zinc-500">Bracket Predictor</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {state.step !== "groups" && (
              <button
                onClick={handleGoBack}
                className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 font-medium"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleEditNew}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: "groups", label: "Groups" },
            { key: "thirdplace", label: "3rd Place" },
            { key: "knockout", label: "Knockout" },
          ].map((step, i) => {
            const isActive = state.step === step.key;
            const isPast = [
              state.step === "thirdplace" && step.key === "groups",
              state.step === "knockout" && (step.key === "groups" || step.key === "thirdplace"),
            ].some(Boolean);
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isActive ? "bg-green-600 text-white" : isPast ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"}
                  `}
                >
                  {isPast ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${isActive ? "text-zinc-900" : "text-zinc-400"}`}
                >
                  {step.label}
                </span>
                {i < 2 && <div className="w-8 h-px bg-zinc-200 mx-1" />}
              </div>
            );
          })}
        </div>

        {state.step === "groups" && (
          <GroupStage
            groups={groups}
            groupOrders={state.groupOrders}
            onOrderChange={handleGroupOrderChange}
            onContinue={handleContinueToThirdPlace}
          />
        )}

        {state.step === "thirdplace" && (
          <ThirdPlacePicker
            groupOrders={state.groupOrders}
            advancingThirdPlace={state.advancingThirdPlace}
            onToggle={handleThirdPlaceToggle}
            onAutoSelect={handleAutoSelectThirdPlace}
            onContinue={handleContinueToKnockout}
          />
        )}

        {state.step === "knockout" && (
          <KnockoutBracket
            state={state}
            onPick={handleKnockoutPick}
            onGenerateLink={handleGenerateLink}
          />
        )}
      </main>

      <footer className="bg-white border-t border-zinc-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-zinc-400">
          <p>World Cup 2026 Bracket Generator · Made with ⚽</p>
          <p className="mt-1">Not affiliated with FIFA. For entertainment purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
