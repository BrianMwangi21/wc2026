export interface Team {
  name: string;
  flag: string;
  fifaRank: number;
}

export interface Group {
  letter: string;
  teams: Team[];
}

const teamData: Record<string, { flag: string; rank: number }> = {
  Mexico: { flag: "🇲🇽", rank: 15 },
  "South Africa": { flag: "🇿🇦", rank: 60 },
  "South Korea": { flag: "🇰🇷", rank: 25 },
  "Czech Republic": { flag: "🇨🇿", rank: 41 },
  Canada: { flag: "🇨🇦", rank: 30 },
  "Bosnia & Herzegovina": { flag: "🇧🇦", rank: 65 },
  Qatar: { flag: "🇶🇦", rank: 55 },
  Switzerland: { flag: "🇨🇭", rank: 19 },
  USA: { flag: "🇺🇸", rank: 16 },
  Paraguay: { flag: "🇵🇾", rank: 40 },
  Australia: { flag: "🇦🇺", rank: 27 },
  Türkiye: { flag: "🇹🇷", rank: 22 },
  Brazil: { flag: "🇧🇷", rank: 6 },
  Morocco: { flag: "🇲🇦", rank: 8 },
  Haiti: { flag: "🇭🇹", rank: 83 },
  Scotland: { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rank: 43 },
  Germany: { flag: "🇩🇪", rank: 10 },
  Curaçao: { flag: "🇨🇼", rank: 82 },
  "Ivory Coast": { flag: "🇨🇮", rank: 34 },
  Ecuador: { flag: "🇪🇨", rank: 24 },
  Netherlands: { flag: "🇳🇱", rank: 8 },
  Japan: { flag: "🇯🇵", rank: 18 },
  Sweden: { flag: "🇸🇪", rank: 38 },
  Tunisia: { flag: "🇹🇳", rank: 46 },
  Spain: { flag: "🇪🇸", rank: 2 },
  "Cape Verde Islands": { flag: "🇨🇻", rank: 69 },
  "Saudi Arabia": { flag: "🇸🇦", rank: 61 },
  Uruguay: { flag: "🇺🇾", rank: 17 },
  Belgium: { flag: "🇧🇪", rank: 9 },
  Egypt: { flag: "🇪🇬", rank: 29 },
  Iran: { flag: "🇮🇷", rank: 21 },
  "New Zealand": { flag: "🇳🇿", rank: 85 },
  France: { flag: "🇫🇷", rank: 1 },
  Senegal: { flag: "🇸🇳", rank: 14 },
  Iraq: { flag: "🇮🇶", rank: 57 },
  Norway: { flag: "🇳🇴", rank: 31 },
  Argentina: { flag: "🇦🇷", rank: 3 },
  Algeria: { flag: "🇩🇿", rank: 28 },
  Austria: { flag: "🇦🇹", rank: 23 },
  Jordan: { flag: "🇯🇴", rank: 63 },
  Portugal: { flag: "🇵🇹", rank: 5 },
  "Congo DR": { flag: "🇨🇩", rank: 46 },
  Uzbekistan: { flag: "🇺🇿", rank: 50 },
  Colombia: { flag: "🇨🇴", rank: 13 },
  England: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank: 4 },
  Croatia: { flag: "🇭🇷", rank: 11 },
  Ghana: { flag: "🇬🇭", rank: 74 },
  Panama: { flag: "🇵🇦", rank: 33 },
};

const groupDefs: Record<string, string[]> = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia & Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Spain", "Cape Verde Islands", "Saudi Arabia", "Uruguay"],
  H: ["Belgium", "Egypt", "Iran", "New Zealand"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Congo DR", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

export const groups: Group[] = Object.entries(groupDefs).map(([letter, teamNames]) => ({
  letter,
  teams: teamNames.map((name) => ({
    name,
    flag: teamData[name]?.flag ?? "🏳️",
    fifaRank: teamData[name]?.rank ?? 999,
  })),
}));

export const allTeams = Object.values(groups).flatMap((g) => g.teams);

export function getGroupByLetter(letter: string): Group | undefined {
  return groups.find((g) => g.letter === letter);
}
