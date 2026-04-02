package com.flashcard.backend.dto.request;

import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CardRequest {
    @NotNull(message = "card id is required", groups = UpdateValidation.class)
    @Positive(message = "card id must be positive", groups = UpdateValidation.class)
    private Long id;

    @NotBlank(message = "question is required", groups = {CreateValidation.class, UpdateValidation.class})
    private String question;

    @NotBlank(message = "answer is required", groups = {CreateValidation.class, UpdateValidation.class})
    private String answer;

    @NotBlank(message = "status is required", groups = {CreateValidation.class, UpdateValidation.class})
    private String status;

    @NotNull(message = "deckId is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "deckId must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long deckId;
}
