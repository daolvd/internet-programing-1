import { useState } from "react";
import DeckItem from "./DeckItem";
import CreateDeckCard from "./CreateDeckCard";
import DeckModal from "./DeckModal";
import { useDeck } from "../../../hook/DeckHook";
import { getCategoryById, getGeneralCategoryId } from "../../../services/DeckServices";

export default function DeckList({
  selectedCategoryId,
  categoryModalOpen,
  onDeckChange,
}: {
  selectedCategoryId: number;
  categoryModalOpen?: boolean;
  onDeckChange?: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const effectiveCategoryId = selectedCategoryId > 0 && getCategoryById(selectedCategoryId)
    ? selectedCategoryId
    : getGeneralCategoryId();
  const categoryName = getCategoryById(effectiveCategoryId)?.name ?? "Unknown Category";
  const { decks, deleteDeck } = useDeck(effectiveCategoryId, openModal || categoryModalOpen || false);
  const [selectedEditDeck, setSelectedEditDeck] = useState<number>(0);

  const handleDelete = (id: number) => {
    deleteDeck(id);
    onDeckChange?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">
          Decks in '{categoryName}'{" "}
          <span className="text-gray-400">
            {decks.length} Total
          </span>
        </h2>

        <button
          type="button"
          className="rounded-xl bg-blue-500 px-4 py-2 font-medium text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => {
            setOpenModal(true);
            setSelectedEditDeck(Date.now());
          }}
        >
          + Create Deck
        </button>
      </div>

      {openModal && (
        <DeckModal
          deckId={selectedEditDeck}
          selectedCategoryId={effectiveCategoryId}
          onClose={() => {
            setOpenModal(false);
            onDeckChange?.();
          }}
        />
      )}

      <div className="grid max-h-90 grid-cols-1 gap-4 overflow-y-auto xl:grid-cols-2">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            onDelete={handleDelete}
            onEdit={() => {
              setSelectedEditDeck(deck.id);
              setOpenModal(true);
            }}
          />
        ))}

        <button
          type="button"
          onClick={() => {
            setOpenModal(true);
            setSelectedEditDeck(Date.now());
          }}
        >
          <CreateDeckCard />
        </button>
      </div>
    </div>
  );
}
