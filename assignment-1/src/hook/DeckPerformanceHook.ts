import { useMemo } from "react";
import { allDecks } from "../services/DeckServices";
import { getCardReviewMetrics, getCardReviews, getOrCreateUserId } from "../services/CardReviewService";
import { calculateEfficiency, formatPercent } from "../services/StatsFormulaService";
import { resolveStatus } from "../utils/Utils";

export interface DeckPerformanceItem {
  id: number;
  name: string;
  progress: number;
  cards: string;
  efficiency: string;
  status: string;
  lastActive: number;
}



export function useDeckPerformanceData(limit: number = 4): DeckPerformanceItem[] {
  return useMemo(() => {
    const userId = getOrCreateUserId();
    const userReviews = getCardReviews().filter((review) => review.user_id === userId);

    const result = allDecks
      .map((deck) => {
        const deckReviews = userReviews.filter((review) => review.deck_id === deck.id);
        const metrics = getCardReviewMetrics({ userId, deckId: deck.id });
        const efficiency = calculateEfficiency(metrics.correctReviews, metrics.totalReviews);

        return {
          id: deck.id,
          name: deck.name,
          progress: Math.round(metrics.accuracy * 100),
          cards: `${deckReviews.length}/${deck.cards}`,
          efficiency: formatPercent(efficiency),
          status: resolveStatus(metrics.accuracy),
          lastActive: deck.lastActive,
        };
      })
      .sort((a, b) => b.lastActive - a.lastActive);

    return limit > 0 ? result.slice(0, limit) : result;
  }, [limit]);
}


