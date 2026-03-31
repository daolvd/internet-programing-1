import { useEffect, useState } from "react";
import { X, Folder } from "lucide-react";
import Modal from "../../../components/modal/Modal";
import { allDecks, allCategories, getGeneralCategoryId } from "../../../services/DeckServices";
import { useNotification } from "../../../components/common/NotificationProvider";
import { saveCategoryChanges } from "../../../services/CategoryModalService";

export default function CategoryModal({ onClose, selectedCategoryId }: { onClose: () => void; selectedCategoryId: number }) {
  const { notify } = useNotification();
  const [showAddDeckList, setShowAddDeckList] = useState(false);
  const [originalCategories, setOriginalCategories] = useState<Record<number, number>>({});
  const [categoryName, setCategoryName] = useState("");
  const [initialDeckCategoryById, setInitialDeckCategoryById] = useState<Record<number, number>>({});
  const [draftDeckCategoryById, setDraftDeckCategoryById] = useState<Record<number, number>>({});

  useEffect(() => {
    const category = allCategories.find((c) => c.id === selectedCategoryId);
    if (category) {
      setCategoryName(category.name);
    } else {
      setCategoryName("");
    }

    const categoryMap: Record<number, number> = {};
    allDecks.forEach((deck) => {
      categoryMap[deck.id] = deck.categoryId;
    });

    setInitialDeckCategoryById(categoryMap);
    setDraftDeckCategoryById(categoryMap);
    setOriginalCategories({});
  }, [selectedCategoryId]);

  const decks = allDecks.filter((deck) => draftDeckCategoryById[deck.id] === selectedCategoryId);
  const availableDecks = [...allDecks];

  const handleToggleDeck = (deckId: number, checked: boolean) => {
    const deck = allDecks.find((item) => item.id === deckId);
    if (!deck) return;

    if (checked) {
      setOriginalCategories((prev) => {
        if (prev[deckId] !== undefined) return prev;
        return { ...prev, [deckId]: draftDeckCategoryById[deckId] ?? deck.categoryId };
      });
      setDraftDeckCategoryById((prev) => ({
        ...prev,
        [deckId]: selectedCategoryId,
      }));
    } else {
      const originalCategoryId = originalCategories[deckId];
      const targetCategoryId = (originalCategoryId !== undefined && originalCategoryId !== selectedCategoryId)
        ? originalCategoryId
        : getGeneralCategoryId();

      setDraftDeckCategoryById((prev) => ({
        ...prev,
        [deckId]: targetCategoryId,
      }));

      setOriginalCategories((prev) => {
        const rest = { ...prev };
        delete rest[deckId];
        return rest;
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Folder className="h-5 w-5 text-blue-500" />
          Edit Category
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5">
        <div>
          <label className="text-sm font-medium text-gray-500">
            CATEGORY NAME
          </label>

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            readOnly={selectedCategoryId === 0}
            className={`mt-2 w-full rounded-lg border bg-gray-50 p-3 ${selectedCategoryId === 0 ? "cursor-not-allowed opacity-60" : ""}`}
          />
        </div>

        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold">
              Decks in this Category
            </h3>

            <button
              type="button"
              onClick={() => setShowAddDeckList((prev) => !prev)}
              className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white transition-colors duration-150 hover:bg-blue-600 active:bg-blue-700"
            >
              + Add Deck
            </button>
          </div>

          {showAddDeckList && (
            <div className="mb-4 rounded-lg border bg-gray-50">
              <div className="max-h-48 space-y-2 overflow-y-auto p-3">
                {availableDecks.map((deck) => (
                  <label
                    key={deck.id}
                    className="flex cursor-pointer items-center gap-2 rounded p-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={draftDeckCategoryById[deck.id] === selectedCategoryId}
                      onChange={(event) => handleToggleDeck(deck.id, event.target.checked)}
                      className="cursor-pointer"
                    />
                    <span>{deck.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto rounded-lg border">
            <div className="space-y-3 p-3">
              {decks.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">No decks in this category</p>
              ) : (
                decks.map((deck) => (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="rounded bg-gray-100 p-2">
                        <Folder className="h-4 w-4 text-blue-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{deck.name}</p>
                        <p className="text-sm text-gray-400">
                          {deck.cards} cards • {deck.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t p-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-gray-500 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              await saveCategoryChanges({
                selectedCategoryId,
                categoryName,
                draftDeckCategoryById,
                initialDeckCategoryById,
              });
            } catch (err) {
              notify("Failed to save category changes: " + (err instanceof Error ? err.message : "Unknown error"), "error");
            } finally {
              onClose();
            }
          }}
          className="rounded-lg bg-blue-500 px-5 py-2 text-white transition-colors duration-150 hover:bg-blue-600 active:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}
