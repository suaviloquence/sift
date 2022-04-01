export const MIN_WORD_LENGTH = 3;

export function pointValue(word: string): number {
  const l = word.length;
  if (l < 4) return l;
  if (l < 8) return 2 * l;
  return 3 * l;
}
