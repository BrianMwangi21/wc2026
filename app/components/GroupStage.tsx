"use client";

import { useState, useCallback } from "react";
import { Group, Team } from "../data/groups";
import TeamFlag from "./TeamFlag";

interface GroupStageProps {
  groups: Group[];
  groupOrders: Record<string, number[]>;
  onOrderChange: (letter: string, order: number[]) => void;
  onContinue: () => void;
}

interface DragState {
  groupLetter: string | null;
  fromIndex: number;
}

export default function GroupStage({ groups, groupOrders, onOrderChange, onContinue }: GroupStageProps) {
  const [dragState, setDragState] = useState<DragState>({ groupLetter: null, fromIndex: -1 });
  const [dragOverIndex, setDragOverIndex] = useState<{ letter: string; index: number } | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, groupLetter: string, index: number) => {
    setDragState({ groupLetter, fromIndex: index });
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", `${groupLetter}-${index}`);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, letter: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragState.groupLetter === letter) {
      setDragOverIndex({ letter, index });
    }
  }, [dragState.groupLetter]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, letter: string, toIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (dragState.groupLetter !== letter || dragState.fromIndex === -1) return;
    if (dragState.fromIndex === toIndex) return;

    const currentOrder = groupOrders[letter] ?? [0, 1, 2, 3];
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(dragState.fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    
    onOrderChange(letter, newOrder);
    setDragState({ groupLetter: null, fromIndex: -1 });
  }, [dragState, groupOrders, onOrderChange]);

  const getPositionBadge = (position: number) => {
    const styles = [
      "bg-yellow-100 text-yellow-800 border-yellow-300",
      "bg-zinc-100 text-zinc-700 border-zinc-300",
      "bg-orange-50 text-orange-700 border-orange-200",
      "bg-red-50 text-red-700 border-red-200",
    ];
    const labels = ["1st", "2nd", "3rd", "4th"];
    return { style: styles[position], label: labels[position] };
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">Group Stage</h2>
        <p className="text-zinc-500 text-sm">
          Drag and drop teams to set your predicted group standings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((group) => {
          const order = groupOrders[group.letter] ?? [0, 1, 2, 3];
          const isDraggingInThisGroup = dragState.groupLetter === group.letter;

          return (
            <div
              key={group.letter}
              className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-zinc-800">Group {group.letter}</h3>
                <span className="text-xs text-zinc-400 font-medium">Drag to reorder</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {order.map((teamIndex, position) => {
                  const team = group.teams[teamIndex];
                  const badge = getPositionBadge(position);
                  const isDragOver = dragOverIndex?.letter === group.letter && dragOverIndex?.index === position;

                  return (
                    <div
                      key={`${group.letter}-${teamIndex}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, group.letter, position)}
                      onDragOver={(e) => handleDragOver(e, group.letter, position)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, group.letter, position)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-move
                        transition-all select-none
                        ${isDragOver ? "bg-blue-50 border-2 border-blue-300 scale-[1.02]" : "border-2 border-transparent hover:bg-zinc-50"}
                        ${isDraggingInThisGroup && position === dragState.fromIndex ? "opacity-50" : "opacity-100"}
                      `}
                    >
                      <span className={`
                        text-xs font-bold px-2 py-0.5 rounded-full border min-w-[32px] text-center
                        ${badge.style}
                      `}>
                        {badge.label}
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

      <div className="flex justify-center pt-4">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-md"
        >
          Lock Groups & Continue →
        </button>
      </div>
    </div>
  );
}
