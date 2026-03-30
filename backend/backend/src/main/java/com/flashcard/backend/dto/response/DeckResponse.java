package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class DeckResponse {
    private Long id;
    private String name;
    private Long categoryId;
    private Long cards;
    private String status;
    private Long lastActive;
}
