import { CARD_REVIEWS_KEY, USER_ID_KEY } from "../constants/storageKeys";
import type { CardReview, CardReviewRating } from "../types/CardReview";
import { apiClient } from "./ApiClient";

export interface CreateCardReviewInput {
    card_id: number;
    deck_id: number;
    is_correct: boolean;
    rating: CardReviewRating;
    response_time_ms: number;
}

export interface CreateServerCardReviewInput {
    cardId: number;
    isCorrect: boolean;
    rating: string;
    responseTimeMs: number;
    studySessionId: number;
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

export function reloadCardReviewsFromStorage(): CardReview[] {
    cardReviewList = readCardReviewsFromStorage();
    return [...cardReviewList];
}

export function initUserSession(): string {
    return getOrCreateUserId();
}

export function syncCreateCardReview(
    cardId: number,
    deckId: number,
    isCorrect: boolean,
    rating: string,
    responseTimeMs: number,
    studySessionId: number
): Promise<void> {
    return apiClient.post<void>('/api/card-review/create', {
        cardId,
        deckId,
        isCorrect,
        rating,
        responseTimeMs,
        studySessionId,
        reviewAt: Date.now()
    });
}

export function createCardReviewOnServer(input: CreateServerCardReviewInput): Promise<void> {
    return apiClient.post<void>('/api/card-review/create', {
        cardId: input.cardId,
        isCorrect: input.isCorrect,
        rating: input.rating,
        responseTimeMs: input.responseTimeMs,
        studySessionId: input.studySessionId,
        reviewAt: Date.now(),
    });
}

export function syncCreateCardReviewList(reviews: Array<{
    card_id: number;
    deck_id: number;
    is_correct: boolean;
    rating: string;
    response_time_ms: number;
}>, studySessionId: number): Promise<void> {
    const payload = reviews.map((r) => ({
        cardId: r.card_id,
        deckId: r.deck_id,
        isCorrect: r.is_correct,
        rating: r.rating,
        responseTimeMs: r.response_time_ms,
        studySessionId,
        reviewAt: Date.now()
    }));
    return apiClient.post<void>('/api/card-review/create-list', payload);
}
