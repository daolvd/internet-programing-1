import { useEffect, useState } from "react";
import { allCards, allDecks, getCardsByDeck, getDecksByCategory } from "../services/DeckServices";
import type { Deck } from "../types/Deck";
import type { Card } from "../types/Card";

 

export function useDeck(categoryId: number , openModel: boolean) {
  const [data, setData] = useState<Deck[]>([]);

  useEffect(() => {
    const result = getDecksByCategory(categoryId);
    setData(result);
  }, [categoryId, openModel]);

  const deleteDeck = (id: number) => {
    setData(prev => prev.filter(d => d.id !== id));
    allDecks.splice(allDecks.findIndex(d => d.id === id), 1); // also delete from mock data
  };

  return {
    decks: data,
    deleteDeck,
  };
}

//todo : create useCard hook to get cards by deck id and delete card by id
export function useCards(deckId: number) {
  const [data, setData] = useState<Card[]>([]);

  useEffect(() => {
    const result = getCardsByDeck(deckId);
    setData(result);
  }, [deckId]);

  const deleteCard = (id: number) => {
    setData(prev => prev.filter(c => c.id !== id));
    allCards.splice(allCards.findIndex(c => c.id === id), 1); // also delete from mock data
  };

  const addCard = (card: Card) => {
    setData((prev) => [...prev, card]);
    allCards.push(card);
  };

  const updateCard = (id: number, question: string, answer: string) => {
    setData((prev) => prev.map((card) => (
      card.id === id ? { ...card, question, answer } : card
    )));

    const index = allCards.findIndex((card) => card.id === id);
    if (index !== -1) {
      allCards[index] = { ...allCards[index], question, answer };
    }
  };

  return {
    cards: data,
    deleteCard,
    addCard,
    updateCard,
  };
}
