import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal/Modal";
import { useDeckPerformanceData } from "../../../hook/DeckPerformanceHook";

export default function DeckPerformanceTable() {
  const data = useDeckPerformanceData();
  const allDecksData = useDeckPerformanceData(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const shouldScrollAllDecks = allDecksData.length > 9;

  const openDeck = (deckId: number) => {
    setIsOpen(false);
    navigate(`/review?deckId=${deckId}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm">

        <div className="p-5 border-b font-semibold">
          Deck Performance
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left p-4">Deck Name</th>
              <th>Mastery</th>
              <th>Cards</th>
              <th>Efficiency</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((deck) => (
              <tr key={deck.id} className="border-t">

                <td className="p-4 font-medium">{deck.name}</td>

                {/* Progress */}
                <td>
                  <div className="w-32 h-2 bg-gray-100 rounded mx-auto">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{ width: `${deck.progress}%` }}
                    />
                  </div>
                </td>

                <td className="text-center">{deck.cards}</td>

                <td className="text-center text-blue-500 font-medium">
                  {deck.efficiency}
                </td>

                <td className="text-center">
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                    {deck.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full text-center py-4 text-blue-500 cursor-pointer"
        >
          View All Decks →
        </button>
      </div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <div className="p-5 border-b">
            <h3 className="font-semibold text-lg">All Decks</h3>
            <p className="text-sm text-gray-500">Choose a deck to continue studying.</p>
          </div>

          <div className={`p-5 ${shouldScrollAllDecks ? "max-h-[70vh] overflow-y-auto" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allDecksData.map((deck) => (
                <div key={deck.id} className="border rounded-xl p-4 bg-gray-50 space-y-2">
                  <p className="font-semibold text-gray-800">{deck.name}</p>
                  <p className="text-sm text-gray-500">Mastery: {deck.progress}%</p>
                  <p className="text-sm text-gray-500">Cards: {deck.cards}</p>
                  <p className="text-xs text-gray-400">
                    Last active: {new Date(deck.lastActive).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => openDeck(deck.id)}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg text-sm"
                  >
                    Study Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}