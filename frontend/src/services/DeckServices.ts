import type { Card } from "../types/Card";
import type { Category } from "../types/Category";
import type { Deck } from "../types/Deck";
import { apiClient } from "./ApiClient";

// ── Local arrays (filled from backend on app start) ─────────────
export const allDecks: Deck[] = [];
export const allCategories: Category[] = [];
export const allCards: Card[] = [];

// ── Init: load categories + decks from backend ─────────────────
export async function initDeckData(): Promise<void> {
    const [cats, decks] = await Promise.all([
        apiClient.get<Category[]>('/api/categories/get-all'),
        apiClient.get<Deck[]>('/api/deck/get-all-by-user'),
    ]);
    allCategories.splice(0, allCategories.length, ...cats);
    allDecks.splice(0, allDecks.length, ...decks);
}

// Find General category ID for the current user (not hardcoded)
export function getGeneralCategoryId(): number {
    const general = allCategories.find((c) => c.name === "General");
    return general ? general.id : 0;
}

// Re-fetch categories from backend (to sync counts after changes)
export async function syncRefreshCategories(): Promise<void> {
    const cats = await apiClient.get<Category[]>('/api/categories/get-all');
    allCategories.splice(0, allCategories.length, ...cats);
    window.dispatchEvent(new Event('categories-updated'));
}

export async function syncRefreshDecks(): Promise<void> {
    const decks = await apiClient.get<Deck[]>('/api/deck/get-all-by-user');
    allDecks.splice(0, allDecks.length, ...decks);
    window.dispatchEvent(new Event('decks-updated'));
}

// ── Local sync helpers (operate on in-memory arrays) ────────────
export function getDecksByCategory(categoryId: number): Deck[] {
    return allDecks.filter((deck) => deck.categoryId === categoryId);
}

export function getCardsByDeck(deckId: number): Card[] {
    return allCards.filter((card) => card.deckId === deckId);
}

export function getCategoryById(categoryId: number): Category | undefined {
    return allCategories.find((cat) => cat.id === categoryId);
}

export function getCategoryFromDeck(deckId: number): Category | string {
    const deck = allDecks.find((d) => d.id === deckId);
    if (!deck) return "Unknown Category";
    return getCategoryById(deck.categoryId) || "Unknown Category";
}

export function getCategoryNameFromDeck(deckId: number): string {
    const category = getCategoryFromDeck(deckId);
    if (typeof category === "string") return category;
    return category.name;
}

export function getNameOfDeck(deckId: number): string {
    const deck = allDecks.find((d) => d.id === deckId);
    return deck ? deck.name : "";
}

export function getCategoryName(deckId: number): string {
    const deck = allDecks.find((d) => d.id === deckId);
    if (!deck) return "Unknown Category";
    const category = getCategoryById(deck.categoryId);
    return category ? category.name : "Unknown Category";
}

// ── Local mutation helpers ──────────────────────────────────────
export function createDeck(deck: Deck): Deck {
    allDecks.push(deck);
    const category = allCategories.find((c) => c.id === deck.categoryId);
    if (category) category.decks += 1;
    return deck;
}

export function deleteDeck(deckId: number): void {
    const index = allDecks.findIndex((d) => d.id === deckId);
    if (index !== -1) {
        const deck = allDecks[index];
        const category = allCategories.find((c) => c.id === deck.categoryId);
        if (category) category.decks = Math.max(0, category.decks - 1);
        allDecks.splice(index, 1);
    }
}

export function createCategory(name: string): Category {
    const newCategory = { id: Date.now(), name, decks: 0, cards: 0, active: false, proficiency: 0 };
    allCategories.push(newCategory);
    return newCategory;
}

export function deleteCategory(categoryId: number): void {
    const index = allCategories.findIndex((c) => c.id === categoryId);
    if (index !== -1) allCategories.splice(index, 1);
}

export function createCard(card: Card): Card {
    allCards.push(card);
    return card;
}

export function updateCardStatus(cardId: number, status: string): void {
    const index = allCards.findIndex((c) => c.id === cardId);
    if (index !== -1) allCards[index] = { ...allCards[index], status };
}

export function deleteCard(cardId: number): void {
    const index = allCards.findIndex((c) => c.id === cardId);
    if (index !== -1) allCards.splice(index, 1);
}

export function pushADeck(cards: Card[], deck: Deck): void {
    const newDeck = createDeck(deck);
    cards.forEach((card) => createCard({ ...card, deckId: newDeck.id }));
}

export function updateDeckLastActive(deckId: number): void {
    const index = allDecks.findIndex((deck) => deck.id === deckId);
    if (index !== -1) allDecks[index] = { ...allDecks[index], lastActive: Date.now() };
}

// ── Sync API functions (background, fire-and-forget) ────────────

// Category sync
export function syncCreateCategory(name: string): Promise<Category> {
    return apiClient.post<Category>('/api/categories/create', { name });
}

export function syncUpdateCategory(id: number, name: string): Promise<void> {
    return apiClient.put<void>('/api/categories/update', { id, name });
}

export function syncDeleteCategory(id: number): Promise<void> {
    return apiClient.post<void>('/api/categories/delete', { id });
}

// Deck sync
export function syncCreateDeck(name: string, categoryId: number): Promise<Deck> {
    return apiClient.post<Deck>('/api/deck/create', { name, categoryId });
}

export function syncUpdateDeck(id: number, name: string, categoryId: number): Promise<void> {
    return apiClient.put<void>('/api/deck/update', { id, name, categoryId });
}

export function syncDeleteDeck(deckId: number): Promise<void> {
    return apiClient.delete<void>('/api/deck/delete', { deckId });
}

// Card sync
export function syncCreateCard(question: string, answer: string, status: string, deckId: number): Promise<Card> {
    return apiClient.post<Card>('/api/card/create', { question, answer, status, deckId });
}

export function syncUpdateCard(id: number, question: string, answer: string, status: string, deckId: number): Promise<void> {
    return apiClient.put<void>('/api/card/update', { id, question, answer, status, deckId });
}

export function syncDeleteCard(cardId: number): Promise<void> {
    return apiClient.delete<void>('/api/card/delete', { cardId });
}

// ── Lazy-load cards for a specific deck ─────────────────────────
export async function fetchCardsByDeck(deckId: number): Promise<Card[]> {
    const cards = await apiClient.get<Card[]>('/api/card/get-all', { deckId });
    // Replace cards for this deck in local cache
    const withoutDeck = allCards.filter((c) => c.deckId !== deckId);
    allCards.splice(0, allCards.length, ...withoutDeck, ...cards);
    return cards;
}

// ── Recent decks (metrics endpoint) ─────────────────────────────

interface RecentDeckApiResponse {
    deckId: number;
    deckName: string;
    totalCards: number;
    status: string;
    lastActive: number;
}

const recentDeckInFlightByLimit = new Map<number, Promise<Deck[]>>();

export async function getRecentDecks(limit = 6): Promise<Deck[]> {
    const inFlight = recentDeckInFlightByLimit.get(limit);
    if (inFlight) return inFlight;

    const request = apiClient
        .get<RecentDeckApiResponse[]>("/api/metrics/recent-decks")
        .then((recentDecks) =>
            recentDecks.slice(0, limit).map((deck) => ({
                id: deck.deckId,
                name: deck.deckName,
                cards: deck.totalCards,
                status: deck.status,
                categoryId: 0,
                lastActive: deck.lastActive ?? Date.now(),
            })),
        )
        .finally(() => {
            recentDeckInFlightByLimit.delete(limit);
        });

    recentDeckInFlightByLimit.set(limit, request);
    return request;
}