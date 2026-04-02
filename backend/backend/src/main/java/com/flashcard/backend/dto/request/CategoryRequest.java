package com.flashcard.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotNull(message = "category id is required")
    @Positive(message = "category id must be positive")
    Long id;
}
