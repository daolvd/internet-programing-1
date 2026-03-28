export const LEARN_ACTION = {
  EASY: "easy",
  GOOD: "good",
  HARD: "hard",
  DONT_KNOW: "dontknow",
} as const;

export type LearnAction = typeof LEARN_ACTION[keyof typeof LEARN_ACTION];

export const LEARN_CARD_STATUS: Record<LearnAction, string> = {
  [LEARN_ACTION.EASY]: "Easy",
  [LEARN_ACTION.GOOD]: "Good",
  [LEARN_ACTION.HARD]: "Hard",
  [LEARN_ACTION.DONT_KNOW]: "Don't know",
};

export const LEARN_ACTION_PRIORITY: Record<LearnAction, number> = {
  [LEARN_ACTION.DONT_KNOW]: 0,
  [LEARN_ACTION.HARD]: 1,
  [LEARN_ACTION.GOOD]: 2,
  [LEARN_ACTION.EASY]: 3,
};

export const ANSWER_FEEDBACK = {
  CORRECT: "correct",
  INCORRECT: "incorrect",
} as const;

export type AnswerFeedback = typeof ANSWER_FEEDBACK[keyof typeof ANSWER_FEEDBACK];
