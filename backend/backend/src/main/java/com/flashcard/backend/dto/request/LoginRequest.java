package com.flashcard.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "clientSeed is required")
    private String clientSeed;
}
