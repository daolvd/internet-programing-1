import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Deck } from "../../../types/Deck";
import { useNotification } from "../../../components/common/NotificationProvider";
import { useConfirm } from "../../../components/common/ConfirmProvider";
import { LAST_REVIEW_DECK_KEY } from "../../../constants/storageKeys";

interface DeckItemProps {
  deck: Deck;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

const iconButtonClass = "rounded-lg p-1.5 shadow-sm transition duration-150 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function DeckItem({ deck, onDelete, onEdit }: DeckItemProps) {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { confirm } = useConfirm();

  return (
    <div className="relative rounded-xl border bg-white p-5 shadow-sm transition duration-150 hover:border-blue-200">
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          type="button"
          className={`${iconButtonClass} hover:bg-gray-100`}
          onClick={onEdit}
          aria-label="Edit deck"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={async () => {
            const accepted = await confirm({
              title: "Delete Deck",
              message: "Are you sure you want to delete this deck?",
              confirmText: "Delete",
              cancelText: "Cancel",
              tone: "danger",
            });

            if (accepted) {
              onDelete(deck.id);
              notify("Deck deleted successfully.", "success");
            }
          }}
          className={`${iconButtonClass} hover:bg-red-100 focus-visible:ring-red-500`}
          aria-label="Delete deck"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>

      <h3 className="text-lg font-semibold">{deck.name}</h3>

      <p className="mt-1 text-sm text-gray-500">
        {deck.cards} Cards
      </p>

      <p className="mt-2 text-sm text-green-500">
        {deck.status}
      </p>

      <button
        type="button"
        onClick={() => {
          localStorage.setItem(LAST_REVIEW_DECK_KEY, String(deck.id));
          navigate(`/review?deckId=${deck.id}`);
        }}
        className="mt-4 w-full rounded-xl bg-blue-500 py-2 font-medium text-white shadow-sm transition duration-150 hover:bg-blue-600 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        ▶ Study Now
      </button>
    </div>
  );
}
