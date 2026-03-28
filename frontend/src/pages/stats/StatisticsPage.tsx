import DeckPerformanceTable from "./components/DeckPerformanceTable";
import StatsGrid from "./components/StatsGrid";


export default function StatisticsPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <p className="text-gray-500">
          Detailed insights into your learning progress and performance.
        </p>
      </div>

      {/* STATS */}
      <StatsGrid />

      {/* TABLE */}
      <DeckPerformanceTable />

    </div>
  );
}