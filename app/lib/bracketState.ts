import { groups, getGroupByLetter } from "../data/groups";
import { r32Mapping } from "../data/r32Mapping";

export type Step = "groups" | "thirdplace" | "knockout" | "share";

export interface BracketState {
  step: Step;
  // Group letter -> ordered team indices [0,1,2,3] where 0=original first team, etc.
  // The user's ranking: index 0 = 1st place, index 1 = 2nd, etc.
  groupOrders: Record<string, number[]>;
  // Group letters of the 8 advancing 3rd-place teams
  advancingThirdPlace: string[];
  // Match ID -> winner: 0=home, 1=away, -1=not picked
  knockoutPicks: Record<string, number>;
}

export const PERMUTATIONS: number[][] = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1],
  [0, 3, 1, 2], [0, 3, 2, 1], [1, 0, 2, 3], [1, 0, 3, 2],
  [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
  [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0],
  [2, 3, 0, 1], [2, 3, 1, 0], [3, 0, 1, 2], [3, 0, 2, 1],
  [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0],
];

export function getPermutationIndex(order: number[]): number {
  const key = order.join(",");
  return PERMUTATIONS.findIndex((p) => p.join(",") === key);
}

export function getPermutationFromIndex(index: number): number[] {
  return PERMUTATIONS[index] ?? [0, 1, 2, 3];
}

export const GROUP_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
];

export interface MatchParticipant {
  type: "team" | "winner" | "thirdplace";
  teamName?: string;
  matchId?: string;
  groupLetter?: string;
  groupPosition?: "1st" | "2nd" | "3rd";
  slotLabel?: string; // for 3rd place slots like "3ABCDF"
}

export interface KnockoutMatch {
  id: string;
  round: "r32" | "r16" | "qf" | "sf" | "final" | "third";
  home: MatchParticipant;
  away: MatchParticipant;
  label: string;
  date?: string;
}

