export type LearnFilterKey = "easy" | "good" | "hard" | "dontknow";

export const INITIAL_LEARN_FILTERS: Record<LearnFilterKey, boolean> = {
  easy: true,
  good: true,
  hard: true,
  dontknow: true,
};