import { useEffect, useState } from "react";
import DeckPerformanceTable from "./components/DeckPerformanceTable";
import StatsGrid from "./components/StatsGrid";
import { getMetricsSummary, type MetricsSummaryResponse } from "../../services/MetricsService";

export default function StatisticsPage() {
  const [summary, setSummary] = useState<MetricsSummaryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getMetricsSummary()
      .then(setSummary)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load analytics right now.");
      });
  }, []);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h2 className="text-lg font-semibold">Analytics unavailable</h2>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 px-6 py-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">Insights</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Analytics Overview</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Detailed insights into your learning progress and performance.
        </p>
      </div>

      <StatsGrid summary={summary} />
      <DeckPerformanceTable deckMetrics={summary.deckMetrics} />
    </div>
  );
}
