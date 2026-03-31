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
      const message = error instanceof Error ? error.message : "Unable to load recent decks.";
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
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          Recent Decks
          <span className="ml-2 text-sm text-slate-400">{recentDecks.length} decks</span>
        </h2>

        <div className="hidden gap-2 text-slate-400 sm:flex">
          <span>≡</span>
          <span>▦</span>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recentDecks.map((deck) => (
            <DeckItem key={deck.id} deck={deck} />
          ))}
        </div>
      </div>
    </div>
  );
}
