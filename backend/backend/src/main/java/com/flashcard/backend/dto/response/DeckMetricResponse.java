package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class DeckMetricResponse {
    private Long deckId;
    private String deckName;
    private Long totalCards;
    private Long reviewedCards;
    private Double mastery;
    private Double efficiency;
    private String status;
    private Long lastActive;
}