// Round of 32 matches - some 3rd place slots depend on the 495-combination mapping
export const R32_MATCHES: KnockoutMatch[] = [
  { id: "m73", round: "r32", label: "Match 73", home: { type: "team", groupLetter: "A", groupPosition: "2nd" }, away: { type: "team", groupLetter: "B", groupPosition: "2nd" } },
  { id: "m74", round: "r32", label: "Match 74", home: { type: "team", groupLetter: "E", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3ABCDF" } },
  { id: "m75", round: "r32", label: "Match 75", home: { type: "team", groupLetter: "F", groupPosition: "1st" }, away: { type: "team", groupLetter: "C", groupPosition: "2nd" } },
  { id: "m76", round: "r32", label: "Match 76", home: { type: "team", groupLetter: "C", groupPosition: "1st" }, away: { type: "team", groupLetter: "F", groupPosition: "2nd" } },
  { id: "m77", round: "r32", label: "Match 77", home: { type: "team", groupLetter: "I", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3CDFGH" } },
  { id: "m78", round: "r32", label: "Match 78", home: { type: "team", groupLetter: "E", groupPosition: "2nd" }, away: { type: "team", groupLetter: "I", groupPosition: "2nd" } },
  { id: "m79", round: "r32", label: "Match 79", home: { type: "team", groupLetter: "A", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3CEFHI" } },
  { id: "m80", round: "r32", label: "Match 80", home: { type: "team", groupLetter: "L", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3EHIJK" } },
  { id: "m81", round: "r32", label: "Match 81", home: { type: "team", groupLetter: "D", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3BEFIJ" } },
  { id: "m82", round: "r32", label: "Match 82", home: { type: "team", groupLetter: "G", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3AEHIJ" } },
  { id: "m83", round: "r32", label: "Match 83", home: { type: "team", groupLetter: "K", groupPosition: "2nd" }, away: { type: "team", groupLetter: "L", groupPosition: "2nd" } },
  { id: "m84", round: "r32", label: "Match 84", home: { type: "team", groupLetter: "H", groupPosition: "1st" }, away: { type: "team", groupLetter: "J", groupPosition: "2nd" } },
  { id: "m85", round: "r32", label: "Match 85", home: { type: "team", groupLetter: "B", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3EFGIJ" } },
  { id: "m86", round: "r32", label: "Match 86", home: { type: "team", groupLetter: "J", groupPosition: "1st" }, away: { type: "team", groupLetter: "H", groupPosition: "2nd" } },
  { id: "m87", round: "r32", label: "Match 87", home: { type: "team", groupLetter: "K", groupPosition: "1st" }, away: { type: "thirdplace", slotLabel: "3DEIJL" } },
  { id: "m88", round: "r32", label: "Match 88", home: { type: "team", groupLetter: "D", groupPosition: "2nd" }, away: { type: "team", groupLetter: "G", groupPosition: "2nd" } },
];

export const KNOCKOUT_MATCHES: KnockoutMatch[] = [
  ...R32_MATCHES,
  // Round of 16
  { id: "m89", round: "r16", label: "Match 89", home: { type: "winner", matchId: "m74" }, away: { type: "winner", matchId: "m77" } },
  { id: "m90", round: "r16", label: "Match 90", home: { type: "winner", matchId: "m73" }, away: { type: "winner", matchId: "m75" } },
  { id: "m91", round: "r16", label: "Match 91", home: { type: "winner", matchId: "m76" }, away: { type: "winner", matchId: "m78" } },
  { id: "m92", round: "r16", label: "Match 92", home: { type: "winner", matchId: "m79" }, away: { type: "winner", matchId: "m80" } },
  { id: "m93", round: "r16", label: "Match 93", home: { type: "winner", matchId: "m83" }, away: { type: "winner", matchId: "m84" } },
  { id: "m94", round: "r16", label: "Match 94", home: { type: "winner", matchId: "m81" }, away: { type: "winner", matchId: "m82" } },
  { id: "m95", round: "r16", label: "Match 95", home: { type: "winner", matchId: "m86" }, away: { type: "winner", matchId: "m88" } },
  { id: "m96", round: "r16", label: "Match 96", home: { type: "winner", matchId: "m85" }, away: { type: "winner", matchId: "m87" } },
  // Quarter-finals
  { id: "m97", round: "qf", label: "Match 97", home: { type: "winner", matchId: "m89" }, away: { type: "winner", matchId: "m90" } },
  { id: "m98", round: "qf", label: "Match 98", home: { type: "winner", matchId: "m93" }, away: { type: "winner", matchId: "m94" } },
  { id: "m99", round: "qf", label: "Match 99", home: { type: "winner", matchId: "m91" }, away: { type: "winner", matchId: "m92" } },
  { id: "m100", round: "qf", label: "Match 100", home: { type: "winner", matchId: "m95" }, away: { type: "winner", matchId: "m96" } },
  // Semi-finals
  { id: "m101", round: "sf", label: "Match 101", home: { type: "winner", matchId: "m97" }, away: { type: "winner", matchId: "m98" } },
  { id: "m102", round: "sf", label: "Match 102", home: { type: "winner", matchId: "m99" }, away: { type: "winner", matchId: "m100" } },
  // Final
  { id: "m103", round: "final", label: "Final", home: { type: "winner", matchId: "m101" }, away: { type: "winner", matchId: "m102" } },
  // 3rd place
  { id: "m104", round: "third", label: "3rd Place", home: { type: "winner", matchId: "m101" }, away: { type: "winner", matchId: "m102" } },
];

// Fix m104 - it's actually the LOSERS of m101 and m102
// But for simplicity, we'll handle this in resolution

export function getTeamAtPosition(
  groupLetter: string,
  position: number,
  groupOrders: Record<string, number[]>
): string | undefined {
  const group = getGroupByLetter(groupLetter);
  if (!group) return undefined;
  const order = groupOrders[groupLetter] ?? [0, 1, 2, 3];
  const teamIndex = order[position];
  return group.teams[teamIndex]?.name;
}

export function getThirdPlaceTeam(
  groupLetter: string,
  groupOrders: Record<string, number[]>
): string | undefined {
  return getTeamAtPosition(groupLetter, 2, groupOrders); // 3rd place = index 2
}

export function resolveMatchParticipant(
  participant: MatchParticipant,
  state: BracketState
): { name: string; flag?: string } | undefined {
  if (participant.type === "team") {
    const posMap = { "1st": 0, "2nd": 1, "3rd": 2 };
    const pos = posMap[participant.groupPosition!];
    if (pos === undefined) return undefined;
    const name = getTeamAtPosition(participant.groupLetter!, pos, state.groupOrders);
    if (!name) return undefined;
    const group = getGroupByLetter(participant.groupLetter!);
    const team = group?.teams.find((t) => t.name === name);
    return { name, flag: team?.flag };
  }

  if (participant.type === "thirdplace") {
    // Find the match that contains this slot label
    const match = KNOCKOUT_MATCHES.find(
      (m) =>
        (m.home.type === "thirdplace" && m.home.slotLabel === participant.slotLabel) ||
        (m.away.type === "thirdplace" && m.away.slotLabel === participant.slotLabel)
    );
    if (!match) return undefined;
    return getThirdPlaceForMatch(match.id, state.advancingThirdPlace, state.groupOrders);
  }

  if (participant.type === "winner") {
    const match = KNOCKOUT_MATCHES.find((m) => m.id === participant.matchId);
    if (!match) return undefined;
    const pick = state.knockoutPicks[match.id];
    if (pick === undefined || pick === -1) return undefined;
    // Use getMatchTeams to resolve parent match, which handles thirdplace correctly
    const teams = getMatchTeams(match, state);
    if (!teams.home || !teams.away) return undefined;
    return pick === 0 ? teams.home : teams.away;
  }

  return undefined;
}

export function getEliminatedGroups(advancing: string[]): string | null {
  if (advancing.length !== 8) return null;
  const eliminated = GROUP_LETTERS.filter((l) => !advancing.includes(l));
  return eliminated.sort().join("");
}

export function getCombinationIndex(advancing: string[]): number {
  const eliminated = getEliminatedGroups(advancing);
  if (!eliminated) return -1;
  const keys = Object.keys(r32Mapping).sort();
  return keys.indexOf(eliminated);
}

export function getAdvancingFromIndex(index: number): string[] | null {
  const keys = Object.keys(r32Mapping).sort();
  const eliminated = keys[index];
  if (!eliminated) return null;
  return GROUP_LETTERS.filter((l) => !eliminated.includes(l));
}

// Get the 3rd place team for a specific match's slot
export function getThirdPlaceForMatch(
  matchId: string,
  advancingThirdPlace: string[],
  groupOrders: Record<string, number[]>
): { name: string; flag?: string } | undefined {
  const eliminated = getEliminatedGroups(advancingThirdPlace);
  if (!eliminated) return undefined;
  const mapping = r32Mapping[eliminated];
  if (!mapping) return undefined;

  // Map match IDs to slot indices
  // Slots: 0=1A, 1=1B, 2=1D, 3=1E, 4=1G, 5=1I, 6=1K, 7=1L
  const matchToSlot: Record<string, number> = {
    m79: 0, // 1A vs 3CEFHI -> slot 0 (1A)
    m85: 1, // 1B vs 3EFGIJ -> slot 1 (1B)
    m81: 2, // 1D vs 3BEFIJ -> slot 2 (1D)
    m74: 3, // 1E vs 3ABCDF -> slot 3 (1E)
    m82: 4, // 1G vs 3AEHIJ -> slot 4 (1G)
    m77: 5, // 1I vs 3CDFGH -> slot 5 (1I)
    m87: 6, // 1K vs 3DEIJL -> slot 6 (1K)
    m80: 7, // 1L vs 3EHIJK -> slot 7 (1L)
  };

  const slotIndex = matchToSlot[matchId];
  if (slotIndex === undefined) return undefined;

  const groupLetter = mapping[slotIndex];
  const name = getTeamAtPosition(groupLetter, 2, groupOrders);
  if (!name) return undefined;
  const group = getGroupByLetter(groupLetter);
  const team = group?.teams.find((t) => t.name === name);
  return { name, flag: team?.flag };
}

// For m104 (3rd place), we need losers of semi-finals
export function getLoserOfMatch(
  matchId: string,
  state: BracketState
): { name: string; flag?: string } | undefined {
  const match = KNOCKOUT_MATCHES.find((m) => m.id === matchId);
  if (!match) return undefined;
  const pick = state.knockoutPicks[match.id];
  if (pick === undefined || pick === -1) return undefined;
  const home = resolveMatchParticipant(match.home, state);
  const away = resolveMatchParticipant(match.away, state);
  if (!home || !away) return undefined;
  return pick === 0 ? away : home; // Loser is the opposite of the pick
}

export const initialState: BracketState = {
  step: "groups",
  groupOrders: Object.fromEntries(GROUP_LETTERS.map((l) => [l, [0, 1, 2, 3]])),
  advancingThirdPlace: [],
  knockoutPicks: {},
};

export function getDefaultAdvancingThirdPlace(
  groupOrders: Record<string, number[]>
): string[] {
  // Get all 3rd place teams and their FIFA rankings
  const thirdPlaceTeams = GROUP_LETTERS.map((letter) => {
    const name = getTeamAtPosition(letter, 2, groupOrders);
    const group = getGroupByLetter(letter);
    const team = group?.teams.find((t) => t.name === name);
    return { letter, name: name ?? "", rank: team?.fifaRank ?? 999 };
  });

  // Sort by FIFA rank (lower = better) and take top 8
  return thirdPlaceTeams
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 8)
    .map((t) => t.letter);
}

export function isMatchReady(match: KnockoutMatch, state: BracketState): boolean {
  if (match.round === "r32") {
    // Ro32 is ready once group stage + 3rd place is done
    if (match.home.type === "thirdplace" || match.away.type === "thirdplace") {
      return state.advancingThirdPlace.length === 8;
    }
    return true;
  }
  
  // For later rounds, check if parent matches have been picked
  const checkParticipant = (p: MatchParticipant): boolean => {
    if (p.type === "winner" && p.matchId) {
      const parent = KNOCKOUT_MATCHES.find((m) => m.id === p.matchId);
      if (!parent) return false;
      if (!isMatchReady(parent, state)) return false;
      return state.knockoutPicks[p.matchId] !== undefined && state.knockoutPicks[p.matchId] !== -1;
    }
    return true;
  };

  return checkParticipant(match.home) && checkParticipant(match.away);
}

export function getMatchTeams(
  match: KnockoutMatch,
  state: BracketState
): { home: { name: string; flag?: string } | undefined; away: { name: string; flag?: string } | undefined } {
  if (match.home.type === "thirdplace") {
    const third = getThirdPlaceForMatch(match.id, state.advancingThirdPlace, state.groupOrders);
    const homeTeam = third;
    const awayTeam = resolveMatchParticipant(match.away, state);
    return { home: homeTeam, away: awayTeam };
  }
  if (match.away.type === "thirdplace") {
    const homeTeam = resolveMatchParticipant(match.home, state);
    const third = getThirdPlaceForMatch(match.id, state.advancingThirdPlace, state.groupOrders);
    return { home: homeTeam, away: third };
  }
  if (match.id === "m104") {
    // 3rd place match - losers of semi-finals
    const homeLoser = getLoserOfMatch("m101", state);
    const awayLoser = getLoserOfMatch("m102", state);
    return { home: homeLoser, away: awayLoser };
  }
  return {
    home: resolveMatchParticipant(match.home, state),
    away: resolveMatchParticipant(match.away, state),
  };
}
