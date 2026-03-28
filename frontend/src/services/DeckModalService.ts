import type { Card } from "../types/Card";
import type { Deck } from "../types/Deck";
import { allCards, allDecks, createDeck } from "./DeckServices";

export function saveDeck(listCards : Card[],deckId: number, name: string, categoryId: number) {
    const deckIndex = allDecks.findIndex((d) => d.id === deckId);
    const cardIds = listCards.map((c) => c.id);

    const cardsWithoutDeck = allCards.filter((c) => c.deckId !== deckId);
    const normalizedDeckCards = listCards.map((card) => ({ ...card, deckId }));
    allCards.splice(0, allCards.length, ...cardsWithoutDeck, ...normalizedDeckCards);

    if (deckIndex !== -1) {
        // Update existing deck
        allDecks[deckIndex].name = name;
        allDecks[deckIndex].categoryId = categoryId;
        allDecks[deckIndex].cards = cardIds.length;
    } else {
        // Create new deck
        const newDeck: Deck = { id: deckId, name, categoryId , cards: cardIds.length, status: "New Deck", lastActive: Date.now() };
        createDeck(newDeck);
    }
}