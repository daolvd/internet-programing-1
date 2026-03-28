import { CARD_REVIEWS_KEY, USER_ID_KEY } from "../constants/storageKeys";
import type { CardReview, CardReviewRating } from "../types/CardReview";

interface CreateCardReviewInput {
  card_id: number;
  deck_id: number;
  is_correct: boolean;
  rating: CardReviewRating;
  response_time_ms: number;
}

interface CardReviewMetricFilter {
  deckId?: number;
  userId?: string;
}

interface CardReviewMetrics {
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  accuracy: number;
  averageResponseTimeMs: number;
  uniqueCardsReviewed: number;
  uniqueDecksReviewed: number;
  ratingDistribution: Record<CardReviewRating, number>;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readCardReviewsFromStorage(): CardReview[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(CARD_REVIEWS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CardReview[]) : [];
  } catch {
    return [];
  }
}

function persistCardReviews(reviews: CardReview[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CARD_REVIEWS_KEY, JSON.stringify(reviews));
}

let cardReviewList: CardReview[] = readCardReviewsFromStorage();

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";

  const cached = window.localStorage.getItem(USER_ID_KEY);
  if (cached) return cached;

  const generated = generateId();
  window.localStorage.setItem(USER_ID_KEY, generated);
  return generated;
}

export function getCardReviews(): CardReview[] {
  return [...cardReviewList];
}

export function setCardReviews(reviews: CardReview[]): void {
  cardReviewList = [...reviews];
  persistCardReviews(cardReviewList);
}

export function clearCardReviews(): void {
  cardReviewList = [];
  persistCardReviews(cardReviewList);
}

export function createCardReview(input: CreateCardReviewInput): CardReview {
  const review: CardReview = {
    id: generateId(),
    user_id: getOrCreateUserId(),
    card_id: input.card_id,
    deck_id: input.deck_id,
    is_correct: input.is_correct,
    rating: input.rating,
    reviewed_at: Date.now(),
    response_time_ms: input.response_time_ms,
  };

  cardReviewList = [...cardReviewList, review];
  persistCardReviews(cardReviewList);

  return review;
}

export function getCardReviewsByDeck(deckId: number): CardReview[] {
  return cardReviewList.filter((review) => review.deck_id === deckId);
}

export function getCardReviewsByUser(userId: string): CardReview[] {
  return cardReviewList.filter((review) => review.user_id === userId);
}

export function getCardReviewMetrics(filter?: CardReviewMetricFilter): CardReviewMetrics {
  const filtered = cardReviewList.filter((review) => {
    if (typeof filter?.deckId === "number" && review.deck_id !== filter.deckId) return false;
    if (filter?.userId && review.user_id !== filter.userId) return false;
    return true;
  });

  const totalReviews = filtered.length;
  const correctReviews = filtered.filter((review) => review.is_correct).length;
  const incorrectReviews = totalReviews - correctReviews;
  const totalResponseTime = filtered.reduce((sum, review) => sum + review.response_time_ms, 0);
  const uniqueCardsReviewed = new Set(filtered.map((review) => review.card_id)).size;
  const uniqueDecksReviewed = new Set(filtered.map((review) => review.deck_id)).size;

  const ratingDistribution: Record<CardReviewRating, number> = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };

  filtered.forEach((review) => {
    ratingDistribution[review.rating] += 1;
  });

  return {
    totalReviews,
    correctReviews,
    incorrectReviews,
    accuracy: totalReviews > 0 ? correctReviews / totalReviews : 0,
    averageResponseTimeMs: totalReviews > 0 ? totalResponseTime / totalReviews : 0,
    uniqueCardsReviewed,
    uniqueDecksReviewed,
    ratingDistribution,
  };
}

export function reloadCardReviewsFromStorage(): CardReview[] {
  cardReviewList = readCardReviewsFromStorage();
  return [...cardReviewList];
}

export function initUserSession(): string {
  return getOrCreateUserId();
}
