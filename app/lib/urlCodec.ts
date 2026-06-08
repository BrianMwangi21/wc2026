import {
  BracketState,
  PERMUTATIONS,
  getPermutationIndex,
  getPermutationFromIndex,
  GROUP_LETTERS,
  getCombinationIndex,
  getAdvancingFromIndex,
  KNOCKOUT_MATCHES,
} from "./bracketState";

const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bitsToBase64(bits: string): string {
  // Pad to multiple of 6
  while (bits.length % 6 !== 0) {
    bits += "0";
  }
  let result = "";
  for (let i = 0; i < bits.length; i += 6) {
    const chunk = bits.slice(i, i + 6);
    const index = parseInt(chunk, 2);
    result += BASE64_CHARS[index];
  }
  return result;
}

function base64ToBits(encoded: string): string {
  let bits = "";
  for (const char of encoded) {
    const index = BASE64_CHARS.indexOf(char);
    if (index === -1) return "";
    bits += index.toString(2).padStart(6, "0");
  }
  return bits;
}

export function encodeState(state: BracketState): string {
  let bits = "";

  // Version (3 bits)
  bits += "001"; // version 1

  // Group orders: 5 bits per group × 12 = 60 bits
  for (const letter of GROUP_LETTERS) {
    const order = state.groupOrders[letter] ?? [0, 1, 2, 3];
    const permIndex = getPermutationIndex(order);
    bits += permIndex.toString(2).padStart(5, "0");
  }

  // 3rd place combination: 9 bits
  const comboIndex = getCombinationIndex(state.advancingThirdPlace);
  if (comboIndex >= 0) {
    bits += comboIndex.toString(2).padStart(9, "0");
  } else {
    bits += "111111111"; // invalid = all 1s
  }

  // Knockout picks: 2 bits per match × 32 matches = 64 bits
  const matchIds = KNOCKOUT_MATCHES.map((m) => m.id);
  for (const id of matchIds) {
    const pick = state.knockoutPicks[id];
    if (pick === 0) bits += "01";
    else if (pick === 1) bits += "10";
    else bits += "00"; // not picked
  }

  return bitsToBase64(bits);
}

export function decodeState(encoded: string): Partial<BracketState> | null {
  const bits = base64ToBits(encoded);
  if (!bits || bits.length < 3) return null;

  let pos = 0;

  // Version (3 bits)
  const version = parseInt(bits.slice(pos, pos + 3), 2);
  pos += 3;
  if (version !== 1) return null;

  if (bits.length < 3 + 60 + 9 + 64) return null;

  // Group orders: 5 bits per group
  const groupOrders: Record<string, number[]> = {};
  for (const letter of GROUP_LETTERS) {
    const permIndex = parseInt(bits.slice(pos, pos + 5), 2);
    pos += 5;
    groupOrders[letter] = getPermutationFromIndex(permIndex);
  }

  // 3rd place combination: 9 bits
  const comboIndex = parseInt(bits.slice(pos, pos + 9), 2);
  pos += 9;
  let advancingThirdPlace: string[] = [];
  if (comboIndex < 495) {
    const advancing = getAdvancingFromIndex(comboIndex);
    if (advancing) {
      advancingThirdPlace = advancing;
    }
  }

  // Knockout picks: 2 bits per match
  const knockoutPicks: Record<string, number> = {};
  const matchIds = KNOCKOUT_MATCHES.map((m) => m.id);
  for (const id of matchIds) {
    const pickBits = bits.slice(pos, pos + 2);
    pos += 2;
    if (pickBits === "01") knockoutPicks[id] = 0;
    else if (pickBits === "10") knockoutPicks[id] = 1;
    // "00" = not picked, don't store
  }

  return {
    step: "knockout",
    groupOrders,
    advancingThirdPlace,
    knockoutPicks,
  };
}
