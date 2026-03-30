import { useEffect, useState } from "react";
import DeckPerformanceTable from "./components/DeckPerformanceTable";
import StatsGrid from "./components/StatsGrid";
import { getMetricsSummary, type MetricsSummaryResponse } from "../../services/MetricsService";


export default function StatisticsPage() {
  const [summary, setSummary] = useState<MetricsSummaryResponse | null>(null);

  useEffect(() => {
    getMetricsSummary()
      .then(setSummary)
      .catch(console.error);
  }, []);

  if (!summary) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
      <StatsGrid summary={summary} />

      {/* TABLE */}
      <DeckPerformanceTable deckMetrics={summary.deckMetrics} />

    </div>
  );
}