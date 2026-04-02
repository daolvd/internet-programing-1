import type { Card } from "../types/Card";
import type { Deck } from "../types/Deck";
import {
    allCards,
    allDecks,
    createDeck,
    fetchCardsByDeck,
    syncCreateCard,
    syncCreateDeck,
    syncDeleteCard,
    syncRefreshCategories,
    syncRefreshDecks,
    syncUpdateCard,
    syncUpdateDeck,
} from "./DeckServices";

export async function saveDeck(listCards: Card[], deckId: number, name: string, categoryId: number) {
    const deckIndex = allDecks.findIndex((d) => d.id === deckId);
    const isNewDeck = deckIndex === -1;

    // 1. Local update (instant)
    const cardsWithoutDeck = allCards.filter((c) => c.deckId !== deckId);
    const normalizedDeckCards = listCards.map((card) => ({ ...card, deckId }));
    allCards.splice(0, allCards.length, ...cardsWithoutDeck, ...normalizedDeckCards);

    if (!isNewDeck) {
        allDecks[deckIndex].name = name;
        allDecks[deckIndex].categoryId = categoryId;
        allDecks[deckIndex].cards = listCards.length;
    } else {
        const newDeck: Deck = { id: deckId, name, categoryId, cards: listCards.length, status: "New Deck", lastActive: Date.now() };
        createDeck(newDeck);
    }

    // 2. Sync with backend, then re-fetch canonical deck/category data.
    if (isNewDeck) {
        const serverDeck = await syncCreateDeck(name, categoryId);

        const idx = allDecks.findIndex((d) => d.id === deckId);
        if (idx !== -1) {
            allDecks[idx] = { ...allDecks[idx], id: serverDeck.id };
        }

        await Promise.allSettled(
            listCards.map((card) =>
                syncCreateCard(card.question, card.answer, card.status || "Don't know", serverDeck.id),
            ),
        );
    } else {
        await syncUpdateDeck(deckId, name, categoryId);

        const serverCards = await fetchCardsByDeck(deckId);
        const serverIds = new Set(serverCards.map((c) => c.id));
        const draftIds = new Set(listCards.map((c) => c.id));

        await Promise.allSettled([
            ...serverCards
                .filter((c) => !draftIds.has(c.id))
                .map((c) => syncDeleteCard(c.id)),
            ...listCards
                .filter((c) => !serverIds.has(c.id))
                .map((c) => syncCreateCard(c.question, c.answer, c.status || "Don't know", deckId)),
            ...listCards
                .filter((c) => serverIds.has(c.id))
                .map((c) => syncUpdateCard(c.id, c.question, c.answer, c.status || "Don't know", deckId)),
        ]);
    }

    await Promise.all([syncRefreshDecks(), syncRefreshCategories()]);
}
