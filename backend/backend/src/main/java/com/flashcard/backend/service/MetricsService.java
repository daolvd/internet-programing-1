package com.flashcard.backend.service;

import com.flashcard.backend.dto.response.DeckMetricResponse;
import com.flashcard.backend.dto.response.MetricsSummaryResponse;
import com.flashcard.backend.model.Card;
import com.flashcard.backend.model.CardReview;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.model.StudySession;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.CardReviewRepository;
import com.flashcard.backend.repository.DeckRepository;
import com.flashcard.backend.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class MetricsService {
    private final CardReviewRepository cardReviewRepository;
    private final StudySessionRepository studySessionRepository;
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;

    public MetricsService(
            CardReviewRepository cardReviewRepository,
            StudySessionRepository studySessionRepository,
            DeckRepository deckRepository,
            CardRepository cardRepository
    ) {
        this.cardReviewRepository = cardReviewRepository;
        this.studySessionRepository = studySessionRepository;
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
    }

    public MetricsSummaryResponse getSummary(Long userId) {
        List<CardReview> reviews = cardReviewRepository.findAllByUserId(userId);
        List<StudySession> sessions = studySessionRepository.getAllByUser_Id(userId);
        List<Deck> decks = deckRepository.findAllByUserId(userId);
        List<Card> cards = cardRepository.findAllByUserId(userId);

        Map<Long, Long> cardCountByDeckId = new HashMap<>();
        for (Card card : cards) {
            Long deckId = card.getDeck() != null ? card.getDeck().getId() : null;
            if (deckId == null) continue;
            cardCountByDeckId.put(deckId, cardCountByDeckId.getOrDefault(deckId, 0L) + 1L);
        }

        MetricsSummaryResponse response = new MetricsSummaryResponse();

        long totalReviews = reviews.size();
        long correctReviews = reviews.stream().filter(CardReview::isCorrect).count();
        long goodReviews = reviews.stream().filter(review -> "good".equals(normalizeRating(review.getRating()))).count();
        long easyReviews = reviews.stream().filter(review -> "easy".equals(normalizeRating(review.getRating()))).count();

        response.setTotalReviews(totalReviews);
        response.setCorrectReviews(correctReviews);
        response.setAccuracy(totalReviews > 0 ? (double) correctReviews / totalReviews : 0.0);
        response.setRetentionRate(totalReviews > 0 ? (double) (goodReviews + easyReviews) / totalReviews : 0.0);

        long todayStart = startOfTodayMillis();
        long cardsStudiedToday = reviews.stream()
                .filter(review -> review.getReviewAt() != null && review.getReviewAt() >= todayStart)
                .count();
        response.setCardsStudiedToday(cardsStudiedToday);

        response.setCurrentStreakDays(calculateCurrentStreakDays(reviews));

        response.setTotalSessions((long) sessions.size());

        long totalStudyTimeSeconds = 0L;
        Long latestSessionEndedAt = null;
        for (StudySession session : sessions) {
            Date startTime = session.getStartTime();
            Date endTime = session.getEndTime();

            if (startTime != null && endTime != null) {
                long durationMs = Math.max(endTime.getTime() - startTime.getTime(), 0L);
                totalStudyTimeSeconds += durationMs / 1000L;
            }

            if (endTime != null) {
                long endAt = endTime.getTime();
                if (latestSessionEndedAt == null || endAt > latestSessionEndedAt) {
                    latestSessionEndedAt = endAt;
                }
            }
        }

        response.setTotalStudyTimeSeconds(totalStudyTimeSeconds);
        response.setAverageSessionDurationSeconds(
                sessions.isEmpty() ? 0L : Math.round((double) totalStudyTimeSeconds / sessions.size())
        );
        response.setLatestSessionEndedAt(latestSessionEndedAt);

        Map<Long, List<CardReview>> reviewsByDeckId = new HashMap<>();
        for (CardReview review : reviews) {
            if (review.getStudySession() == null || review.getStudySession().getDeck() == null) {
                continue;
            }
            Long deckId = review.getStudySession().getDeck().getId();
            reviewsByDeckId.computeIfAbsent(deckId, ignored -> new ArrayList<>()).add(review);
        }

        Map<Long, Long> lastActiveByDeckId = new HashMap<>();
        for (StudySession session : sessions) {
            if (session.getDeck() == null) continue;
            Long deckId = session.getDeck().getId();
            Date endTime = session.getEndTime();
            if (endTime == null) continue;

            long endAt = endTime.getTime();
            long current = lastActiveByDeckId.getOrDefault(deckId, 0L);
            if (endAt > current) {
                lastActiveByDeckId.put(deckId, endAt);
            }
        }

        List<DeckMetricResponse> deckMetrics = new ArrayList<>();
        for (Deck deck : decks) {
            Long deckId = deck.getId();
            List<CardReview> deckReviews = reviewsByDeckId.getOrDefault(deckId, List.of());

            long deckTotalReviews = deckReviews.size();
            long deckCorrectReviews = deckReviews.stream().filter(CardReview::isCorrect).count();
            long reviewedCards = deckReviews.stream()
                    .map(review -> review.getCard() != null ? review.getCard().getId() : null)
                    .filter(id -> id != null)
                    .distinct()
                    .count();

            double mastery = deckTotalReviews > 0 ? (double) deckCorrectReviews / deckTotalReviews : 0.0;
            double efficiency = mastery;

            DeckMetricResponse metric = new DeckMetricResponse();
            metric.setDeckId(deckId);
            metric.setDeckName(deck.getName());
            metric.setTotalCards(cardCountByDeckId.getOrDefault(deckId, 0L));
            metric.setReviewedCards(reviewedCards);
            metric.setMastery(mastery);
            metric.setEfficiency(efficiency);
            metric.setStatus(resolveStatus(mastery));

            long lastActive = lastActiveByDeckId.getOrDefault(deckId, 0L);
            if (lastActive == 0L) {
                lastActive = toMillis(deck.getUpdatedAt());
            }
            metric.setLastActive(lastActive);

            deckMetrics.add(metric);
        }

        deckMetrics.sort(Comparator.comparing(DeckMetricResponse::getLastActive, Comparator.nullsFirst(Long::compareTo)).reversed());
        response.setDeckMetrics(deckMetrics);

        return response;
    }

    private String normalizeRating(String rating) {
        return rating == null ? "" : rating.trim().toLowerCase(Locale.ROOT);
    }

    private long startOfTodayMillis() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        return startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    private long calculateCurrentStreakDays(List<CardReview> reviews) {
        if (reviews.isEmpty()) return 0L;

        Set<Long> daySet = new HashSet<>();
        for (CardReview review : reviews) {
            if (review.getReviewAt() == null) continue;
            LocalDateTime date = LocalDateTime.ofInstant(
                    new Date(review.getReviewAt()).toInstant(),
                    ZoneId.systemDefault()
            );
            long dayStart = date.toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
            daySet.add(dayStart);
        }

        if (daySet.isEmpty()) return 0L;

        long streak = 0L;
        LocalDateTime cursor = LocalDateTime.now().toLocalDate().atStartOfDay();

        while (true) {
            long cursorMillis = cursor.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
            if (!daySet.contains(cursorMillis)) {
                break;
            }
            streak++;
            cursor = cursor.minusDays(1);
        }

        return streak;
    }

    private String resolveStatus(double mastery) {
        if (mastery >= 0.85) return "MASTERED";
        if (mastery >= 0.6) return "IN PROGRESS";
        return "NEEDS WORK";
    }

    private long toMillis(LocalDateTime value) {
        if (value == null) return 0L;
        return value.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }
}
