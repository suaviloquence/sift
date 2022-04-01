import fs from "fs/promises";

export const MIN_WORD_LENGTH = 3;

export async function getWords(): Promise<Set<string>> {
  const lines = (await fs.readFile("words_alpha.3..9.txt", "utf-8")).split(
    "\n"
  );
  return new Set(lines);
}
