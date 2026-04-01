import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allCards, getCategoryNameFromDeck, getNameOfDeck } from "../../services/DeckServices";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const keyword = submittedQuery.trim().toLowerCase();
    if (!keyword) return [];

    return allCards
      .filter((card) => (
        card.question.toLowerCase().includes(keyword)
        || card.answer.toLowerCase().includes(keyword)
      ))
      .slice(0, 20);
  }, [submittedQuery]);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setIsOpen(false);
      return;
    }

    setSubmittedQuery(trimmed);
    setIsOpen(true);
  };

  const openCardInReview = (deckId: number, cardId: number) => {
    setIsOpen(false);
    navigate(`/review?deckId=${deckId}&cardId=${cardId}`);
  };

  return (
    <div className="relative w-full sm:w-64">
      <div className="flex items-center rounded-xl bg-gray-100 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
        <button
          type="button"
          onClick={submitSearch}
          className="mr-2"
          aria-label="Search cards"
        >
          <Search className="h-4 w-4 text-gray-400" />
        </button>

        <input
          aria-label="Search flashcards"
          type="text"
          placeholder="Search cards..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitSearch();
            }
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[46px] z-[1200] max-h-80 overflow-y-auto rounded-xl border bg-white p-2 shadow-lg">
          {results.length === 0 ? (
            <p className="px-2 py-3 text-sm text-gray-500">No matching cards found.</p>
          ) : (
            <div className="space-y-1">
              {results.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => openCardInReview(card.deckId, card.id)}
                  className="w-full rounded-lg px-2 py-2 text-left hover:bg-gray-100"
                >
                  <p className="truncate text-sm font-medium text-gray-800">{card.question}</p>
                  <p className="truncate text-xs text-gray-500">
                    {getNameOfDeck(card.deckId)} • {getCategoryNameFromDeck(card.deckId)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
