import { useEffect, useState } from "react";
import type { Category } from "../types/Category";
import { allCards, allCategories, allDecks } from "../services/DeckServices";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        setCategories([...allCategories]);
    }, []);

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
        }

        return nearestId;
    }

    function updateCategory(id: number, name: string, decks: number, cards: number) {
        const index = allCategories.findIndex((c) => c.id === id);
        if (index !== -1) {
            allCategories[index] = { ...allCategories[index], name, decks, cards };
            refreshCategories();
        } else {
            createCategory(id, name, decks, cards);
        }
    }

    return { categories, createCategory, deleteCategory, updateCategory };
}