import CategoryCard from "./CategoryCard";
import { useCategories } from "../../../hook/CategoryHook";
import { useNotification } from "../../../components/common/NotificationProvider";
import { useConfirm } from "../../../components/common/ConfirmProvider";
import { getCategoryById } from "../../../services/DeckServices";


interface Props {
  selectedCategoryId: number;
  OnselectedCategoryId: (id: number) => void;
  onEditCategory: (id: number) => void;
  categoryModalOpen?: boolean;
  refreshTrigger?: number;
}

export default function CategoryList({ selectedCategoryId, OnselectedCategoryId, onEditCategory, categoryModalOpen, refreshTrigger }: Props) {
  const { categories, deleteCategory } = useCategories(categoryModalOpen || refreshTrigger);
  const { notify } = useNotification();
  const { confirm } = useConfirm();

  const handleDeleteCategory = async (catId: number) => {
    if (getCategoryById(catId)?.name === "General") {
      notify("The General category cannot be deleted.", "warning");
      return;
    }

    const accepted = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });

    if (accepted) {
      const nearestId = deleteCategory(catId);
      if (selectedCategoryId === catId) {
        OnselectedCategoryId(nearestId);
      }
      notify("Category deleted successfully.", "success");
    }
  };

  return (
    <div className="grid grid-flow-col auto-cols-[250px] gap-6 overflow-x-auto">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={{ ...cat, active: cat.id === selectedCategoryId }}
          onClick={() => OnselectedCategoryId(cat.id)}
          onEdit={() => onEditCategory(cat.id)}
          onDelete={async () => handleDeleteCategory(cat.id)}
        />
      ))}
    </div>
  );
}
