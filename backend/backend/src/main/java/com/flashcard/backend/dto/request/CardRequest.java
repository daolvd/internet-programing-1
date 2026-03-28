package com.flashcard.backend.dto.request;

import lombok.Data;

@Data
public class CardRequest {
    private Long id;
    private String question;
    private String answer;
    private String status;
    private Long deckId;
}
