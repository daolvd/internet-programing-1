import { useEffect, useState } from "react";
import type { Category } from "../types/Category";
import { allCards, allCategories, allDecks, syncCreateCategory, syncDeleteCategory, syncUpdateCategory } from "../services/DeckServices";
import { useNotification } from "../components/common/NotificationProvider";

export function useCategories(refreshTrigger?: unknown) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategories([...allCategories]);

    // Listen for async updates (e.g. syncRefreshCategories completed)
    const onUpdated = () => setCategories([...allCategories]);
    window.addEventListener('categories-updated', onUpdated);
    return () => window.removeEventListener('categories-updated', onUpdated);
  }, [refreshTrigger]);

  const refreshCategories = () => {
    setCategories([...allCategories]);
  };

  function createCategory(id: number, name: string, decks: number, cards: number) {
    const newCategory: Category = {
      id,
      name,
      decks,
      cards,
      active: false,
      proficiency: 0
    };
    allCategories.push(newCategory);
    refreshCategories();

    // Background sync
    syncCreateCategory(name)
      .then((serverCat) => {
        // Update local id with server-assigned id
        const idx = allCategories.findIndex((c) => c.id === id);
        if (idx !== -1) {
          allCategories[idx] = { ...allCategories[idx], id: serverCat.id };
          refreshCategories();
        }
      })
      .catch((err: any) => notify("Failed to sync category: " + (err?.message || "Unknown error"), "error"));
  }

  function deleteCategory(id: number): number {
    const index = allCategories.findIndex((c) => c.id === id);
    const nearestId = index !== -1
      ? allCategories[index + 1]?.id || allCategories[index - 1]?.id || 0
      : 0;

    if (index !== -1) {
      allCategories.splice(index, 1);
      allDecks.filter((d) => d.categoryId === id).forEach((deck) => {
        allCards.splice(0, allCards.length, ...allCards.filter((c) => c.deckId !== deck.id));
      });
      allDecks.splice(0, allDecks.length, ...allDecks.filter((d) => d.categoryId !== id));
      refreshCategories();

      // Background sync
      syncDeleteCategory(id)
        .catch((err: any) => notify("Failed to sync delete: " + (err?.message || "Unknown error"), "error"));
    }

    return nearestId;
  }

  function updateCategory(id: number, name: string, decks: number, cards: number) {
    const index = allCategories.findIndex((c) => c.id === id);
    if (index !== -1) {
      allCategories[index] = { ...allCategories[index], name, decks, cards };
      refreshCategories();

      // Background sync
      syncUpdateCategory(id, name)
        .catch((err: any) => notify("Failed to sync update: " + (err?.message || "Unknown error"), "error"));
    } else {
      createCategory(id, name, decks, cards);
    }
  }

  return { categories, createCategory, deleteCategory, updateCategory, refreshCategories };
}