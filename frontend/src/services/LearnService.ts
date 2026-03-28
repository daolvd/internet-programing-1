import { LEARN_ACTION, type LearnAction } from "../constants/learn";
import type { CardReviewRating } from "../types/CardReview";

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

export function isAnswerCorrect(userAnswer: string, expectedAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer);
}

export function resolveLearnAction(
  selectedAction: LearnAction | "",
  isCorrect: boolean,
): LearnAction {
  if (!selectedAction) {
    return isCorrect ? LEARN_ACTION.GOOD : LEARN_ACTION.DONT_KNOW;
  }

  if (selectedAction === LEARN_ACTION.EASY) {
    return isCorrect ? LEARN_ACTION.EASY : LEARN_ACTION.DONT_KNOW;
  }

  return selectedAction;
}

export function mapLearnActionToRating(action: LearnAction): CardReviewRating {
  if (action === LEARN_ACTION.DONT_KNOW) {
    return "again";
  }

  return action;
}
