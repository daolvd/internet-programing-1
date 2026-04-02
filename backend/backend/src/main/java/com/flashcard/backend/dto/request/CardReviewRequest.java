package com.flashcard.backend.dto.request;

import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CardReviewRequest {
    @NotNull(message = "card review id is required", groups = UpdateValidation.class)
    @Positive(message = "card review id must be positive", groups = UpdateValidation.class)
    private Long id;

    @NotNull(message = "isCorrect is required", groups = {CreateValidation.class, UpdateValidation.class})
    private Boolean isCorrect;

    @NotBlank(message = "rating is required", groups = {CreateValidation.class, UpdateValidation.class})
    private String rating;

    @NotNull(message = "reviewAt is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "reviewAt must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long reviewAt;

    @NotNull(message = "responseTimeMs is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "responseTimeMs must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long responseTimeMs;

    @NotNull(message = "cardId is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "cardId must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long cardId;

    @NotNull(message = "studySessionId is required", groups = {CreateValidation.class, UpdateValidation.class})
    @Positive(message = "studySessionId must be positive", groups = {CreateValidation.class, UpdateValidation.class})
    private Long studySessionId;
}
