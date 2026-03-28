package com.flashcard.backend.service;

import com.flashcard.backend.dto.request.CardReviewRequest;
import com.flashcard.backend.dto.response.CardReviewResponse;
import com.flashcard.backend.model.Card;
import com.flashcard.backend.model.CardReview;
import com.flashcard.backend.model.StudySession;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.CardReviewRepository;
import com.flashcard.backend.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardReviewService {
	private final CardReviewRepository cardReviewRepository;
	private final CardRepository cardRepository;
	private final StudySessionRepository studySessionRepository;

	public CardReviewService(
			CardReviewRepository cardReviewRepository,
			CardRepository cardRepository,
			StudySessionRepository studySessionRepository
	) {
		this.cardReviewRepository = cardReviewRepository;
		this.cardRepository = cardRepository;
		this.studySessionRepository = studySessionRepository;
	}

	public List<CardReviewResponse> getAll(Long userId, Long studySessionId) {
		List<CardReview> reviews = cardReviewRepository.getAllByStudySession_IdAndStudySession_User_Id(studySessionId, userId);
		return reviews.stream().map(this::mapToResponse).toList();
	}

	public CardReviewResponse create(Long userId, CardReviewRequest request) {
		Card card = cardRepository.getCardByIdAndDeck_Category_User_Id(request.getCardId(), userId);
		if (card == null) throw new RuntimeException("Card not found");

		StudySession session = studySessionRepository.getStudySessionByIdAndUser_Id(request.getStudySessionId(), userId);
		if (session == null) throw new RuntimeException("Study session not found");

		CardReview review = new CardReview();
		review.setCorrect(Boolean.TRUE.equals(request.getIsCorrect()));
		review.setRating(request.getRating());
		review.setReviewAt(request.getReviewAt());
		review.setResponseTimeMs(request.getResponseTimeMs());
		review.setCard(card);
		review.setStudySession(session);
		cardReviewRepository.save(review);

		return mapToResponse(review);
	}

	public CardReviewResponse update(Long userId, CardReviewRequest request) {
		CardReview review = cardReviewRepository.getCardReviewByIdAndStudySession_User_Id(request.getId(), userId);
		if (review == null) throw new RuntimeException("Card review not found");

		if (request.getCardId() != null && !request.getCardId().equals(review.getCard().getId())) {
			Card card = cardRepository.getCardByIdAndDeck_Category_User_Id(request.getCardId(), userId);
			if (card == null) throw new RuntimeException("Card not found");
			review.setCard(card);
		}

		if (request.getStudySessionId() != null && !request.getStudySessionId().equals(review.getStudySession().getId())) {
			StudySession session = studySessionRepository.getStudySessionByIdAndUser_Id(request.getStudySessionId(), userId);
			if (session == null) throw new RuntimeException("Study session not found");
			review.setStudySession(session);
		}

		if (request.getIsCorrect() != null) {
			review.setCorrect(request.getIsCorrect());
		}
		review.setRating(request.getRating());
		review.setReviewAt(request.getReviewAt());
		review.setResponseTimeMs(request.getResponseTimeMs());
		cardReviewRepository.save(review);

		return mapToResponse(review);
	}

	public CardReviewResponse delete(Long userId, Long cardReviewId) {
		CardReview review = cardReviewRepository.getCardReviewByIdAndStudySession_User_Id(cardReviewId, userId);
		if (review == null) throw new RuntimeException("Card review not found");

		cardReviewRepository.delete(review);
		return null;
	}

	private CardReviewResponse mapToResponse(CardReview review) {
		CardReviewResponse response = new CardReviewResponse();
		response.setId(review.getId());
		response.setCorrect(review.isCorrect());
		response.setRating(review.getRating());
		response.setReviewAt(review.getReviewAt());
		response.setResponseTimeMs(review.getResponseTimeMs());
		response.setCardId(review.getCard() != null ? review.getCard().getId() : null);
		response.setStudySessionId(review.getStudySession() != null ? review.getStudySession().getId() : null);
		return response;
	}
}
