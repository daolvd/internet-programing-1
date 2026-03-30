import { RefreshCcw } from "lucide-react";
import type { Card } from "../../../types/Card";
import { getCategoryName } from "../../../services/DeckServices";



export default function FlashcardViewer({ card, show, onFlip }: { card: Card; show: boolean; onFlip: () => void }) {


  return (
    <div
      onClick={onFlip}
      className="w-full h-[300px] perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${show ? "rotate-y-180" : ""
          }`}
      >

        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg p-10 text-center">

          <p className="text-xs tracking-widest text-gray-400 mb-4">
            {getCategoryName(card.deckId)}
          </p>

          <h2 className="text-3xl font-bold text-gray-800">
            {card.question}
          </h2>

          <p className="text-gray-400 mt-4">
            Click to reveal answer
          </p>

        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-lg p-10 text-center">

          <p className="text-xs tracking-widest text-gray-400 mb-4">
            {getCategoryName(card.deckId)}
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {card.answer}
          </h2>

        </div>

      </div>

      {/* REFRESH BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // tránh trigger card click
          onFlip();
        }}
        className="absolute bottom-6 right-6 text-blue-400"
      >
        <RefreshCcw className="w-5 h-5" />
      </button>
    </div>
  );
}