import { useMemo } from "react";
import { Flame, Clock, Target, Brain, BarChart3, Book } from "lucide-react";
import StatCard from "./StatCard";
import { getCardReviewMetrics, getCardReviews, getOrCreateUserId } from "../../../services/CardReviewService";
import { getStudySessions } from "../../../services/StudySessionService";
import { calculateAccuracy, calculateRetention, formatPercent } from "../../../services/StatsFormulaService";

function getCurrentStreakDays(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;

  const daySet = new Set(
    timestamps.map((time) => {
      const date = new Date(time);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (daySet.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function StatsGrid() {
  const stats = useMemo(() => {
    const userId = getOrCreateUserId();
    const reviews = getCardReviews().filter((review) => review.user_id === userId);
    const sessions = getStudySessions().filter((session) => session.user_id === userId);
    const metrics = getCardReviewMetrics({ userId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    const reviewsToday = reviews.filter((review) => review.reviewed_at >= todayTimestamp).length;

    const totalSessionDurationSeconds = sessions.reduce((sum, session) => sum + session.duration_seconds, 0);
    const averageSessionDurationSeconds = sessions.length > 0
      ? Math.round(totalSessionDurationSeconds / sessions.length)
      : 0;

    const latestSession = sessions
      .slice()
      .sort((a, b) => b.ended_at - a.ended_at)[0];

    const latestSessionLabel = latestSession
      ? new Date(latestSession.ended_at).toLocaleString()
      : "No session yet";

    const accuracyRate = calculateAccuracy(metrics.correctReviews, metrics.totalReviews);
    const retentionRate = calculateRetention(
      metrics.ratingDistribution.good,
      metrics.ratingDistribution.easy,
      metrics.totalReviews,
    );

    return [
      { title: "Cards Studied Today", value: reviewsToday, change: `${metrics.totalReviews} total`, icon: Book },
      { title: "Current Streak", value: `${getCurrentStreakDays(reviews.map((review) => review.reviewed_at))} Days`, change: "based on review logs", icon: Flame },
      { title: "Total Sessions", value: sessions.length, change: latestSessionLabel, icon: Clock },
      { title: "Accuracy", value: formatPercent(accuracyRate), change: `${metrics.correctReviews}/${metrics.totalReviews || 0}`, icon: Target },
      { title: "Retention Rate", value: formatPercent(retentionRate), change: "good + easy", icon: Brain },
      {
        title: "Total Study Time",
        value: formatDuration(totalSessionDurationSeconds),
        change: `avg ${formatDuration(averageSessionDurationSeconds)}`,
        icon: BarChart3,
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}