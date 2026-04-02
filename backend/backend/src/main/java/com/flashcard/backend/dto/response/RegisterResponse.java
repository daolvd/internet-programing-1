package com.flashcard.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RegisterResponse {
    private Long id;
    private LocalDateTime createdAt;
}
