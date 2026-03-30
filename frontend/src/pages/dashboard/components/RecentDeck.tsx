import { useEffect, useState } from "react";
import { useNotification } from "../../../components/common/NotificationProvider";
import { getRecentDecks } from "../../../services/DeckServices";
import type { Deck } from "../../../types/Deck";
import DeckItem from "./DeckItem";

export default function RecentCards({ refreshKey }: { refreshKey?: number } = {}) {
  const [recentDecks, setRecentDecks] = useState<Deck[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    let isMounted = true;

    void getRecentDecks().then((data) => {
      if (isMounted) {
        setRecentDecks(data);
      }
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Khong the tai recent decks";
      if (isMounted) {
        notify(message, "error");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [refreshKey, notify]);

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Recent Decks
          <span className="ml-2 text-sm text-gray-400">{recentDecks.length} decks</span>
        </h2>

        {/* Icons */}
        <div className="flex gap-2 text-gray-400">
          <span>≡</span>
          <span>▦</span>
        </div>
      </div>

      {/* GRID */}
      <div className="max-h-[520px] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-4">
          {recentDecks.map((deck) => (
            <DeckItem key={deck.id} deck={deck} />
          ))}
        </div>
      </div>
    </div>
  );
}