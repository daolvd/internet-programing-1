import type { Card } from "../types/Card";
import { LAST_REVIEW_DECK_KEY } from "../constants/storageKeys";
import { allCards, allDecks, getCardsByDeck } from "../services/DeckServices";
import type { LearnFilterKey } from "../constants/study";

export function getLastReviewedDeckId(): number {
  if (typeof window === "undefined") return 0;

  const raw = window.localStorage.getItem(LAST_REVIEW_DECK_KEY);
  const deckId = Number(raw || 0);

  return Number.isFinite(deckId) && deckId > 0 ? deckId : 0;
}

export function getRecentCardsFromLastReviewedDeck(): Card[] {
  const deckId = getLastReviewedDeckId();
  return deckId > 0 ? getCardsByDeck(deckId) : allCards;
}

export function resolveStatus(accuracy: number): string {
  if (accuracy >= 0.85) return "MASTERED";
  if (accuracy >= 0.6) return "IN PROGRESS";
  return "NEEDS WORK";
}

export function normalizeLearnStatus(status: string): LearnFilterKey {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "");
  if (normalized === "easy") return "easy";
  if (normalized === "good") return "good";
  if (normalized === "hard") return "hard";
  return "dontknow";
}

export function findFallbackDeckId(): number {
  const fallbackDeck = allDecks.find((deck) => getCardsByDeck(deck.id).length > 0);
  return fallbackDeck?.id ?? 0;
}

export function getCurrentStreakDays(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;

  const daySet = new Set(
    timestamps.map((time) => {
      const date = new Date(time);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (daySet.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function formatSessionClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}