import { useEffect, useState } from "react";
import { allCards, allDecks, getDecksByCategory, fetchCardsByDeck, syncDeleteDeck, syncCreateCard, syncUpdateCard, syncDeleteCard } from "../services/DeckServices";
import { useNotification } from "../components/common/NotificationProvider";
import type { Deck } from "../types/Deck";
import type { Card } from "../types/Card";

export function useDeck(categoryId: number, openModel: boolean) {
  const [data, setData] = useState<Deck[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    const result = getDecksByCategory(categoryId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(result);
  }, [categoryId, openModel]);

  const deleteDeck = (id: number) => {
    setData(prev => prev.filter(d => d.id !== id));
    allDecks.splice(allDecks.findIndex(d => d.id === id), 1);

    // Background sync
    syncDeleteDeck(id)
      .catch((err: any) => notify("Failed to sync delete: " + (err?.message || "Unknown error"), "error"));
  };

  return {
    decks: data,
    deleteDeck,
  };
}

// Cards are lazy-loaded from API when a deck is opened
export function useCards(deckId: number) {
  const [data, setData] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    if (deckId <= 0) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchCardsByDeck(deckId)
      .then((cards) => setData(cards))
      .catch((err: any) => notify("Failed to load cards: " + (err?.message || "Unknown error"), "error"))
      .finally(() => setLoading(false));
  }, [deckId, notify]);

  const deleteCard = (id: number) => {
    setData(prev => prev.filter(c => c.id !== id));
    allCards.splice(allCards.findIndex(c => c.id === id), 1);

    // Background sync
    syncDeleteCard(id)
      .catch((err: any) => notify("Failed to sync delete: " + (err?.message || "Unknown error"), "error"));
  };

  const addCard = (card: Card) => {
    setData((prev) => [...prev, card]);
    allCards.push(card);

    // Background sync
    syncCreateCard(card.question, card.answer, card.status || "Don't know", card.deckId)
      .then((serverCard) => {
        // Update local id with server-assigned id
        const idx = allCards.findIndex((c) => c.id === card.id);
        if (idx !== -1) allCards[idx] = { ...allCards[idx], id: serverCard.id };
        setData((prev) => prev.map((c) => c.id === card.id ? { ...c, id: serverCard.id } : c));
      })
      .catch((err: any) => notify("Failed to sync card: " + (err?.message || "Unknown error"), "error"));
  };

  const updateCard = (id: number, question: string, answer: string) => {
    setData((prev) => prev.map((card) => (
      card.id === id ? { ...card, question, answer } : card
    )));

    const existing = allCards.find((card) => card.id === id);
    const index = allCards.findIndex((card) => card.id === id);
    if (index !== -1) {
      allCards[index] = { ...allCards[index], question, answer };
    }

    // Background sync
    if (existing) {
      syncUpdateCard(id, question, answer, existing.status, existing.deckId)
        .catch((err: any) => notify("Failed to sync update: " + (err?.message || "Unknown error"), "error"));
    }
  };

  return {
    cards: data,
    loading,
    deleteCard,
    addCard,
    updateCard,
  };
}
