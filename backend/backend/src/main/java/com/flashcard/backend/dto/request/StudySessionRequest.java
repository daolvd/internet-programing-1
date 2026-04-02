package com.flashcard.backend.dto.request;

import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StudySessionRequest {
    @NotNull(message = "study session id is required", groups = UpdateValidation.class)
    @Positive(message = "study session id must be positive", groups = UpdateValidation.class)
    private Long id;

    @NotNull(message = "startTime is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "startTime must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long startTime;

    @NotNull(message = "endTime is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "endTime must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long endTime;

    @NotNull(message = "deckId is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "deckId must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long deckId;
}
