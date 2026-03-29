import { apiClient } from "./ApiClient";

export interface DeckMetricResponse {
    deckId: number;
    deckName: string;
    totalCards: number;
    reviewedCards: number;
    mastery: number;
    efficiency: number;
    status: string;
    lastActive: number;
}

export interface MetricsSummaryResponse {
    cardsStudiedToday: number;
    currentStreakDays: number;
    totalSessions: number;
    correctReviews: number;
    totalReviews: number;
    accuracy: number;
    retentionRate: number;
    totalStudyTimeSeconds: number;
    averageSessionDurationSeconds: number;
    latestSessionEndedAt: number;
    deckMetrics: DeckMetricResponse[];
}

export function getMetricsSummary(): Promise<MetricsSummaryResponse> {
    return apiClient.get<MetricsSummaryResponse>('/api/metrics/summary');
}
