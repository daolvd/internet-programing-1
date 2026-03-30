import type { Card } from "../types/Card";
import type { Deck } from "../types/Deck";
import { allCards, allDecks, createDeck, fetchCardsByDeck, syncCreateCard, syncCreateDeck, syncDeleteCard, syncUpdateCard, syncUpdateDeck } from "./DeckServices";

export function saveDeck(listCards: Card[], deckId: number, name: string, categoryId: number) {
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

    // 2. Background sync
    if (isNewDeck) {
        syncCreateDeck(name, categoryId)
            .then(async (serverDeck) => {
                // Update deck id from server
                const idx = allDecks.findIndex((d) => d.id === deckId);
                if (idx !== -1) allDecks[idx] = { ...allDecks[idx], id: serverDeck.id };

                // Create all cards on server
                for (const card of listCards) {
                    await syncCreateCard(card.question, card.answer, card.status || "Don't know", serverDeck.id)
                        .catch(() => { /* individual card fail is acceptable */ });
                }
            })
            .catch(() => { /* notify handled by caller or swallowed */ });
    } else {
        syncUpdateDeck(deckId, name, categoryId).catch(() => {});

        // Diff cards: compare with what's on server
        fetchCardsByDeck(deckId)
            .then((serverCards) => {
                const serverIds = new Set(serverCards.map((c) => c.id));
                const draftIds = new Set(listCards.map((c) => c.id));

                // Delete removed cards
                serverCards
                    .filter((c) => !draftIds.has(c.id))
                    .forEach((c) => syncDeleteCard(c.id).catch(() => {}));

                // Create new cards
                listCards
                    .filter((c) => !serverIds.has(c.id))
                    .forEach((c) => syncCreateCard(c.question, c.answer, c.status || "Don't know", deckId).catch(() => {}));

                // Update existing cards
                listCards
                    .filter((c) => serverIds.has(c.id))
                    .forEach((c) => syncUpdateCard(c.id, c.question, c.answer, c.status || "Don't know", deckId).catch(() => {}));
            })
            .catch(() => {});
    }
}