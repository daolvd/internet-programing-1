import { allDecks } from "./DeckServices";

export function getDecksByCategory(categoryId: number) {
    return allDecks.filter((deck) => deck.categoryId === categoryId);
}