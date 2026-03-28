import { X, Layers, Plus, Pencil, Trash2, Check } from "lucide-react";

import { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { useCards } from "../../../hook/DeckHook";
import { getNameOfDeck } from "../../../services/DeckServices";
import { saveDeck } from "../../../services/DeckModalService";

export default function DeckModal({ onClose, selectedCategoryId, deckId }: { onClose: () => void; selectedCategoryId: number; deckId: number }) {
 
  const [title, setTitle] = useState({name :getNameOfDeck(deckId),id :deckId});
  const { cards } = useCards(title.id);
  const [draftCards, setDraftCards] = useState(cards);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");

  useEffect(() => {
    setDraftCards(cards);
  }, [cards]);

  const addFlashcard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setDraftCards((prev) => [
      ...prev,
      { id: Date.now(), question: newQ.trim(), answer: newA.trim(), deckId: title.id, status: "Don't know" },
    ]);
    setNewQ("");
    setNewA("");
  };

  const handleDeleteCard = (id: number) => {
    if (editingCardId === id) {
      setEditingCardId(null);
      setEditingQuestion("");
      setEditingAnswer("");
    }
    setDraftCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleStartEditCard = (id: number, question: string, answer: string) => {
    setEditingCardId(id);
    setEditingQuestion(question);
    setEditingAnswer(answer);
  };

  const handleCancelEditCard = () => {
    setEditingCardId(null);
    setEditingQuestion("");
    setEditingAnswer("");
  };

  const handleSaveEditCard = (id: number) => {
    const trimmedQuestion = editingQuestion.trim();
    const trimmedAnswer = editingAnswer.trim();
    if (!trimmedQuestion || !trimmedAnswer) return;

    setDraftCards((prev) => prev.map((card) => (
      card.id === id ? { ...card, question: trimmedQuestion, answer: trimmedAnswer } : card
    )));
    handleCancelEditCard();
  };

  return (
    <Modal onClose={onClose}>

      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b">

        <div className="flex items-center gap-2 font-semibold text-lg">
          <Layers className="w-5 h-5 text-blue-500" />
          Edit Deck
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            saveDeck(draftCards, title.id, title.name, selectedCategoryId)
            onClose();
          }
        }
          >
       
            Save Deck
          </button>
        </div>

      </div>

      {/* BODY */}
      <div className="p-5 space-y-6">

        {/* TITLE */}
        <div>
          <label className="text-sm font-medium text-gray-500">
            DECK TITLE
          </label>

          <input
            value={title.name}
            onChange={(e) => setTitle({...title, name: e.target.value})}
            className="w-full mt-2 p-3 border rounded-lg bg-gray-50"
          />
        </div>

        {/* ADD FLASHCARD */}
        <div className="border rounded-xl p-4 bg-gray-50 space-y-3">

          <div className="flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4 text-blue-500" />
            Add New Flashcard
          </div>

          <div className="grid grid-cols-2 gap-3">
            <textarea
              placeholder="Enter question..."
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="p-2 border rounded"
            />

            <textarea
              placeholder="Enter answer..."
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={addFlashcard}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded"
            >
              + Add to List
            </button>
          </div>

        </div>

        {/* LIST */}
        <div>
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">
              Flashcards in this Deck
            </h3>

            <span className="text-sm text-gray-400">
              {draftCards.length} cards
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {draftCards.map((card) => (
              <div
                key={card.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >

                {editingCardId === card.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-3 mr-3">
                    <input
                      value={editingQuestion}
                      onChange={(e) => setEditingQuestion(e.target.value)}
                      className="p-2 border rounded text-sm"
                      placeholder="Question"
                    />
                    <input
                      value={editingAnswer}
                      onChange={(e) => setEditingAnswer(e.target.value)}
                      className="p-2 border rounded text-sm"
                      placeholder="Answer"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{card.question}</p>
                    <p className="text-sm text-gray-400">
                      {card.answer}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingCardId === card.id ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEditCard}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label="Cancel edit"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEditCard(card.id)}
                        className="p-1 rounded hover:bg-green-100"
                        aria-label="Save edit"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEditCard(card.id, card.question, card.answer)}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label="Edit card"
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1 rounded hover:bg-red-100"
                        aria-label="Delete card"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between p-5 border-t text-sm text-gray-400">
        <span>Changes are autosaved to draft</span>
        <span>Last edited 2m ago</span>
      </div>

    </Modal>
  );
}