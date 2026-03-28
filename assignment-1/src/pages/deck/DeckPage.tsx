import CategoryList from "./components/CategoryList";
import DeckList from "./components/DeckList";
import CategoryModal from "./components/CategoryModal";
import { useState } from "react";


export default function DeckPage() {
    const [openCreateCategory, createCategory] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">
            Organize your study materials into logical groups
          </p>
        </div>

        <button
          className="text-blue-500 font-medium"
          onClick={() =>{
           createCategory(true)
           setSelectedCategoryId(Date.now());
          } }
        >
          + Create Category
        </button>
      </div>
      {/* MODAL */}
      {openCreateCategory && (
        <CategoryModal selectedCategoryId={selectedCategoryId} onClose={() => createCategory(false)} />
      )}
      {/* CATEGORY LIST */}
      <CategoryList selectedCategoryId={selectedCategoryId}
       OnselectedCategoryId={setSelectedCategoryId}
       onEditCategory={(id) => {
         setSelectedCategoryId(id);
         createCategory(true);
       }} />

      {/* DECK LIST */}
      <DeckList selectedCategoryId={selectedCategoryId} categoryModalOpen={openCreateCategory} />

    </div>
  );
}