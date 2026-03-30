import type { Category } from "../../../types/Category";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  
}
 

export default function CategoryCard({ category , onClick, onEdit, onDelete }:CategoryCardProps) {
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div onClick={onClick} className={`bg-white p-5 rounded-xl border shadow-sm 
      ${category.active ? "border-blue-500" : ""}`}>

      {/* Title */}
      <div className="flex justify-between">
        <h3 className="font-semibold">{category.name}</h3>
        <div className="flex items-center gap-2">
          { category.active && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              ACTIVE
            </span>
          )}
          {category.id !== 0 && (
            <>
              <button
                type="button"
                aria-label="Edit category"
                onClick={handleEditClick}
                className="p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Delete category"
                onClick={handleDeleteClick}
                className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <p className="text-sm text-gray-500 mt-2">
        {category.decks} Decks • {category.cards} Cards
      </p>

      {/* Progress */}
      <div className="mt-4 h-2 bg-gray-100 rounded">
        <div 
          className="h-full bg-blue-500 rounded" 
          style={{ width: `${category.proficiency}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-1">
        {Number(category.proficiency || 0).toFixed(2)}% Overall Proficiency
      </p>

    </div>
  );
}