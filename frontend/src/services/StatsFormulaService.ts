export function calculateEfficiency(totalCorrect: number, totalReviews: number): number {
  if (totalReviews <= 0) return 0;

  // Efficiency = total_correct / total_reviews
  return totalCorrect / totalReviews;
}

export function calculateRetention(totalGood: number, totalEasy: number, totalReviews: number): number {
  if (totalReviews <= 0) return 0;

  // Retention = (total_good + total_easy) / total_reviews
  return (totalGood + totalEasy) / totalReviews;
}

export function calculateAccuracy(totalCorrect: number, totalReviews: number): number {
  if (totalReviews <= 0) return 0;

  // Accuracy = total_correct / total_reviews
  return totalCorrect / totalReviews;
}

export function formatPercent(ratio: number): string {
  // Percent = ratio * 100
  return `${Math.round(ratio * 100)}%`;
}
