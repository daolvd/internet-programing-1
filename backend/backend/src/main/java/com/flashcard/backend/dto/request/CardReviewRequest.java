package com.flashcard.backend.dto.request;

import lombok.Data;

@Data
public class CardReviewRequest {
    private Long id;
    private Boolean isCorrect;
    private String rating;
    private Long reviewAt;
    private Long responseTimeMs;
    private Long cardId;
    private Long studySessionId;
}
