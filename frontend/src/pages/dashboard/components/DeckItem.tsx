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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">

      {/* Category */}
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
        {getCategoryNameFromDeck(deck.id)}
      </span>

      {/* Deck summary */}
      <p className="mt-3 font-medium text-slate-800">
        {deck.name} - {deck.cards} cards
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Last active: {new Date(deck.lastActive).toLocaleString()}
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={() => navigate(`/review?deckId=${deck.id}`)}
        className="mt-4 flex items-center gap-1 rounded-lg px-2 py-1 text-blue-500 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
      >
        <BookOpen className="w-4 h-4" />
        Review Now
      </button>

    </div>
  );
}
