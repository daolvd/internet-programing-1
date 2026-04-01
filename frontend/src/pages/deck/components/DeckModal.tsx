import { useEffect, useState } from "react";
import { X, Layers, Plus, Pencil, Trash2, Check } from "lucide-react";
import Modal from "../../../components/modal/Modal";
import { useCards } from "../../../hook/DeckHook";
import { getNameOfDeck } from "../../../services/DeckServices";
import { saveDeck } from "../../../services/DeckModalService";

export default function DeckModal({ onClose, selectedCategoryId, deckId }: { onClose: () => void; selectedCategoryId: number; deckId: number }) {
  const [title, setTitle] = useState({ name: getNameOfDeck(deckId), id: deckId });
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
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Layers className="h-5 w-5 text-blue-500" />
          Edit Deck
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-600 active:bg-blue-700"
            onClick={() => {
              saveDeck(draftCards, title.id, title.name, selectedCategoryId);
              onClose();
            }}
          >
            Save Deck
          </button>
        </div>
      </div>

      <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5">
        <div>
          <label className="text-sm font-medium text-gray-500">
            DECK TITLE
          </label>

          <input
            value={title.name}
            onChange={(e) => setTitle({ ...title, name: e.target.value })}
            className="mt-2 w-full rounded-lg border bg-gray-50 p-3"
          />
        </div>

        <div className="space-y-3 rounded-xl border bg-gray-50 p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4 text-blue-500" />
            Add New Flashcard
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <textarea
              placeholder="Enter question..."
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="rounded border p-2"
            />

            <textarea
              placeholder="Enter answer..."
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              className="rounded border p-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addFlashcard}
              className="rounded bg-blue-100 px-3 py-1 text-blue-600 transition-colors duration-150 hover:bg-blue-200 active:bg-blue-300"
            >
              + Add to List
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex justify-between">
            <h3 className="font-semibold">
              Flashcards in this Deck
            </h3>

            <span className="text-sm text-gray-400">
              {draftCards.length} cards
            </span>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto">
            {draftCards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
              >
                {editingCardId === card.id ? (
                  <div className="mr-3 grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      value={editingQuestion}
                      onChange={(e) => setEditingQuestion(e.target.value)}
                      className="rounded border p-2 text-sm"
                      placeholder="Question"
                    />
                    <input
                      value={editingAnswer}
                      onChange={(e) => setEditingAnswer(e.target.value)}
                      className="rounded border p-2 text-sm"
                      placeholder="Answer"
                    />
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="font-medium">{card.question}</p>
                    <p className="text-sm text-gray-400">
                      {card.answer}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 self-end md:self-auto">
                  {editingCardId === card.id ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEditCard}
                        className="rounded p-1 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
                        aria-label="Cancel edit"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEditCard(card.id)}
                        className="rounded p-1 transition-colors duration-150 hover:bg-green-100 active:bg-green-200"
                        aria-label="Save edit"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEditCard(card.id, card.question, card.answer)}
                        className="rounded p-1 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
                        aria-label="Edit card"
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className="rounded p-1 transition-colors duration-150 hover:bg-red-100 active:bg-red-200"
                        aria-label="Delete card"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t p-5 text-sm text-gray-400">
        <span>Changes are autosaved to draft</span>
        <span>Last edited 2m ago</span>
      </div>
    </Modal>
  );
}
