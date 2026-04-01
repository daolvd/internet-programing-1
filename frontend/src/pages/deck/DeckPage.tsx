import { useState } from "react";
import CategoryList from "./components/CategoryList";
import DeckList from "./components/DeckList";
import CategoryModal from "./components/CategoryModal";
import { getGeneralCategoryId } from "../../services/DeckServices";

export default function DeckPage() {
  const [openCreateCategory, createCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(getGeneralCategoryId());
  const [deckUpdateCounter, setDeckUpdateCounter] = useState(0);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">Library</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Categories and Decks</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Organize your study materials into logical groups
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-blue-500 px-4 py-2 font-medium text-white shadow-sm transition duration-150 hover:bg-blue-600 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => {
              createCategory(true);
              setSelectedCategoryId(Date.now());
            }}
          >
            + Create Category
          </button>
        </div>
      </div>

      {openCreateCategory && (
        <CategoryModal selectedCategoryId={selectedCategoryId} onClose={() => createCategory(false)} />
      )}

      <CategoryList
        selectedCategoryId={selectedCategoryId}
        OnselectedCategoryId={setSelectedCategoryId}
        categoryModalOpen={openCreateCategory}
        refreshTrigger={deckUpdateCounter}
        onEditCategory={(id) => {
          setSelectedCategoryId(id);
          createCategory(true);
        }}
      />

      <DeckList
        selectedCategoryId={selectedCategoryId}
        categoryModalOpen={openCreateCategory}
        onDeckChange={() => setDeckUpdateCounter((prev) => prev + 1)}
      />
    </div>
  );
}
