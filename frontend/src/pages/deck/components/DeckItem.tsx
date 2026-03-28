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

export default function DeckItem({ deck, onDelete, onEdit }: DeckItemProps) {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { confirm } = useConfirm();

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm relative">

      {/* ACTION */}
      <div className="absolute top-4 right-4 flex gap-2">
        
        <button className="p-1 rounded hover:bg-gray-100" onClick={onEdit}>
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>

        <button
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
          className="p-1 rounded hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>

      </div>

      {/* CONTENT */}
      <h3 className="font-semibold text-lg">{deck.name}</h3>

      <p className="text-gray-500 text-sm mt-1">
        {deck.cards} Cards
      </p>

      <p className="text-sm mt-2 text-green-500">
        {deck.status}
      </p>

      <button
        type="button"
        onClick={() => {
          localStorage.setItem(LAST_REVIEW_DECK_KEY, String(deck.id));
          navigate(`/review?deckId=${deck.id}`);
        }}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        ▶ Study Now
      </button>

    </div>
  );
}