package com.flashcard.backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class MetricsSummaryResponse {
    private Long cardsStudiedToday;
    private Long currentStreakDays;
    private Long totalSessions;
    private Long correctReviews;
    private Long totalReviews;
    private Double accuracy;
    private Double retentionRate;
    private Long totalStudyTimeSeconds;
    private Long averageSessionDurationSeconds;
    private Long latestSessionEndedAt;
    private List<DeckMetricResponse> deckMetrics;
}
