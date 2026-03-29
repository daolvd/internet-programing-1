import { useState } from "react";
import CreateFlashcardForm from "./components/CreateFlashcardForm";
import ProgressCard from "./components/ProgressCard";
import RecentCards from "./components/RecentDeck";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Study Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and create your personal flashcard decks.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="space-y-6">
          <CreateFlashcardForm onCardAdded={() => setRefreshKey(prev => prev + 1)} />
          <ProgressCard />
        </div>

        {/* RIGHT */}
        <div className="col-span-2">
          <RecentCards refreshKey={refreshKey} />
        </div>

      </div>
    </div>
  );
}