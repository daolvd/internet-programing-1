package com.flashcard.backend.dto.request;

import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DeckRequest {
    @NotBlank(message = "deck name is required", groups = {CreateValidation.class, UpdateValidation.class})
    String name;

    @NotNull(message = "categoryId is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "categoryId must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    Long categoryId;

    @NotNull(message = "deck id is required", groups = UpdateValidation.class)
    @Positive(message = "deck id must be positive", groups = UpdateValidation.class)
    Long id;
}
