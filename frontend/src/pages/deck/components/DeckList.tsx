import { useState } from "react";
import DeckItem from "./DeckItem";
import CreateDeckCard from "./CreateDeckCard";
import DeckModal from "./DeckModal";
import { useDeck } from "../../../hook/DeckHook";

export default function DeckList( {selectedCategoryId, categoryModalOpen, onDeckChange} : {selectedCategoryId : number; categoryModalOpen?: boolean; onDeckChange?: () => void}) {
  const [openModal, setOpenModal] = useState(false);
  const {decks, deleteDeck} = useDeck(selectedCategoryId, openModal || categoryModalOpen || false);
  const [selectedEditDeck, setSelectedEditDeck] = useState<number>(0);


  // delete handler
  const handleDelete = (id:number) => {
    deleteDeck(id);
    onDeckChange?.();
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">
          Decks in 'Languages'{" "}
          <span className="text-gray-400">
            {decks.length} Total
          </span>
        </h2>

        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-lg"
          onClick={() =>{ setOpenModal(true)
            setSelectedEditDeck(Date.now());
          }}
        >
          + Create Deck
        </button>
      </div>

      {/* MODAL */}
      {openModal && (
        <DeckModal deckId={selectedEditDeck} selectedCategoryId={selectedCategoryId} onClose={() => {
          setOpenModal(false);
          onDeckChange?.();
        }} />
      )}

      {/* LIST */}
      <div className="grid grid-cols-2 gap-4 max-h-90 overflow-y-auto">
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

        <CreateDeckCard />
      </div>

    </div>
  );
}