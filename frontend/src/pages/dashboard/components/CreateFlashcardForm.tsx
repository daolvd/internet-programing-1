import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { allCards, allCategories, allDecks, createCard, syncCreateCard } from "../../../services/DeckServices";
import { useNotification } from "../../../components/common/NotificationProvider";

interface CreateFlashcardFormProps {
  onCardAdded?: () => void;
}

export default function CreateFlashcardForm({ onCardAdded }: CreateFlashcardFormProps = {}) {
  const { notify } = useNotification();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(allCategories[0]?.id ?? 0);
  const [selectedDeckId, setSelectedDeckId] = useState<number>(
    allDecks.find(d => d.categoryId === (allCategories[0]?.id ?? 0))?.id ?? 0
  );

  const decksInCategory = useMemo(
    () => allDecks.filter((deck) => deck.categoryId === selectedCategoryId),
    [selectedCategoryId]
  );

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    const decks = allDecks.filter((deck) => deck.categoryId === categoryId);
    setSelectedDeckId(decks[0]?.id ?? 0);
  };

  const handleDeckChange = (deckId: number) => {
    setSelectedDeckId(deckId);
    const selectedDeck = allDecks.find((deck) => deck.id === deckId);
    if (selectedDeck) {
      setSelectedCategoryId(selectedDeck.categoryId);
    }
  };

  const handleAddFlashcard = () => {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (decksInCategory.length === 0) {
      notify("You must create a deck first.", "warning");
      return;
    }

    if (!trimmedQuestion || !trimmedAnswer) {
      notify("Please enter both question and answer.", "warning");
      return;
    }

    if (!selectedDeckId) {
      notify("Please select a deck first.", "warning");
      return;
    }

    const newCardId = (allCards[allCards.length - 1]?.id ?? 0) + 1;
    createCard({
      id: newCardId,
      question: trimmedQuestion,
      answer: trimmedAnswer,
      deckId: selectedDeckId,
      status: "Don't know",
    });

    // Sync to server
    syncCreateCard(trimmedQuestion, trimmedAnswer, "Don't know", selectedDeckId)
      .then((serverCard) => {
        const idx = allCards.findIndex((c) => c.id === newCardId);
        if (idx !== -1) allCards[idx] = { ...allCards[idx], id: serverCard.id };
        onCardAdded?.();
      })
      .catch((err) => notify("Failed to sync card: " + (err instanceof Error ? err.message : "Unknown error"), "error"));

    const deckIndex = allDecks.findIndex((deck) => deck.id === selectedDeckId);
    if (deckIndex !== -1) {
      allDecks[deckIndex].cards = allDecks[deckIndex].cards + 1;
    }

    setQuestion("");
    setAnswer("");
    notify("Flashcard added successfully.", "success");
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border">

      <div className="flex items-center gap-2 mb-4 font-semibold">
        <Plus className="text-blue-500 w-5 h-5" />
        Create New Flashcard
      </div>

      {/* Question */}
      <div className="mb-4">
        <label className="text-sm font-medium">Question</label>
        <textarea
          placeholder="e.g. What is the capital of France?"
          className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {/* Answer */}
      <div className="mb-4">
        <label className="text-sm font-medium">Answer</label>
        <textarea
          placeholder="e.g. Paris"
          className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="text-sm font-medium">Category</label>
        <select
          className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
          value={selectedCategoryId}
          onChange={(e) => handleCategoryChange(Number(e.target.value))}
        >
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Deck */}
      <div className="mb-4">
        <label className="text-sm font-medium">Deck</label>
        <select
          className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
          value={selectedDeckId}
          onChange={(e) => handleDeckChange(Number(e.target.value))}
          disabled={decksInCategory.length === 0}
        >
          {decksInCategory.length === 0 && <option value={0}>No decks in this category</option>}
          {decksInCategory.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleAddFlashcard}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
      >
        ➤ Add Flashcard
      </button>
    </div>
  );
}