package com.flashcard.backend.dto.request;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
    String name;
    Long id;
}
