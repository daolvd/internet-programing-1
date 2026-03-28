package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class CardReviewResponse {
    private Long id;
    private boolean isCorrect;
    private String rating;
    private Long reviewAt;
    private Long responseTimeMs;
    private Long cardId;
    private Long studySessionId;
}
