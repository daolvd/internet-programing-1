import { RefreshCcw } from "lucide-react";
import type { Card } from "../../../types/Card";
import { getCategoryName } from "../../../services/DeckServices";

export default function FlashcardViewer({ card, show, onFlip }: { card: Card; show: boolean; onFlip: () => void }) {
  return (
    <div
      onClick={onFlip}
      className="relative h-[300px] w-full cursor-pointer perspective transition-transform duration-150 hover:scale-[1.01] active:scale-[0.995]"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onFlip();
        }
      }}
      aria-label={show ? "Hide flashcard answer" : "Reveal flashcard answer"}
    >
      <div
        className={`relative h-full w-full transform-style preserve-3d transition-transform duration-500 ${show ? "rotate-y-180" : ""}`}
      >
        <div className="absolute h-full w-full rounded-2xl bg-white p-10 text-center shadow-lg backface-hidden">
          <p className="mb-4 text-xs tracking-widest text-gray-400">
            {getCategoryName(card.deckId)}
          </p>

          <h2 className="text-3xl font-bold text-gray-800">
            {card.question}
          </h2>

          <p className="mt-4 text-gray-400">
            Click to reveal answer
          </p>
        </div>

        <div className="absolute h-full w-full rounded-2xl bg-white p-10 text-center shadow-lg backface-hidden rotate-y-180">
          <p className="mb-4 text-xs tracking-widest text-gray-400">
            {getCategoryName(card.deckId)}
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {card.answer}
          </h2>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFlip();
        }}
        className="absolute bottom-6 right-6 rounded-full bg-white/95 p-2 text-blue-500 shadow-md transition duration-150 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-600 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Flip flashcard"
      >
        <RefreshCcw className="h-5 w-5" />
      </button>
    </div>
  );
}
