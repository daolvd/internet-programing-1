package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private Long decks;
    private Long cards;
    private boolean active;
    private Double proficiency;
}
