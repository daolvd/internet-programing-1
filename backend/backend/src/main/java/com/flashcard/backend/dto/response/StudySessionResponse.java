package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class StudySessionResponse {
    private Long id;
    private Long startTime;
    private Long endTime;
    private Long deckId;
    private Long userId;
}
