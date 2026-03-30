package com.flashcard.backend.dto.response;

import lombok.Data;

@Data
public class CardResponse {
	private Long id;
	private String question;
	private String answer;
	private String status;
	private Long deckId;
}
