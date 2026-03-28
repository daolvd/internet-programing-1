package com.flashcard.backend.dto.request;

import lombok.Data;

@Data
public class DeckRequest {
    String name;
    Long categoryId;
    Long id;
}
