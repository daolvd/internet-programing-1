import { Pencil, Trash2 } from "lucide-react";
import { getGeneralCategoryId } from "../../../services/DeckServices";
import type { Category } from "../../../types/Category";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const iconButtonClass = "rounded-lg border p-1.5 shadow-sm transition duration-150 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function CategoryCard({ category, onClick, onEdit, onDelete }: CategoryCardProps) {
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit();
  };
  const generalId = getGeneralCategoryId();
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition duration-150 hover:border-blue-200 active:scale-[0.99] ${
        category.active ? "border-blue-500 ring-2 ring-blue-100" : ""
      }`}
    >
      <div className="flex justify-between gap-3">
        <h3 className="font-semibold">{category.name}</h3>
        <div className="flex items-center gap-2">
          {category.active && (
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
              ACTIVE
            </span>
          )}
          {category.id !== generalId && (
            <>
              <button
                type="button"
                aria-label="Edit category"
                onClick={handleEditClick}
                className={`${iconButtonClass} border-blue-200 text-blue-600 hover:bg-blue-50`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete category"
                onClick={handleDeleteClick}
                className={`${iconButtonClass} border-red-200 text-red-600 hover:bg-red-50 focus-visible:ring-red-500`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {category.decks} Decks • {category.cards} Cards
      </p>

      <div className="mt-4 h-2 rounded bg-gray-100">
        <div
          className="h-full rounded bg-blue-500 transition-[width] duration-300"
          style={{ width: `${category.proficiency}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-gray-400">
        {Number(category.proficiency || 0).toFixed(2)}% Overall Proficiency
      </p>
    </div>
  );
}
