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
    <div className="relative w-64">
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
        <button
          type="button"
          onClick={submitSearch}
          className="mr-2"
          aria-label="Search cards"
        >
          <Search className="w-4 h-4 text-gray-400" />
        </button>

        <input
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
          className="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-400"
        />
      </div>

      {isOpen && (
        <div className="absolute top-[46px] left-0 right-0 z-[1200] bg-white border rounded-xl shadow-lg p-2 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500 px-2 py-3">No matching cards found.</p>
          ) : (
            <div className="space-y-1">
              {results.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => openCardInReview(card.deckId, card.id)}
                  className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-100"
                >
                  <p className="text-sm font-medium text-gray-800 truncate">{card.question}</p>
                  <p className="text-xs text-gray-500 truncate">
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