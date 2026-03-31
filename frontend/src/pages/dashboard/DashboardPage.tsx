import { useState } from "react";
import CreateFlashcardForm from "./components/CreateFlashcardForm";
import RecentCards from "./components/RecentDeck";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">
          Smart Review
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Study Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Manage decks, add fresh cards, and jump back into the sets you were reviewing most recently.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6">
          <CreateFlashcardForm onCardAdded={() => setRefreshKey((prev) => prev + 1)} />
        </div>

        <div className="xl:col-span-2">
          <RecentCards refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
