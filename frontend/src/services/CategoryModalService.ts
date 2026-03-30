import {
  allCategories,
  allDecks,
  createCategory,
  syncCreateCategory,
  syncRefreshCategories,
  syncUpdateCategory,
  syncUpdateDeck,
} from "./DeckServices";

type SaveCategoryChangesInput = {
  selectedCategoryId: number;
  categoryName: string;
  draftDeckCategoryById: Record<number, number>;
  initialDeckCategoryById: Record<number, number>;
};

export async function saveCategoryChanges({
  selectedCategoryId,
  categoryName,
  draftDeckCategoryById,
  initialDeckCategoryById,
}: SaveCategoryChangesInput): Promise<void> {
  let persistedCategoryId = selectedCategoryId;
  const trimmedName = categoryName.trim();

  if (trimmedName) {
    const index = allCategories.findIndex((c) => c.id === selectedCategoryId);
    if (index !== -1) {
      allCategories[index].name = trimmedName;
      await syncUpdateCategory(selectedCategoryId, trimmedName);
    } else {
      // Keep local-first behavior while waiting for server-generated id.
      createCategory(trimmedName);
      const createdCategory = await syncCreateCategory(trimmedName);
      persistedCategoryId = createdCategory.id;
    }
  }

  const normalizedDraftDeckCategoryById: Record<number, number> = {};
  Object.keys(draftDeckCategoryById).forEach((deckIdKey) => {
    const id = Number(deckIdKey);
    const draftCategoryId = draftDeckCategoryById[id];
    normalizedDraftDeckCategoryById[id] = draftCategoryId === selectedCategoryId ? persistedCategoryId : draftCategoryId;
  });

  for (const deck of allDecks) {
    const nextCategoryId = normalizedDraftDeckCategoryById[deck.id];
    const prevCategoryId = initialDeckCategoryById[deck.id] ?? deck.categoryId;
    if (nextCategoryId !== undefined && nextCategoryId !== prevCategoryId) {
      deck.categoryId = nextCategoryId;
      await syncUpdateDeck(deck.id, deck.name, nextCategoryId);
    }
  }

  await syncRefreshCategories();
}
