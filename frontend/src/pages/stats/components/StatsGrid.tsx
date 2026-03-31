import { Flame, Clock, Target, Brain, BarChart3, Book } from "lucide-react";
import StatCard from "./StatCard";
import { formatPercent } from "../../../services/StatsFormulaService";
import type { MetricsSummaryResponse } from "../../../services/MetricsService";

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

interface StatsGridProps {
  summary: MetricsSummaryResponse;
}

export default function StatsGrid({ summary }: StatsGridProps) {
  const latestSessionLabel = summary.latestSessionEndedAt
    ? new Date(summary.latestSessionEndedAt).toLocaleString()
    : "No session yet";

  const stats = [
    { title: "Cards Studied Today", value: summary.cardsStudiedToday, change: `${summary.totalReviews} total`, icon: Book },
    { title: "Current Streak", value: `${summary.currentStreakDays} Days`, change: "based on review logs", icon: Flame },
    { title: "Total Sessions", value: summary.totalSessions, change: latestSessionLabel, icon: Clock },
    { title: "Accuracy", value: formatPercent(summary.accuracy), change: `${summary.correctReviews}/${summary.totalReviews || 0}`, icon: Target },
    { title: "Retention Rate", value: formatPercent(summary.retentionRate), change: "good + easy", icon: Brain },
    {
      title: "Total Study Time",
      value: formatDuration(summary.totalStudyTimeSeconds),
      change: `avg ${formatDuration(summary.averageSessionDurationSeconds)}`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
