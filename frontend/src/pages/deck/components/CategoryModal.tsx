import { X, Folder } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import Modal from "../../../components/modal/Modal";
import { allDecks, allCategories } from "../../../services/DeckServices";
import { getDecksByCategory } from "../../../services/CategroyService";


export default function CategoryModal({ onClose, selectedCategoryId } : { onClose: () => void; selectedCategoryId: number }) {
  const [showAddDeckList, setShowAddDeckList] = useState(false);
  const [originalCategories, setOriginalCategories] = useState<Record<number, number>>({});
  const [version, setVersion] = useState(0);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const category = allCategories.find((c) => c.id === selectedCategoryId);
    if (category) {
      setCategoryName(category.name);
    }
  }, [selectedCategoryId]);

  const decks = useMemo(
    () => getDecksByCategory(selectedCategoryId),
    [selectedCategoryId, version]
  );

  const availableDecks = useMemo(() => [...allDecks], [version]);

  const handleToggleDeck = (deckId: number, checked: boolean) => {
    const deck = allDecks.find((item) => item.id === deckId);
    if (!deck) return;

    if (checked) {
      setOriginalCategories((prev) => {
        if (prev[deckId] !== undefined) return prev;
        return { ...prev, [deckId]: deck.categoryId };
      });
      deck.categoryId = selectedCategoryId;
    } else {
      const originalCategoryId = originalCategories[deckId];
      
      if (originalCategoryId !== undefined && originalCategoryId !== selectedCategoryId) {
        deck.categoryId = originalCategoryId;
      } else {
        deck.categoryId = 0; // Move to General category
      }
      
      setOriginalCategories((prev) => {
        const { [deckId]: _, ...rest } = prev;
        return rest;
      });
    }
    
    setVersion((prev) => prev + 1);
  };

  return (
    <Modal onClose={onClose}>

      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Folder className="w-5 h-5 text-blue-500" />
          Edit Category
        </div>

        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-6">

        {/* CATEGORY NAME */}
        <div>
          <label className="text-sm font-medium text-gray-500">
            CATEGORY NAME
          </label>

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            readOnly={selectedCategoryId === 0}
            className={`w-full mt-2 p-3 border rounded-lg bg-gray-50 ${selectedCategoryId === 0 ? "cursor-not-allowed opacity-60" : ""}`}
          />
        </div>

        {/* DECK LIST */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">
              Decks in this Category
            </h3>

            <button
              type="button"
              onClick={() => setShowAddDeckList((prev) => !prev)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              + Add Deck
            </button>
          </div>

          {showAddDeckList && (
            <div className="mb-4 border rounded-lg bg-gray-50">
              <div className="max-h-48 overflow-y-auto p-3 space-y-2">
                {availableDecks.map((deck) => (
                  <label
                    key={deck.id}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={deck.categoryId === selectedCategoryId}
                      onChange={(event) => handleToggleDeck(deck.id, event.target.checked)}
                      className="cursor-pointer"
                    />
                    <span>{deck.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            <div className="space-y-3 p-3">
              {decks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No decks in this category</p>
              ) : (
                decks.map((deck) => (
                  <div
                    key={deck.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gray-100 rounded">
                        <Folder className="w-4 h-4 text-blue-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{deck.name}</p>
                        <p className="text-sm text-gray-400">
                          {deck.cards} cards • {deck.status}
                        </p>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                   
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 p-5 border-t">

        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-500"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            if (categoryName.trim()) {
              const index = allCategories.findIndex((c) => c.id === selectedCategoryId);
              if (index !== -1) {
                allCategories[index].name = categoryName.trim();
              }
            }
            onClose();
          }}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
        >
          Save Changes
        </button>

      </div>

    </Modal>
  );
}