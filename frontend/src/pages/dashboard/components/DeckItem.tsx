import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Deck } from "../../../types/Deck";
import { getCategoryNameFromDeck } from "../../../services/DeckServices";

interface DeckItemProps {
  deck: Deck;
}

export default function DeckItem({ deck }: DeckItemProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition">

      {/* Category */}
      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">
        {getCategoryNameFromDeck(deck.id)}
      </span>

      {/* Deck summary */}
      <p className="mt-3 font-medium text-gray-800">
        {deck.name} - {deck.cards} cards
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Last active: {new Date(deck.lastActive).toLocaleString()}
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={() => navigate(`/review?deckId=${deck.id}`)}
        className="mt-4 flex items-center gap-1 text-blue-500 hover:text-blue-600"
      >
        <BookOpen className="w-4 h-4" />
        Review Now
      </button>

    </div>
  );
}