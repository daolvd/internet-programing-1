package com.flashcard.backend.dto.request;

import lombok.Data;

@Data
public class StudySessionRequest {
    private Long id;
    private Long startTime;
    private Long endTime;
    private Long deckId;
}
