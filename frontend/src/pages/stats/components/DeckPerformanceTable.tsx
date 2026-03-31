import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal/Modal";
import type { DeckMetricResponse } from "../../../services/MetricsService";
import { formatPercent } from "../../../services/StatsFormulaService";

interface DeckPerformanceTableProps {
  deckMetrics: DeckMetricResponse[];
}

function AllDecksModal({
  onClose,
  openDeck,
  deckMetrics,
}: {
  onClose: () => void;
  openDeck: (id: number) => void;
  deckMetrics: DeckMetricResponse[];
}) {
  const shouldScroll = deckMetrics.length > 9;

  return (
    <Modal onClose={onClose}>
      <div className="border-b p-5">
        <h3 className="text-lg font-semibold">All Decks</h3>
        <p className="text-sm text-gray-500">Choose a deck to continue studying.</p>
      </div>

      <div className={`p-5 ${shouldScroll ? "max-h-[70vh] overflow-y-auto" : ""}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {deckMetrics.map((deck) => (
            <div key={deck.deckId} className="space-y-2 rounded-xl border bg-gray-50 p-4">
              <p className="font-semibold text-gray-800">{deck.deckName}</p>
              <p className="text-sm text-gray-500">Mastery: {formatPercent(deck.mastery)}</p>
              <p className="text-sm text-gray-500">Cards: {deck.reviewedCards}/{deck.totalCards}</p>
              <p className="text-xs text-gray-400">
                Last active: {new Date(deck.lastActive).toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => openDeck(deck.deckId)}
                className="mt-2 w-full rounded-lg bg-blue-500 py-2 text-sm text-white transition-colors duration-150 hover:bg-blue-600 active:scale-[0.98] active:bg-blue-700"
              >
                Study Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default function DeckPerformanceTable({ deckMetrics }: DeckPerformanceTableProps) {
  const topRecent = deckMetrics.slice(0, 4);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openDeck = (deckId: number) => {
    setIsOpen(false);
    navigate(`/review?deckId=${deckId}`);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5 font-semibold">
          Deck Performance
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="p-4 text-left">Deck Name</th>
                <th>Mastery</th>
                <th>Cards</th>
                <th>Efficiency</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {topRecent.map((deck) => (
                <tr key={deck.deckId} className="border-t">
                  <td className="p-4 font-medium">{deck.deckName}</td>
                  <td>
                    <div className="mx-auto h-2 w-32 rounded bg-gray-100">
                      <div
                        className="h-full rounded bg-blue-500"
                        style={{ width: `${Math.round(deck.mastery * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="text-center">{deck.reviewedCards}/{deck.totalCards}</td>
                  <td className="text-center font-medium text-blue-500">
                    {formatPercent(deck.efficiency)}
                  </td>
                  <td className="text-center">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
                      {deck.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {topRecent.map((deck) => (
            <div key={deck.deckId} className="rounded-xl border bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{deck.deckName}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {deck.reviewedCards}/{deck.totalCards} cards reviewed
                  </p>
                </div>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
                  {deck.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Mastery</span>
                    <span>{formatPercent(deck.mastery)}</span>
                  </div>
                  <div className="h-2 rounded bg-gray-200">
                    <div
                      className="h-full rounded bg-blue-500"
                      style={{ width: `${Math.round(deck.mastery * 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-blue-600">Efficiency: {formatPercent(deck.efficiency)}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full cursor-pointer py-4 text-center text-blue-500 active:scale-[0.99] active:bg-blue-50"
        >
          View All Decks →
        </button>
      </div>

      {isOpen && (
        <AllDecksModal
          onClose={() => setIsOpen(false)}
          openDeck={openDeck}
          deckMetrics={deckMetrics}
        />
      )}
    </>
  );
}
